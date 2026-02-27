import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useArtist } from '@/hooks/useApi';
import { AlbumCard } from '@/components/AlbumCard';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton, AlbumCardSkeleton } from '@/components/Skeleton';

// ─── Component ────────────────────────────────────────────────────────────────

export default function ArtistScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data: artist, isLoading, error, refetch } = useArtist(slug ?? '');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color="#ffffff" />
        <Text style={styles.backLabel}>Back</Text>
      </TouchableOpacity>

      {error && !isLoading ? (
        <ErrorState
          message="Could not load artist. Please try again."
          onRetry={() => void refetch()}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Artist Header */}
          <View style={styles.header}>
            {isLoading ? (
              <>
                <Skeleton width={180} height={180} borderRadius={9999} />
                <View style={styles.headerText}>
                  <Skeleton width="60%" height={28} />
                  <Skeleton width="80%" height={14} />
                  <Skeleton width="70%" height={14} />
                </View>
              </>
            ) : artist ? (
              <>
                {artist.imageUrl ? (
                  <Image source={{ uri: artist.imageUrl }} style={styles.artistImage} />
                ) : (
                  <View style={[styles.artistImage, styles.artistImagePlaceholder]}>
                    <Text style={styles.artistInitial}>
                      {artist.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.headerText}>
                  <Text style={styles.artistName}>{artist.name}</Text>
                  {artist.bio ? (
                    <Text style={styles.artistBio}>{artist.bio}</Text>
                  ) : null}
                </View>
              </>
            ) : null}
          </View>

          {/* Albums Section */}
          <View style={styles.albumsSection}>
            <Text style={styles.sectionTitle}>Albums</Text>

            {isLoading ? (
              <View style={styles.albumGrid}>
                <AlbumCardSkeleton />
                <AlbumCardSkeleton />
                <AlbumCardSkeleton />
              </View>
            ) : artist?.albums && artist.albums.length > 0 ? (
              <View style={styles.albumGrid}>
                {artist.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} size="medium" />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No albums yet</Text>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  backLabel: {
    fontSize: 16,
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 16,
  },
  artistImage: {
    width: 180,
    height: 180,
    borderRadius: 9999,
  },
  artistImagePlaceholder: {
    backgroundColor: '#2d2d2d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistInitial: {
    fontSize: 56,
    fontWeight: '700',
    color: '#6b7280',
  },
  headerText: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  artistName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  artistBio: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 21,
  },
  albumsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  albumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#4b5563',
    paddingVertical: 8,
  },
});
