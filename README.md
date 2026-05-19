# AI Stock Analyst

AI-powered A-share stock analysis website MVP.

## Structure

```text
frontend/  Next.js, React, TailwindCSS
backend/   FastAPI, OpenAI API, AKShare
prompts/   AI prompt templates
docs/      Project notes
skills/    Build instructions
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Default URL: `http://localhost:3000`

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Default URL: `http://127.0.0.1:8000`

## Notes

The app is for market interpretation, trend explanation, sentiment context, and risk awareness only.

AI-generated analysis for reference only.
