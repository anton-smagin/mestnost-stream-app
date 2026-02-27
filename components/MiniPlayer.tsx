import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import { usePlayerStore } from '@/stores/playerStore';

// ─── Component ────────────────────────────────────────────────────────────────

export function MiniPlayer() {
  const router = useRouter();
  const {
    currentTrack,
    isPlaying,
    positionMs,
    durationMs,
    pause,
    resume,
    next,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const progress = durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0;

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

  const handleOpenPlayer = () => {
    router.push('/player');
  };

  return (
    <View style={styles.wrapper}>
      {/* Thin progress bar at very top */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <TouchableOpacity
        style={styles.container}
        onPress={handleOpenPlayer}
        activeOpacity={0.9}
      >
        {/* Artwork placeholder */}
        <View style={[styles.artwork, styles.artworkPlaceholder]} />

        {/* Track info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Track {currentTrack.trackNumber}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={handlePlayPause}
            style={styles.controlButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isPlaying ? (
              <Pause size={22} color="#ffffff" fill="#ffffff" />
            ) : (
              <Play size={22} color="#ffffff" fill="#ffffff" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={styles.controlButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <SkipForward size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#242424',
  },
  progressTrack: {
    height: 2,
    backgroundColor: '#2d2d2d',
    width: '100%',
  },
  progressFill: {
    height: 2,
    backgroundColor: '#d946ef',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: 4,
    flexShrink: 0,
  },
  artworkPlaceholder: {
    backgroundColor: '#2d2d2d',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlButton: {
    padding: 8,
  },
});
