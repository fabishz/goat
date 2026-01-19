# Backend V1 Scope

**Version**: 1.0.0
**Status**: Frozen
**Date**: 2026-01-19

## 1. Core Objectives
Backend V1 is the foundational release for the GOAT Ranking Platform. Its primary goal is to provide a stable, deterministic, and secure API for ranking entities using a multi-factor scoring engine.

## 2. In-Scope Features
### Scoring Engine
- Deterministic calculation of scores based on weighted components.
- Normalization (Min-Max, Log) and Era Adjustment (Z-Score).
- Immutable snapshots of rankings.

### Expert System
- Expert registration and verification.
- Weighted voting (capped at 20%).
- Conflict of interest disclosure.

### Fan Voting
- Trust-based fan voting (capped at 10%).
- Anti-abuse mechanisms (rate limiting, trust scores).

### AI Influence
- Traceable influence scoring (capped at 15%).
- Breadth, Depth, Longevity, and Peer Acknowledgment metrics.

### Architecture
- FastAPI + PostgreSQL (Neon).
- JWT Authentication.
- Role-Based Access Control (User, Expert, Admin).

## 3. Out-of-Scope (Deferred to V2)
- **Real-time Scoring**: V1 uses on-demand or scheduled calculation.
- **Social Auth**: V1 uses email/password or API keys.
- **Public Comments**: V1 is strictly for ranking and voting.
- **Advanced ML**: V1 uses heuristic/statistical AI, not generative LLMs for scoring.
- **User Profiles**: V1 has minimal user data (Auth + Trust Score).

## 4. Constraints
- **Determinism**: Re-running scoring on the same data MUST yield the same result.
- **Immutability**: Once a snapshot is published, it cannot be changed.
- **Caps**: Expert (20%), Fan (10%), AI (15%) caps are HARD limits.

## 5. Sign-off
This scope is frozen. Any new feature request requires a V2 change request.
