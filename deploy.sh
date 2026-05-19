#!/bin/bash
# Auto-deploy script triggered by GitHub Actions
set -e

PROJECT_DIR="/var/www/ai-stock"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOG_FILE="/var/log/ai-stock-deploy.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========== Deploy Started =========="
cd "$PROJECT_DIR"

# Pull latest code
log "Pulling latest code..."
git pull origin main 2>&1 | tee -a "$LOG_FILE"

# --- Backend ---
if [ -f "$BACKEND_DIR/requirements.txt" ]; then
    log "Checking backend dependencies..."
    cd "$BACKEND_DIR"
    # Only reinstall if requirements.txt changed
    if ! diff <(sort requirements.txt) <(sort "$PROJECT_DIR/.cache/requirements.txt" 2>/dev/null) > /dev/null 2>&1; then
        log "Backend dependencies changed, reinstalling..."
        .venv/bin/pip install -r requirements.txt 2>&1 | tee -a "$LOG_FILE"
        mkdir -p "$PROJECT_DIR/.cache"
        cp requirements.txt "$PROJECT_DIR/.cache/requirements.txt"
    else
        log "Backend dependencies unchanged, skip install."
    fi
fi

# --- Frontend ---
if [ -f "$FRONTEND_DIR/package.json" ]; then
    log "Checking frontend dependencies..."
    cd "$FRONTEND_DIR"
    if ! diff <(jq -S '.dependencies' package.json) <(jq -S '.dependencies' "$PROJECT_DIR/.cache/package.json" 2>/dev/null) > /dev/null 2>&1; then
        log "Frontend dependencies changed, reinstalling and rebuilding..."
        npm install 2>&1 | tee -a "$LOG_FILE"
        npm run build 2>&1 | tee -a "$LOG_FILE"
        mkdir -p "$PROJECT_DIR/.cache"
        cp package.json "$PROJECT_DIR/.cache/package.json"
    else
        log "Frontend dependencies unchanged, skip rebuild."
    fi
fi

# --- Restart services ---
log "Restarting backend..."
systemctl restart ai-stock-backend 2>&1 | tee -a "$LOG_FILE"

log "Restarting frontend..."
systemctl restart ai-stock-frontend 2>&1 | tee -a "$LOG_FILE"

# Verify
sleep 3
if systemctl is-active --quiet ai-stock-backend && systemctl is-active --quiet ai-stock-frontend; then
    log "Deploy SUCCESS — both services running."
else
    log "Deploy WARNING — service check failed!"
    systemctl status ai-stock-backend --no-pager -l 2>&1 | tee -a "$LOG_FILE"
    systemctl status ai-stock-frontend --no-pager -l 2>&1 | tee -a "$LOG_FILE"
fi

log "========== Deploy Finished =========="
