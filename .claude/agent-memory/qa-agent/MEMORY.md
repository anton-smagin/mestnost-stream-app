# QA Agent Memory — Label Stream

## Project Layout
- Backend: /workspace/backend (FastAPI + SQLAlchemy + Alembic + PostgreSQL)
- Mobile: /workspace/mobile (Expo + React Native + Zustand + TanStack Query)
- Scripts: /workspace/scripts/verify_all.sh

## Test Suite Status (as of Phase 6, 2026-02-27)

### Backend
- 55 tests across 9 test files — all pass consistently
- Test files: test_admin, test_albums, test_artists, test_auth, test_health,
  test_playlists, test_search, test_tracks, test_users
- Run time: ~8 seconds
- Uses pytest-asyncio in AUTO mode with session-scoped loop

### Mobile
- 6 tests in __tests__/stores.test.ts (authStore unit tests)
- Run time: <1 second
- No component or screen-level tests yet — this is a coverage gap

## Phase 5 File Inventory (verified present)

### Components (/workspace/mobile/components/)
- TrackRow.tsx (111 lines)
- AlbumCard.tsx (68 lines)
- ArtistCard.tsx (80 lines)
- Skeleton.tsx (118 lines)
- ErrorState.tsx (57 lines)
- EmptyState.tsx (44 lines)
- MiniPlayer.tsx (extra, not required but present)

### Screens (/workspace/mobile/app/)
- (tabs)/index.tsx (234 lines)
- (tabs)/search.tsx (262 lines)
- (tabs)/library.tsx (331 lines)
- (tabs)/profile.tsx (160 lines)
- artist/[slug].tsx (178 lines)
- album/[id].tsx (272 lines)
- playlist/[id].tsx (221 lines)

## Phase 6 File Inventory (verified present)

### New in Phase 6 (/workspace/mobile/)
- stores/playerStore.ts — Zustand store with expo-av Audio.Sound; soundInstance kept
  outside Zustand to avoid serialisation issues
- app/player.tsx — full-screen modal player with SeekBar (PanResponder), RepeatIcon,
  shuffle/repeat controls
- components/MiniPlayer.tsx — pinned above tab bar via CustomTabBar in _layout.tsx

## Known Gaps
- No component-level or screen-level tests in mobile (only authStore tests exist)
- No tests for playerStore (playTrack, next, previous, shuffle, repeat) — high-value gap
- Recommend adding tests for TrackRow, AlbumCard, ArtistCard, playerStore, and key screens

## Lint / Type Check History
- Phase 5: TypeScript (tsc --noEmit) passed with zero errors
- Phase 5: ESLint passed with zero warnings or errors
- Phase 6: TypeScript (tsc --noEmit) passed with zero errors
- Phase 6: ESLint passed with zero warnings or errors
- pyproject.toml warns about deprecated `tool.uv.dev-dependencies` — not a blocker

## Architecture Notes
- Backend enforces routes -> services -> models layering (verified in tests)
- All models use UUID PKs (verified in test fixtures)
- Audio streaming via presigned R2 URLs — never proxied through backend
- playerStore fetches presigned URL via apiGet(/api/v1/tracks/{id}/stream) then passes
  the URL directly to Audio.Sound.createAsync — no backend byte proxying
- soundInstance is a module-level variable (not Zustand state) to prevent serialisation
- Standard API envelope: { data, error, meta: { page, total } }

## Player-Specific Patterns
- unloadCurrentSound() called before every new createAsync (no memory leaks)
- On track load error: set isLoading=false + call next() to skip
- onPlaybackStatusUpdate fires recordListenHistory + next() on didJustFinish
- repeat='one' reuses currentIndex; repeat='all' wraps; no repeat stops at end
- previous() restarts track if positionMs > 3000ms (Spotify-style)
- SeekBar uses PanResponder with onLayout to get track width for ratio math
- MiniPlayer returns null when currentTrack is null (conditional render)
