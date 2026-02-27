import { create } from 'zustand';
import { Audio, type AVPlaybackStatus } from 'expo-av';
import { type TrackSummary, type RepeatMode } from '@/types';
import { apiGet, apiPost } from '@/services/api';
import { type StreamUrlResponse } from '@/types';

// ─── Configure Audio Mode ─────────────────────────────────────────────────────
//
// Called once at module load. Enables background playback and silent mode.

void Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  shouldDuckAndroid: true,
});

// ─── Internal Audio Instance ─────────────────────────────────────────────────
//
// Kept outside Zustand to avoid serialisation issues.

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

async function recordListenHistory(trackId: string): Promise<void> {
  try {
    await apiPost('/api/v1/me/history', { trackId });
  } catch {
    // Non-critical — swallow silently
  }
}

// ─── State Shape ─────────────────────────────────────────────────────────────

export interface PlayerStore {
  currentTrack: TrackSummary | null;
  queue: TrackSummary[];
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  positionMs: number;
  durationMs: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;

  // Actions
  playTrack: (track: TrackSummary, queue?: TrackSummary[]) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seekTo: (ms: number) => Promise<void>;
  addToQueue: (track: TrackSummary) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  stop: () => Promise<void>;
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
    const rawIndex = resolvedQueue.findIndex((t) => t.id === track.id);
    const index = rawIndex >= 0 ? rawIndex : 0;

    set({
      currentTrack: track,
      queue: resolvedQueue,
      currentIndex: index,
      isLoading: true,
      positionMs: 0,
      durationMs: 0,
    });

    await unloadCurrentSound();

    try {
      const streamUrl = await fetchStreamUrl(track.id);

      const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        set({
          positionMs: status.positionMillis,
          durationMs: status.durationMillis ?? 0,
          isPlaying: status.isPlaying,
        });

        if (status.didJustFinish) {
          void recordListenHistory(track.id);
          void get().next();
        }
      };

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate,
      );

      soundInstance = sound;

      set({
        isPlaying: status.isLoaded ? status.isPlaying : false,
        durationMs: status.isLoaded ? (status.durationMillis ?? 0) : 0,
        isLoading: false,
      });
    } catch (error) {
      console.warn('Failed to load track:', error);
      set({ isLoading: false, isPlaying: false });
      // Attempt to advance to next track on error
      void get().next();
    }
  },

  pause: async () => {
    if (soundInstance) {
      try {
        await soundInstance.pauseAsync();
      } catch {
        // Ignore
      }
    }
    set({ isPlaying: false });
  },

  resume: async () => {
    if (soundInstance) {
      try {
        await soundInstance.playAsync();
      } catch {
        // Ignore
      }
    }
    set({ isPlaying: true });
  },

  next: async () => {
    const { queue, currentIndex, repeatMode, isShuffle } = get();
    if (queue.length === 0) return;

    let nextIndex: number;

    if (repeatMode === 'one') {
      nextIndex = currentIndex;
    } else if (isShuffle) {
      // Pick a random index different from current (if queue has more than 1 track)
      if (queue.length === 1) {
        nextIndex = 0;
      } else {
        let randomIndex: number;
        do {
          randomIndex = Math.floor(Math.random() * queue.length);
        } while (randomIndex === currentIndex);
        nextIndex = randomIndex;
      }
    } else if (currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeatMode === 'all') {
      nextIndex = 0;
    } else {
      // End of queue — stop
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
      try {
        await soundInstance.setPositionAsync(ms);
      } catch {
        // Ignore
      }
    }
    set({ positionMs: ms });
  },

  addToQueue: (track) =>
    set((state) => ({ queue: [...state.queue, track] })),

  setRepeatMode: (mode) => set({ repeatMode: mode }),

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

  stop: async () => {
    await unloadCurrentSound();
    set({
      currentTrack: null,
      queue: [],
      currentIndex: 0,
      isPlaying: false,
      isLoading: false,
      positionMs: 0,
      durationMs: 0,
    });
  },
}));
