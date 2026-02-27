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
      {album.coverUrl ? (
        <Image
          source={{ uri: album.coverUrl }}
          style={[styles.artwork, { width: size, height: size }]}
        />
      ) : (
        <View style={[styles.artwork, styles.artworkPlaceholder, { width: size, height: size }]} />
      )}
      <Text style={styles.title} numberOfLines={2}>
        {album.title}
      </Text>
      {album.artist && (
        <Text style={styles.artist} numberOfLines={1}>
          {album.artist.name}
        </Text>
      )}
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
  artist: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
