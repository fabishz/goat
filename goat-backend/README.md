# GOAT Ranking Engine (Backend)

## Overview
The **GOAT (Greatest of All Time) Ranking Engine** is a sophisticated, mathematically defensible platform for ranking entities (athletes, artists, etc.) across history. It goes beyond simple voting by integrating objective metrics, era normalization, expert analysis, and weighted fan sentiment into a transparent, versioned scoring system.

## Core Features

### 1. 🧮 Deterministic Scoring Engine
- **Multi-Factor Models**: Scores are composed of multiple weighted components (e.g., "Championships", "Stats", "Impact").
- **Normalization**: Supports Min-Max and Logarithmic normalization to handle disparate data scales.
- **Snapshots**: Immutable historical records of rankings at any point in time.

### 2. ⏳ Era Normalization
- **Contextual Fairness**: Adjusts for era-specific factors like competition density, rule changes, and globalization.
- **Z-Score Dominance**: Rewards entities who dominated their specific era, regardless of absolute metric inflation over time.
- **Explainability**: Detailed breakdowns of era multipliers and dominance factors.

### 3. 🧠 Expert Voting System
- **Verified Experts**: Role-based access for subject matter experts (SMEs).
- **Weighted Influence**: Expert votes are weighted by reputation and confidence, capped at 20% of the final score.
- **Auditability**: Mandatory justifications and conflict-of-interest disclosures.

### 4. 🗳️ Trusted Fan Voting
- **Trust-Based Weighting**: Fan votes are weighted by account age, engagement, and consistency.
- **Anti-Abuse**: Automated surge detection, outlier down-weighting, and bot protection.
- **Capped Impact**: Fan sentiment is capped at 10% to prevent popularity contests from overriding objective data.

## Tech Stack
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL (Neon) with SQLAlchemy 2.0 (Async/Sync)
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Architecture**: Clean Architecture (API -> Services -> Repositories -> Models)

## Setup & Installation

### Prerequisites
- Python 3.10+
- PostgreSQL

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/fabishz/goat.git
   cd goat
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   SECRET_KEY=your_secret_key
   BACKEND_CORS_ORIGINS=["http://localhost:3000"]
   ```

5. **Run Migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start Server**
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation
Once running, visit `http://localhost:8000/docs` for the interactive Swagger UI.

### Key Endpoints
- **Scoring**: `/api/v1/scoring/run/{category_id}` - Calculate and retrieve rankings.
- **Eras**: `/api/v1/eras` - Manage historical eras and context factors.
- **Experts**: `/api/v1/experts` - Expert management and voting.
- **Fan Votes**: `/api/v1/fan-votes` - Secure fan voting endpoints.

## Scoring Methodology
The final GOAT score is calculated as follows:

1. **Raw Metric Collection**: Objective data is gathered (e.g., "50 PPG").
2. **Era Adjustment**:
   - `Dominance_Factor = Raw_Value / Era_Average`
   - `Adjusted_Value = Normalized_Value * Era_Multiplier * Dominance_Factor`
3. **Normalization**: Converted to a 0-100 scale based on global min/max.
4. **Weighting**: Component weights are applied (e.g., "Championships" = 40%).
5. **Expert Integration**: Weighted expert consensus is added (max 20%).
6. **Fan Integration**: Weighted fan sentiment is added (max 10%).

## Verification
Run the included verification scripts to test core subsystems:
```bash
python verify_scoring.py   # Test core scoring engine
python verify_experts.py   # Test expert voting
python verify_fan_votes.py # Test fan voting & anti-abuse
python verify_eras.py      # Test era normalization
```

---
*Built for the GOAT Project.*
