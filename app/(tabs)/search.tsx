import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon } from 'lucide-react-native';
import { useSearch } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { ArtistCard } from '@/components/ArtistCard';
import { AlbumCard } from '@/components/AlbumCard';
import { TrackRow } from '@/components/TrackRow';
import { TrackRowSkeleton, ArtistCardSkeleton, AlbumCardSkeleton } from '@/components/Skeleton';
import { usePlayerStore } from '@/stores/playerStore';
import { type TrackSummary } from '@/types';

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { playTrack } = usePlayerStore();

  const {
    data: results,
    isLoading,
    isFetching,
  } = useSearch(debouncedQuery);

  const isSearching = isLoading || isFetching;
  const hasQuery = debouncedQuery.trim().length > 0;

  const hasResults =
    results &&
    (results.artists.length > 0 ||
      results.albums.length > 0 ||
      results.tracks.length > 0);

  const handleTrackPress = (track: TrackSummary) => {
    // Play the tapped track; use the full results track list as the queue
    const trackQueue = results?.tracks ?? [track];
    void playTrack(track, trackQueue);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <SearchIcon size={18} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Artists, albums, tracks..."
          placeholderTextColor="#4b5563"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Empty query prompt */}
        {!hasQuery ? (
          <View style={styles.promptContainer}>
            <Text style={styles.promptTitle}>Search Label Stream</Text>
            <Text style={styles.promptSubtitle}>
              Find your favorite artists, albums, and tracks
            </Text>
          </View>
        ) : isSearching ? (
          /* Loading skeletons */
          <View>
            <Text style={styles.sectionTitle}>Artists</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              <ArtistCardSkeleton />
              <ArtistCardSkeleton />
              <ArtistCardSkeleton />
            </ScrollView>

            <Text style={styles.sectionTitle}>Albums</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              <AlbumCardSkeleton />
              <AlbumCardSkeleton />
            </ScrollView>

            <Text style={styles.sectionTitle}>Tracks</Text>
            <TrackRowSkeleton />
            <TrackRowSkeleton />
            <TrackRowSkeleton />
          </View>
        ) : !hasResults ? (
          /* No results */
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsTitle}>No results</Text>
            <Text style={styles.noResultsSubtitle}>
              Nothing found for "{debouncedQuery}"
            </Text>
          </View>
        ) : (
          /* Results */
          <View>
            {/* Artists */}
            {results.artists.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Artists</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                >
                  {results.artists.map((artist) => (
                    <View key={artist.id} style={styles.artistWrapper}>
                      <ArtistCard artist={artist} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {/* Albums */}
            {results.albums.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Albums</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                >
                  {results.albums.map((album) => (
                    <View key={album.id} style={styles.albumWrapper}>
                      <AlbumCard album={album} size="small" />
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {/* Tracks */}
            {results.tracks.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tracks</Text>
                <FlatList
                  data={results.tracks}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TrackRow track={item} onPress={handleTrackPress} />
                  )}
                  scrollEnabled={false}
                />
              </View>
            ) : null}
          </View>
        )}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2d2d2d',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  artistWrapper: {
    marginRight: 4,
  },
  albumWrapper: {
    marginRight: 4,
  },
  promptContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 32,
    gap: 8,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  promptSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 32,
    gap: 8,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
