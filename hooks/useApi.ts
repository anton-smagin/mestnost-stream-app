import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/api';
import {
  type Artist,
  type Album,
  type Track,
  type Playlist,
  type User,
  type LoginCredentials,
  type RegisterCredentials,
  type TokenResponse,
  type ListenHistoryEntry,
  type LikeEntry,
  type SearchResults,
  type StreamUrlResponse,
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  artists: ['artists'] as const,
  artist: (slug: string) => ['artists', slug] as const,
  album: (id: string) => ['albums', id] as const,
  track: (id: string) => ['tracks', id] as const,
  streamUrl: (id: string) => ['tracks', id, 'stream'] as const,
  search: (query: string) => ['search', query] as const,
  me: ['me'] as const,
  history: (page: number) => ['me', 'history', page] as const,
  likes: (page: number) => ['me', 'likes', page] as const,
  playlists: ['playlists'] as const,
  playlist: (id: string) => ['playlists', id] as const,
} as const;

// ─── Artist Hooks ─────────────────────────────────────────────────────────────

export function useArtists(page = 1) {
  return useQuery({
    queryKey: [...QUERY_KEYS.artists, page],
    queryFn: async () => {
      const response = await apiGet<Artist[]>('/api/v1/artists/', { page });
      return response.data ?? [];
    },
  });
}

export function useArtist(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.artist(slug),
    queryFn: async () => {
      const response = await apiGet<Artist>(`/api/v1/artists/${slug}`);
      if (!response.data) throw new Error('Artist not found');
      return response.data;
    },
    enabled: Boolean(slug),
  });
}

// ─── Album Hooks ─────────────────────────────────────────────────────────────

export function useAlbum(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.album(id),
    queryFn: async () => {
      const response = await apiGet<Album>(`/api/v1/albums/${id}`);
      if (!response.data) throw new Error('Album not found');
      return response.data;
    },
    enabled: Boolean(id),
  });
}

// ─── Track Hooks ─────────────────────────────────────────────────────────────

export function useTrack(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.track(id),
    queryFn: async () => {
      const response = await apiGet<Track>(`/api/v1/tracks/${id}`);
      if (!response.data) throw new Error('Track not found');
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useStreamUrl(trackId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.streamUrl(trackId),
    queryFn: async () => {
      const response = await apiGet<StreamUrlResponse>(`/api/v1/tracks/${trackId}/stream`);
      if (!response.data) throw new Error('Stream URL not available');
      return response.data;
    },
    enabled: Boolean(trackId),
    // Presigned URLs expire — don't cache for long
    staleTime: 1000 * 60 * 4, // 4 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ─── Search Hook ──────────────────────────────────────────────────────────────

export function useSearch(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: async () => {
      const response = await apiGet<SearchResults>('/api/v1/search/', { q: query });
      return response.data ?? { artists: [], albums: [], tracks: [] };
    },
    enabled: query.trim().length > 0,
  });
}

// ─── User / Profile Hooks ─────────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: async () => {
      const response = await apiGet<User>('/api/v1/me/');
      if (!response.data) throw new Error('Profile not found');
      return response.data;
    },
    retry: false,
  });
}

export function useHistory(page = 1) {
  return useQuery({
    queryKey: QUERY_KEYS.history(page),
    queryFn: async () => {
      const response = await apiGet<ListenHistoryEntry[]>('/api/v1/me/history', { page });
      return response.data ?? [];
    },
  });
}

export function useLikes(page = 1) {
  return useQuery({
    queryKey: QUERY_KEYS.likes(page),
    queryFn: async () => {
      const response = await apiGet<LikeEntry[]>('/api/v1/me/likes', { page });
      return response.data ?? [];
    },
  });
}

// ─── Playlist Hooks ───────────────────────────────────────────────────────────

export function usePlaylists() {
  return useQuery({
    queryKey: QUERY_KEYS.playlists,
    queryFn: async () => {
      const response = await apiGet<Playlist[]>('/api/v1/playlists/');
      return response.data ?? [];
    },
  });
}

export function usePlaylist(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.playlist(id),
    queryFn: async () => {
      const response = await apiGet<Playlist>(`/api/v1/playlists/${id}`);
      if (!response.data) throw new Error('Playlist not found');
      return response.data;
    },
    enabled: Boolean(id),
  });
}

// ─── Auth Mutation Hooks ──────────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiPost<TokenResponse>('/api/v1/auth/login', credentials);
      if (!response.data) throw new Error('Login failed');
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const payload = {
        email: credentials.email,
        password: credentials.password,
        display_name: credentials.displayName,
      };
      const response = await apiPost<User>('/api/v1/auth/register', payload);
      if (!response.data) throw new Error('Registration failed');
      return response.data;
    },
  });
}

// ─── Like Mutation Hooks ──────────────────────────────────────────────────────

export function useLikeTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackId: string) => {
      await apiPost(`/api/v1/me/likes/${trackId}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.likes(1) });
    },
  });
}

export function useUnlikeTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackId: string) => {
      await apiDelete(`/api/v1/me/likes/${trackId}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.likes(1) });
    },
  });
}

// ─── Listen History Mutation Hook ─────────────────────────────────────────────

export function useRecordListen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackId: string) => {
      await apiPost('/api/v1/me/history', { track_id: trackId });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(1) });
    },
  });
}

// ─── Playlist Mutation Hooks ──────────────────────────────────────────────────

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; isPublic?: boolean }) => {
      const response = await apiPost<Playlist>('/api/v1/playlists/', {
        name: input.name,
        is_public: input.isPublic ?? false,
      });
      if (!response.data) throw new Error('Failed to create playlist');
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists });
    },
  });
}

export function useUpdatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; name?: string; isPublic?: boolean }) => {
      const response = await apiPut<Playlist>(`/api/v1/playlists/${input.id}`, {
        name: input.name,
        is_public: input.isPublic,
      });
      if (!response.data) throw new Error('Failed to update playlist');
      return response.data;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlist(variables.id) });
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playlistId: string) => {
      await apiDelete(`/api/v1/playlists/${playlistId}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists });
    },
  });
}

export function useAddTrackToPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { playlistId: string; trackId: string }) => {
      await apiPost(`/api/v1/playlists/${input.playlistId}/tracks`, {
        track_id: input.trackId,
      });
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.playlist(variables.playlistId),
      });
    },
  });
}

export function useRemoveTrackFromPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { playlistId: string; trackId: string }) => {
      await apiDelete(`/api/v1/playlists/${input.playlistId}/tracks/${input.trackId}`);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.playlist(variables.playlistId),
      });
    },
  });
}
