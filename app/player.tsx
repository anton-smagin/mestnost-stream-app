import { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
} from 'lucide-react-native';
import { usePlayerStore } from '@/stores/playerStore';
import { type RepeatMode } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes)}:${String(seconds).padStart(2, '0')}`;
}

// ─── Seek Bar ─────────────────────────────────────────────────────────────────

interface SeekBarProps {
  positionMs: number;
  durationMs: number;
  onSeek: (ms: number) => void;
}

function SeekBar({ positionMs, durationMs, onSeek }: SeekBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const progress = durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      if (trackWidth === 0 || durationMs === 0) return;
      const x = e.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(x / trackWidth, 1));
      onSeek(Math.floor(ratio * durationMs));
    },
    onPanResponderMove: (e) => {
      if (trackWidth === 0 || durationMs === 0) return;
      const x = e.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(x / trackWidth, 1));
      onSeek(Math.floor(ratio * durationMs));
    },
  });

  return (
    <View style={seekStyles.container}>
      <View
        style={seekStyles.track}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <View style={[seekStyles.fill, { width: `${progress * 100}%` }]} />
        <View style={[seekStyles.thumb, { left: `${progress * 100}%` }]} />
      </View>
      <View style={seekStyles.times}>
        <Text style={seekStyles.timeText}>{formatTime(positionMs)}</Text>
        <Text style={seekStyles.timeText}>
          -{formatTime(Math.max(0, durationMs - positionMs))}
        </Text>
      </View>
    </View>
  );
}

const seekStyles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  track: {
    height: 4,
    backgroundColor: '#2d2d2d',
    borderRadius: 2,
    marginBottom: 8,
    position: 'relative',
    justifyContent: 'center',
  },
  fill: {
    height: 4,
    backgroundColor: '#d946ef',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    marginLeft: -7,
    top: -5,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

// ─── Repeat Icon helper ───────────────────────────────────────────────────────

function RepeatIcon({ mode }: { mode: RepeatMode }) {
  if (mode === 'one') {
    return <Repeat1 size={22} color="#d946ef" />;
  }
  if (mode === 'all') {
    return <Repeat size={22} color="#d946ef" />;
  }
  return <Repeat size={22} color="#6b7280" />;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PlayerScreen() {
  const router = useRouter();
  const {
    currentTrack,
    isPlaying,
    isLoading,
    positionMs,
    durationMs,
    repeatMode,
    isShuffle,
    pause,
    resume,
    next,
    previous,
    seekTo,
    setRepeatMode,
    toggleShuffle,
  } = usePlayerStore();

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pause();
    } else {
      await resume();
    }
  };

  const handleNext = async () => {
    await next();
  };

  const handlePrevious = async () => {
    await previous();
  };

  const handleSeek = (ms: number) => {
    void seekTo(ms);
  };

  const handleRepeatCycle = () => {
    const next: RepeatMode =
      repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none';
    setRepeatMode(next);
  };

  const handleDismiss = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />

      {/* Header / Dismiss */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.dismissButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronDown size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Now Playing</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Artwork */}
      <View style={styles.artworkContainer}>
        <View style={styles.artwork} />
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={2}>
          {currentTrack?.title ?? 'Not Playing'}
        </Text>
        <Text style={styles.trackSubtitle}>
          {currentTrack ? `Track ${currentTrack.trackNumber}` : '—'}
        </Text>
      </View>

      {/* Seek Bar */}
      <SeekBar
        positionMs={positionMs}
        durationMs={durationMs}
        onSeek={handleSeek}
      />

      {/* Main Controls */}
      <View style={styles.controls}>
        {/* Shuffle */}
        <TouchableOpacity
          onPress={toggleShuffle}
          style={styles.sideButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Shuffle size={22} color={isShuffle ? '#d946ef' : '#6b7280'} />
        </TouchableOpacity>

        {/* Previous */}
        <TouchableOpacity
          onPress={handlePrevious}
          style={styles.controlButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <SkipBack size={30} color="#ffffff" fill="#ffffff" />
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={[styles.playButton, isLoading && styles.playButtonLoading]}
          activeOpacity={0.85}
        >
          {isPlaying ? (
            <Pause size={32} color="#ffffff" fill="#ffffff" />
          ) : (
            <Play size={32} color="#ffffff" fill="#ffffff" />
          )}
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          onPress={handleNext}
          style={styles.controlButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <SkipForward size={30} color="#ffffff" fill="#ffffff" />
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity
          onPress={handleRepeatCycle}
          style={styles.sideButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <RepeatIcon mode={repeatMode} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  dismissButton: {
    padding: 4,
  },
  headerLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerSpacer: {
    width: 36,
  },
  artworkContainer: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 40,
    marginTop: 16,
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#2d2d2d',
  },
  trackInfo: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 6,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  trackSubtitle: {
    fontSize: 15,
    color: '#9ca3af',
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 4,
  },
  sideButton: {
    padding: 8,
    width: 44,
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#d946ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonLoading: {
    opacity: 0.5,
  },
});
