// ─── API Response Envelope ─────────────────────────────────────────────────

export interface ApiMeta {
  page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  meta: ApiMeta;
}

// ─── Domain Models ──────────────────────────────────────────────────────────

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artist?: Artist;
  coverUrl: string | null;
  releaseDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Track {
  id: string;
  title: string;
  albumId: string;
  album?: Album;
  artistId: string;
  artist?: Artist;
  trackNumber: number;
  durationMs: number;
  streamUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  userId: string;
  tracks?: Track[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
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
