// ─── API Response Envelope ─────────────────────────────────────────────────

export interface ApiMeta {
  page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  meta: ApiMeta | null;
}

// ─── Domain Models ──────────────────────────────────────────────────────────

/**
 * Artist as returned by GET /api/v1/artists/ (list — no bio)
 * and GET /api/v1/artists/{slug} (detail — includes bio and albums)
 */
export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  imageUrl: string | null;
  albums?: Album[];
  createdAt?: string;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  coverImageUrl: string | null;
  releaseDate: string | null;
  tracks?: TrackSummary[];
  createdAt?: string;
}

/**
 * Minimal track shape embedded inside Album responses.
 * Does NOT include file_key or stream URL.
 */
export interface TrackSummary {
  id: string;
  title: string;
  slug: string;
  trackNumber: number;
  durationSeconds: number;
}

/**
 * Full track as returned by GET /api/v1/tracks/{id}
 */
export interface Track {
  id: string;
  title: string;
  slug: string;
  trackNumber: number;
  durationSeconds: number;
  albumId: string;
  fileKey: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  isPublic: boolean;
  tracks?: PlaylistTrackEntry[];
  createdAt: string;
}

// ─── Compound / Nested Types ─────────────────────────────────────────────────

export interface PlaylistTrackEntry {
  id: string;
  track: TrackSummary;
  position: number;
}

export interface ListenHistoryEntry {
  id: string;
  track: TrackSummary;
  listenedAt: string;
}

export interface LikeEntry {
  id: string;
  track: TrackSummary;
  createdAt: string;
}

export interface SearchResults {
  artists: Artist[];
  albums: Album[];
  tracks: TrackSummary[];
}

export interface StreamUrlResponse {
  url: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * Response from POST /api/v1/auth/login
 */
export interface TokenResponse {
  accessToken: string;
  tokenType: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName?: string;
}

// ─── Player ──────────────────────────────────────────────────────────────────

export type RepeatMode = 'none' | 'one' | 'all';

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  positionMs: number;
  durationMs: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
}
