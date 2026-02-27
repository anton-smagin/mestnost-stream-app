import { create } from 'zustand';
import { Audio } from 'expo-av';
import { type Track, type RepeatMode } from '@/types';
import { apiGet } from '@/services/api';
import { type StreamUrlResponse } from '@/types';

// ─── Internal Audio Instance ─────────────────────────────────────────────────

let soundInstance: Audio.Sound | null = null;

async function unloadCurrentSound(): Promise<void> {
  if (soundInstance) {
    try {
      await soundInstance.unloadAsync();
    } catch {
      // Ignore unload errors
    }
    soundInstance = null;
  }
}

async function fetchStreamUrl(trackId: string): Promise<string> {
  const response = await apiGet<StreamUrlResponse>(`/api/v1/tracks/${trackId}/stream`);
  if (!response.data?.url) throw new Error('Stream URL not available');
  return response.data.url;
}

// ─── State Shape ─────────────────────────────────────────────────────────────

interface PlayerStore {
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  positionMs: number;
  durationMs: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;

  // Actions
  playTrack: (track: Track, queue?: Track[]) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seekTo: (ms: number) => Promise<void>;
  addToQueue: (track: Track) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  updatePosition: (positionMs: number, durationMs: number) => void;
  setLoading: (isLoading: boolean) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  isLoading: false,
  positionMs: 0,
  durationMs: 0,
  repeatMode: 'none',
  isShuffle: false,

  playTrack: async (track, queue) => {
    const resolvedQueue = queue ?? [track];
    const index = resolvedQueue.findIndex((t) => t.id === track.id);

    set({
      currentTrack: track,
      queue: resolvedQueue,
      currentIndex: Math.max(0, index),
      isLoading: true,
      positionMs: 0,
      durationMs: 0,
    });

    await unloadCurrentSound();

    try {
      // Fetch presigned stream URL from the backend
      const streamUrl = await fetchStreamUrl(track.id);

      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
      });

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true },
        (playbackStatus) => {
          if (!playbackStatus.isLoaded) return;
          set({
            positionMs: playbackStatus.positionMillis,
            durationMs: playbackStatus.durationMillis ?? 0,
            isPlaying: playbackStatus.isPlaying,
          });
          if (playbackStatus.didJustFinish) {
            void get().next();
          }
        },
      );

      soundInstance = sound;

      set({
        isPlaying: status.isLoaded ? status.isPlaying : false,
        durationMs: status.isLoaded ? (status.durationMillis ?? 0) : 0,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load track:', error);
      set({ isLoading: false, isPlaying: false });
      // Attempt to advance to next track on error
      void get().next();
    }
  },

  pause: async () => {
    if (soundInstance) {
      await soundInstance.pauseAsync();
    }
    set({ isPlaying: false });
  },

  resume: async () => {
    if (soundInstance) {
      await soundInstance.playAsync();
    }
    set({ isPlaying: true });
  },

  next: async () => {
    const { queue, currentIndex, repeatMode } = get();
    if (queue.length === 0) return;

    let nextIndex: number;

    if (repeatMode === 'one') {
      nextIndex = currentIndex;
    } else if (currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeatMode === 'all') {
      nextIndex = 0;
    } else {
      // End of queue
      set({ isPlaying: false });
      return;
    }

    await get().playTrack(queue[nextIndex], queue);
  },

  previous: async () => {
    const { queue, currentIndex, positionMs } = get();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart current track
    if (positionMs > 3000) {
      await get().seekTo(0);
      return;
    }

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    await get().playTrack(queue[prevIndex], queue);
  },

  seekTo: async (ms) => {
    if (soundInstance) {
      await soundInstance.setPositionAsync(ms);
    }
    set({ positionMs: ms });
  },

  addToQueue: (track) =>
    set((state) => ({ queue: [...state.queue, track] })),

  setRepeatMode: (mode) => set({ repeatMode: mode }),

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

  updatePosition: (positionMs, durationMs) => set({ positionMs, durationMs }),

  setLoading: (isLoading) => set({ isLoading }),
}));
