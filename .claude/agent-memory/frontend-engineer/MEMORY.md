# Frontend Engineer Agent Memory — Label Stream

## Project: Label Stream Mobile

### Key File Paths
- Types: `/workspace/mobile/types/index.ts`
- API hooks: `/workspace/mobile/hooks/useApi.ts`
- Debounce hook: `/workspace/mobile/hooks/useDebounce.ts`
- Auth store: `/workspace/mobile/stores/authStore.ts`
- Player store: `/workspace/mobile/stores/playerStore.ts`
- API service: `/workspace/mobile/services/api.ts`
- Components: `/workspace/mobile/components/`
- Screens: `/workspace/mobile/app/`

### Color Palette (from tailwind.config.js)
- Background: `#0f0f0f` (surface.DEFAULT)
- Elevated surfaces: `#1a1a1a` (surface.elevated)
- Overlay/border: `#2d2d2d` (surface.overlay)
- Brand/accent: `#d946ef` (brand.500)
- Text primary: `#ffffff`
- Text secondary: `#9ca3af`
- Text muted: `#6b7280`
- Text placeholder: `#4b5563`
- Error: `#ef4444`

### Component Conventions
- Use `StyleSheet.create()` for all styling — NOT NativeWind className
  (CLAUDE.md mentions NativeWind but all real code uses StyleSheet; className causes TS issues)
- Components are named exports; screens are default exports
- Back navigation: ChevronLeft icon + "Back" text in a TouchableOpacity row
- SafeAreaView with `edges={['top']}` on detail screens; no edges on tab screens
- Icons: `lucide-react-native` (AlertCircle, ChevronLeft, Play, Shuffle, etc.)

### Key Type Distinctions
- `TrackSummary`: minimal track embedded in albums/playlists (no fileKey/streamUrl)
- `Track`: full track with fileKey for streaming — NOT used in playerStore (uses TrackSummary)
- TrackRow component uses `TrackSummary` (not Track)
- playerStore uses `TrackSummary` for queue/currentTrack — stream URL fetched inside store by track.id

### Component Props Summary
- `TrackRow`: `track: TrackSummary`, `index?`, `onPress?`, `artistName?`, `coverImageUrl?`
- `AlbumCard`: `album: Album`, `size?: 'small' | 'medium'` — navigates internally
- `ArtistCard`: `artist: Artist` — navigates internally via `router.push('/artist/[slug]')`
- `Skeleton`: `width?`, `height?`, `borderRadius?`, `className?`
- `ErrorState`: `message: string`, `onRetry?: () => void`
- `EmptyState`: `title: string`, `subtitle?: string`

### Navigation Patterns
- `router.push('/album/[id]')` — from AlbumCard internal handler
- `router.push('/artist/[slug]')` — from ArtistCard internal handler
- `router.replace('/(auth)/sign-in')` — after logout
- `useLocalSearchParams<{ id: string }>()` — for route params on detail screens

### Phase 6 — Player Integration (COMPLETED)
- playerStore: `playTrack(track, queue?)`, `pause/resume/next/previous/seekTo/stop/addToQueue/setRepeatMode/toggleShuffle`
- `RepeatMode` = `'none' | 'all' | 'one'` (NOT 'off')
- playerStore uses `TrackSummary` (not `Track`). Stream URL fetched via `apiGet<StreamUrlResponse>`
- Listen history recorded via `apiPost('/api/v1/me/history', { track_id })` on `didJustFinish`
- Tab layout: `tabBar` prop with `<CustomTabBar>` wraps `<MiniPlayer />` + `<BottomTabBar />` from `@react-navigation/bottom-tabs`
- MiniPlayer: renders `null` when no currentTrack; shows progress bar via positionMs/durationMs ratio
- Player screen: full-screen modal with SeekBar (PanResponder-based), shuffle/repeat/prev/play/next controls
- Shuffle logic: in-store random index picker (not queue pre-shuffle). Shuffle "Play" button pre-shuffles with `shuffleArray` helper
- app.json: `ios.infoPlist.UIBackgroundModes: ["audio"]` added for background playback

### Verification Commands
```bash
npx tsc --noEmit
cd /workspace/mobile && npx eslint . --ext .ts,.tsx
cd /workspace/mobile && npx jest --watchAll=false --passWithNoTests
```
