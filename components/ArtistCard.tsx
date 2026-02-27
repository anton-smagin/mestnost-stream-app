import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { type Artist } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArtistCardProps {
  artist: Artist;
  onPress: (artist: Artist) => void;
  size?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ArtistCard({ artist, onPress, size = 120 }: ArtistCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { width: size }]}
      onPress={() => onPress(artist)}
      activeOpacity={0.8}
    >
      {artist.imageUrl ? (
        <Image
          source={{ uri: artist.imageUrl }}
          style={[styles.image, { width: size, height: size }]}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder, { width: size, height: size }]}>
          <Text style={styles.placeholderInitial}>
            {artist.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={2}>
        {artist.name}
      </Text>
      <Text style={styles.label}>Artist</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  image: {
    borderRadius: 9999,
  },
  imagePlaceholder: {
    backgroundColor: '#2d2d2d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6b7280',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 18,
  },
  label: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
});
