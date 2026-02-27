import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { type Album } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlbumCardProps {
  album: Album;
  onPress: (album: Album) => void;
  size?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AlbumCard({ album, onPress, size = 160 }: AlbumCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { width: size }]}
      onPress={() => onPress(album)}
      activeOpacity={0.8}
    >
      {album.coverImageUrl ? (
        <Image
          source={{ uri: album.coverImageUrl }}
          style={[styles.artwork, { width: size, height: size }]}
        />
      ) : (
        <View style={[styles.artwork, styles.artworkPlaceholder, { width: size, height: size }]} />
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
