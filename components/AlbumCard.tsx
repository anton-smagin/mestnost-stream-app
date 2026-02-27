import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { type Album } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlbumCardProps {
  album: Album;
  size?: 'small' | 'medium';
}

const SIZE_MAP = {
  small: 120,
  medium: 160,
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function AlbumCard({ album, size = 'medium' }: AlbumCardProps) {
  const router = useRouter();
  const dimension = SIZE_MAP[size];

  const handlePress = () => {
    router.push(`/album/${album.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: dimension }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {album.coverImageUrl ? (
        <Image
          source={{ uri: album.coverImageUrl }}
          style={[styles.artwork, { width: dimension, height: dimension }]}
        />
      ) : (
        <View
          style={[styles.artwork, styles.artworkPlaceholder, { width: dimension, height: dimension }]}
        />
      )}
      <Text style={styles.title} numberOfLines={2}>
        {album.title}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  artwork: {
    borderRadius: 8,
  },
  artworkPlaceholder: {
    backgroundColor: '#2d2d2d',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 18,
  },
});
