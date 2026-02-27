import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useArtists } from '@/hooks/useApi';
import { AlbumCard } from '@/components/AlbumCard';
import { ArtistCard } from '@/components/ArtistCard';
import { ErrorState } from '@/components/ErrorState';
import { AlbumCardSkeleton, ArtistCardSkeleton, Skeleton } from '@/components/Skeleton';
import { type Album } from '@/types';

// ─── Helper ───────────────────────────────────────────────────────────────────

function collectNewReleases(albums: Album[], limit = 10): Album[] {
  return albums.slice(0, limit);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { data: artists, isLoading, error, refetch, isRefetching } = useArtists();

  const featuredArtist = artists?.[0] ?? null;

  const newReleases: Album[] = artists
    ? collectNewReleases(
        artists.flatMap((a) => a.albums ?? []),
      )
    : [];

  const handleRefresh = () => {
    void refetch();
  };

  if (error && !isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState
          message="Failed to load content. Please check your connection."
          onRetry={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor="#d946ef"
            colors={['#d946ef']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Label Stream</Text>
        </View>

        {/* Hero — Featured Artist */}
        <View style={styles.section}>
          {isLoading ? (
            <View style={styles.heroBanner}>
              <Skeleton width="100%" height={200} borderRadius={12} />
            </View>
          ) : featuredArtist ? (
            <View style={styles.heroBanner}>
              {featuredArtist.imageUrl ? (
                <Image
                  source={{ uri: featuredArtist.imageUrl }}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.heroImage, styles.heroPlaceholder]} />
              )}
              <View style={styles.heroOverlay}>
                <Text style={styles.heroLabel}>Featured Artist</Text>
                <Text style={styles.heroName}>{featuredArtist.name}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* New Releases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Releases</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {isLoading ? (
              <>
                <AlbumCardSkeleton />
                <AlbumCardSkeleton />
                <AlbumCardSkeleton />
              </>
            ) : newReleases.length > 0 ? (
              newReleases.map((album) => (
                <View key={album.id} style={styles.albumCardWrapper}>
                  <AlbumCard album={album} size="medium" />
                </View>
              ))
            ) : (
              <Text style={styles.emptyHint}>No albums yet</Text>
            )}
          </ScrollView>
        </View>

        {/* All Artists */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Artists</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {isLoading ? (
              <>
                <ArtistCardSkeleton />
                <ArtistCardSkeleton />
                <ArtistCardSkeleton />
              </>
            ) : artists && artists.length > 0 ? (
              artists.map((artist) => (
                <View key={artist.id} style={styles.artistCardWrapper}>
                  <ArtistCard artist={artist} />
                </View>
              ))
            ) : (
              <Text style={styles.emptyHint}>No artists yet</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  albumCardWrapper: {
    marginRight: 4,
  },
  artistCardWrapper: {
    marginRight: 4,
  },
  heroBanner: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    backgroundColor: '#2d2d2d',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroLabel: {
    fontSize: 12,
    color: '#d946ef',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  emptyHint: {
    fontSize: 14,
    color: '#4b5563',
    paddingVertical: 8,
  },
});
