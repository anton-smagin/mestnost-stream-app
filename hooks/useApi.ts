import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/services/api';
import {
  type Artist,
  type Album,
  type Track,
  type Playlist,
  type User,
  type LoginCredentials,
  type RegisterCredentials,
  type AuthTokens,
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  artists: ['artists'] as const,
  artist: (slug: string) => ['artists', slug] as const,
  albums: ['albums'] as const,
  album: (id: string) => ['albums', id] as const,
  albumTracks: (id: string) => ['albums', id, 'tracks'] as const,
  tracks: ['tracks'] as const,
  track: (id: string) => ['tracks', id] as const,
  playlists: ['playlists'] as const,
  playlist: (id: string) => ['playlists', id] as const,
  me: ['me'] as const,
  search: (query: string) => ['search', query] as const,
} as const;

// ─── Artist Hooks ─────────────────────────────────────────────────────────────

export function useArtists(page = 1) {
  return useQuery({
    queryKey: [...QUERY_KEYS.artists, page],
    queryFn: async () => {
      const response = await apiGet<Artist[]>('/api/v1/artists', { page });
      return response;
    },
  });
}

export function useArtist(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.artist(slug),
    queryFn: async () => {
      const response = await apiGet<Artist>(`/api/v1/artists/${slug}`);
      return response;
    },
    enabled: Boolean(slug),
  });
}

// ─── Album Hooks ─────────────────────────────────────────────────────────────

export function useAlbums(page = 1) {
  return useQuery({
    queryKey: [...QUERY_KEYS.albums, page],
    queryFn: async () => {
      const response = await apiGet<Album[]>('/api/v1/albums', { page });
      return response;
    },
  });
}

export function useAlbum(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.album(id),
    queryFn: async () => {
      const response = await apiGet<Album>(`/api/v1/albums/${id}`);
      return response;
    },
    enabled: Boolean(id),
  });
}

export function useAlbumTracks(albumId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.albumTracks(albumId),
    queryFn: async () => {
      const response = await apiGet<Track[]>(`/api/v1/albums/${albumId}/tracks`);
      return response;
    },
    enabled: Boolean(albumId),
  });
}

// ─── Track Hooks ─────────────────────────────────────────────────────────────

export function useTrack(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.track(id),
    queryFn: async () => {
      const response = await apiGet<Track>(`/api/v1/tracks/${id}`);
      return response;
    },
    enabled: Boolean(id),
  });
}

// ─── Playlist Hooks ───────────────────────────────────────────────────────────

export function usePlaylists(page = 1) {
  return useQuery({
    queryKey: [...QUERY_KEYS.playlists, page],
    queryFn: async () => {
      const response = await apiGet<Playlist[]>('/api/v1/playlists', { page });
      return response;
    },
  });
}

export function usePlaylist(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.playlist(id),
    queryFn: async () => {
      const response = await apiGet<Playlist>(`/api/v1/playlists/${id}`);
      return response;
    },
    enabled: Boolean(id),
  });
}

// ─── Auth Hooks ───────────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: async () => {
      const response = await apiGet<User>('/api/v1/auth/me');
      return response;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiPost<{ user: User; tokens: AuthTokens }>(
        '/api/v1/auth/login',
        credentials,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await apiPost<{ user: User; tokens: AuthTokens }>(
        '/api/v1/auth/register',
        credentials,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me });
    },
  });
}

// ─── Search Hook ──────────────────────────────────────────────────────────────

export function useSearch(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: async () => {
      const response = await apiGet<{ artists: Artist[]; albums: Album[]; tracks: Track[] }>(
        '/api/v1/search',
        { q: query },
      );
      return response;
    },
    enabled: query.trim().length > 0,
  });
}
