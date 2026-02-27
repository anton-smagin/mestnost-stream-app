import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Skeleton({ width, height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useSharedValue(1);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      opacity.value = withRepeat(
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    }
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width ?? '100%', height, borderRadius },
        animatedStyle,
        style,
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
        <Skeleton width="45%" height={12} style={styles.trackRowSubtitle} />
      </View>
    </View>
  );
}

export function AlbumCardSkeleton() {
  return (
    <View style={styles.albumCard}>
      <Skeleton width={160} height={160} borderRadius={8} />
      <Skeleton width={120} height={14} style={styles.albumCardTitle} />
      <Skeleton width={80} height={12} style={styles.albumCardSubtitle} />
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
  trackRowSubtitle: {
    marginTop: 2,
  },
  albumCard: {
    width: 160,
    marginRight: 16,
  },
  albumCardTitle: {
    marginTop: 8,
  },
  albumCardSubtitle: {
    marginTop: 4,
  },
});
