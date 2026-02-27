import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { type TrackSummary } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrackRowProps {
  track: TrackSummary;
  index?: number;
  onPress?: (track: TrackSummary) => void;
  artistName?: string;
  coverImageUrl?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TrackRow({
  track,
  index,
  onPress,
  artistName,
  coverImageUrl,
}: TrackRowProps) {
  const displayNumber = index !== undefined ? index + 1 : track.trackNumber;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(track)}
      activeOpacity={0.7}
    >
      <View style={styles.artworkWrapper}>
        {coverImageUrl ? (
          <Image source={{ uri: coverImageUrl }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkPlaceholder]}>
            <Text style={styles.trackNumber}>{displayNumber}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        {artistName ? (
          <Text style={styles.artist} numberOfLines={1}>
            {artistName}
          </Text>
        ) : null}
      </View>

      <Text style={styles.duration}>{formatDuration(track.durationSeconds)}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  artworkWrapper: {
    flexShrink: 0,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  artworkPlaceholder: {
    backgroundColor: '#2d2d2d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackNumber: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  artist: {
    fontSize: 13,
    color: '#9ca3af',
  },
  duration: {
    fontSize: 13,
    color: '#6b7280',
    flexShrink: 0,
  },
});
