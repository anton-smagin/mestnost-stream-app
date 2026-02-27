# Mobile Context — React Native + Expo

## Stack
- Expo SDK 52+, Expo Router v4 (file-based routing)
- Styling: NativeWind v4 (Tailwind CSS for RN)
- State: Zustand (player, auth)
- Server state: TanStack Query v5
- Audio: expo-av
- HTTP: axios
- Icons: lucide-react-native or @expo/vector-icons

## File Structure
```
mobile/
├── app/
│   ├── _layout.tsx           ← root layout (providers, global player)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx       ← tab bar + mini player
│   │   ├── index.tsx         ← Home
│   │   ├── search.tsx
│   │   ├── library.tsx
│   │   └── profile.tsx
│   ├── artist/[slug].tsx
│   ├── album/[id].tsx
│   ├── playlist/[id].tsx
│   └── player.tsx            ← full-screen modal
├── components/
│   ├── MiniPlayer.tsx
│   ├── TrackRow.tsx
│   ├── AlbumCard.tsx
│   ├── ArtistCard.tsx
│   └── Skeleton.tsx
├── hooks/
│   ├── useApi.ts             ← TanStack Query hooks
│   └── useDebounce.ts
├── stores/
│   ├── playerStore.ts
│   └── authStore.ts
├── services/
│   └── api.ts                ← axios instance + interceptors
├── types/
│   └── index.ts              ← shared TypeScript types
└── __tests__/
```

## Patterns

### API Client
- Single axios instance in `services/api.ts` with baseURL and auth interceptor
- TanStack Query hooks in `hooks/useApi.ts`:
  - `useArtists()`, `useArtist(slug)`, `useAlbum(id)`, etc.
  - All hooks return `{ data, isLoading, error, refetch }`

### Player Store (Zustand)
```typescript
interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  // actions
  playTrack: (track: Track, queue?: Track[]) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seekTo: (ms: number) => Promise<void>;
  addToQueue: (track: Track) => void;
}
```
- Uses expo-av `Audio.Sound` internally
- Call `playTrack(track, albumTracks)` to start playback with queue context

### Component Rules
- Use `className` prop (NativeWind) for styling — never inline `style` objects
- Prefer composition: `<Card><CardTitle /><CardBody /></Card>`
- Loading: use `<Skeleton />` components, not spinners
- Errors: show message + "Retry" button
- Lists: use `FlashList` from `@shopify/flash-list` for performance

### Navigation
- Tab screens for main sections
- Stack navigation within tabs (e.g., Home → Artist → Album)
- `player.tsx` presented as modal (full-screen overlay)
- Deep linking: `labelstream://artist/slug`, `labelstream://album/id`

## Verification
```bash
npx tsc --noEmit              # type check
npx eslint . --ext .ts,.tsx   # lint
npx jest --watchAll=false      # tests
```
