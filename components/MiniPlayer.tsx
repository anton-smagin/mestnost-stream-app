import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import { usePlayerStore } from '@/stores/playerStore';

// ─── Component ────────────────────────────────────────────────────────────────

export function MiniPlayer() {
  const router = useRouter();
  const { currentTrack, isPlaying, pause, resume, next } = usePlayerStore();

  if (!currentTrack) return null;

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
    <TouchableOpacity
      style={styles.container}
      onPress={handleOpenPlayer}
      activeOpacity={0.9}
    >
      <View style={[styles.artwork, styles.artworkPlaceholder]} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          Track {currentTrack.trackNumber}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
          {isPlaying ? (
            <Pause size={20} color="#ffffff" fill="#ffffff" />
          ) : (
            <Play size={20} color="#ffffff" fill="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
          <SkipForward size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#242424',
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
