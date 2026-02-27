import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { type Track } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrackRowProps {
  track: Track;
  index?: number;
  onPress: (track: Track) => void;
  onMorePress?: (track: Track) => void;
  isActive?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TrackRow({ track, index, onPress, onMorePress, isActive = false }: TrackRowProps) {
  const coverUrl = track.album?.coverUrl ?? null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(track)}
      activeOpacity={0.7}
    >
      <View style={styles.artworkWrapper}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkPlaceholder]}>
            {index !== undefined && (
              <Text style={styles.trackNumber}>{index + 1}</Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.title, isActive && styles.titleActive]}
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist?.name ?? 'Unknown Artist'}
        </Text>
      </View>

      <Text style={styles.duration}>{formatDuration(track.durationMs)}</Text>

      {onMorePress && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => onMorePress(track)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MoreVertical size={18} color="#6b7280" />
        </TouchableOpacity>
      )}
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
  titleActive: {
    color: '#d946ef',
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
  moreButton: {
    padding: 4,
    flexShrink: 0,
  },
});
