# QA Agent Memory — Label Stream

## Project Structure
- Backend: `/workspace/backend/` (FastAPI + SQLAlchemy + Alembic + PostgreSQL)
- Frontend: `/workspace/mobile/` (Expo + React Native)
- Scripts: `/workspace/scripts/`

## Phase 1 DB Layer — Verified Clean (2026-02-27)
- All 8 tables confirmed: artists, albums, tracks, users, playlists, playlist_tracks, listen_history, likes
- All models use `TimestampMixin` + `Base` with UUID PKs (`uuid.uuid4` default, `UUID(as_uuid=True)`)
- All timestamps use `DateTime(timezone=True)` — confirmed as `timestamp with time zone` in Postgres
- GIN trigram indexes present: `ix_artists_name_trgm`, `ix_albums_title_trgm`, `ix_tracks_title_trgm`
- Migration `fcd8e9391a9c` is additive only, has full downgrade, creates `pg_trgm` extension
- Seed data: artists=3, albums=6, tracks=30, users=1 — idempotent via check-before-insert
- Password hashed with bcrypt (`$2b$12$` prefix confirmed), no plaintext stored
- No business logic in models — pure data layer confirmed
- No SQL injection — seed uses ORM throughout

## Known Lint/Test Baseline
- `uv run ruff check .` + `uv run ruff format --check .` — PASS (27 files, 0 violations)
- `uv run pytest -x -v` — 1 test (test_health), PASS
- `uv.dev-dependencies` deprecation warning in pyproject.toml is cosmetic, not a failure

## Architecture Confirmed
- routes → services → models layering enforced
- `alembic/env.py` imports `Base` from `app.models` which triggers all model imports (correct)
- `PlaylistTrack` has its own UUID PK via `TimestampMixin` (not a pure join table)
- `Like` has its own UUID PK — `uq_likes_user_id_track_id` unique constraint prevents duplicates

## Test Coverage Gap (Phase 1)
- Only 1 test exists (`test_health`). No model-level or DB integration tests yet.
- Flag this when reviewing future phases that add services/endpoints without tests.

## Details
- See `/workspace/mobile/.claude/agent-memory/phase1-db.md` for full review notes
