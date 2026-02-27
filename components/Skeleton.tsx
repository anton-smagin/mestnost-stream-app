import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Skeleton({ width, height = 16, borderRadius = 8 }: SkeletonProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: (width ?? '100%') as number | `${number}%`, height, borderRadius },
        animatedStyle,
      ]}
    />
  );
}

// ─── Preset Skeletons ─────────────────────────────────────────────────────────

export function TrackRowSkeleton() {
  return (
    <View style={styles.trackRow}>
      <Skeleton width={48} height={48} borderRadius={4} />
      <View style={styles.trackRowInfo}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="45%" height={12} />
      </View>
    </View>
  );
}

export function AlbumCardSkeleton() {
  return (
    <View style={styles.albumCard}>
      <Skeleton width={160} height={160} borderRadius={8} />
      <View style={styles.albumCardText}>
        <Skeleton width={120} height={14} />
      </View>
    </View>
  );
}

export function ArtistCardSkeleton() {
  return (
    <View style={styles.artistCard}>
      <Skeleton width={120} height={120} borderRadius={9999} />
      <View style={styles.artistCardText}>
        <Skeleton width={80} height={12} />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#2d2d2d',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  trackRowInfo: {
    flex: 1,
    gap: 6,
  },
  albumCard: {
    width: 160,
    marginRight: 16,
  },
  albumCardText: {
    marginTop: 8,
    gap: 4,
  },
  artistCard: {
    width: 120,
    alignItems: 'center',
    marginRight: 16,
    gap: 8,
  },
  artistCardText: {
    alignItems: 'center',
  },
});
