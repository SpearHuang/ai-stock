# AI Stock Analyst Website Skill

You are building an AI-powered A-share stock analysis website.

# Project Goal

Build an MVP website that allows users to:

1. Input a Chinese A-share stock code
2. Fetch stock data
3. Generate AI-based stock analysis
4. Display readable market insights

The website is NOT a trading system.

The website does NOT provide financial advice.

The website focuses on:

* Market interpretation
* Trend explanation
* Sentiment analysis
* Risk awareness

# Tech Stack

Frontend:

* Next.js
* React
* TailwindCSS
* shadcn/ui

Backend:

* Python
* FastAPI

AI:

* OpenAI API

Stock Data:

* AKShare

# Coding Rules

## Frontend Rules

* Use clean component structure
* Prefer server components when possible
* Use TypeScript
* Avoid overly complex state management
* Keep UI minimal and professional
* Mobile responsive

## Backend Rules

* Use FastAPI routers
* Separate services and APIs
* Use async where possible
* Validate all request params
* Add error handling for all stock APIs

## AI Prompt Rules

AI output must always contain:

1. Market Position
2. Technical Trend
3. Hot Sector Relation
4. Risk Factors
5. Short-term Observation

Never provide:

* Buy recommendations
* Guaranteed returns
* Financial promises

Always include:
"AI-generated analysis for reference only."

# Data Rules

Stock data should include:

* Daily K-line
* Volume
* Turnover
* Sector information
* Recent news

Do NOT hallucinate missing data.

If data is unavailable:

* Clearly say data unavailable
* Do not fabricate

# UI Style

Style:

* Dark professional trading style
* Similar to modern fintech dashboards
* Clean typography
* Minimal animation

# Folder Architecture

frontend/

* app/
* components/
* lib/
* services/

backend/

* api/
* services/
* models/
* utils/

# MVP Features

Phase 1:

* Search stock by code
* Show stock info
* AI analysis page

Phase 2:

* Daily market review
* Hot sector analysis
* News interpretation

Phase 3:

* AI watchlist
* Real-time alerts
* Agent workflows

# Important Constraints

* Keep architecture simple
* Avoid premature optimization
* Prioritize fast iteration
* Avoid overengineering

# Code Quality

* Write readable code
* Add comments for critical logic
* Keep files small
* Reuse components
* Prefer composition over duplication

# Security

* Never expose API keys
* Use environment variables
* Sanitize all inputs

# Development Philosophy

Build fast.
Ship early.
Iterate continuously.

Focus on:

* User understanding
* Information clarity
* Simplicity

NOT on:

* Predicting stock prices
* High-frequency trading
* Complex quant systems
