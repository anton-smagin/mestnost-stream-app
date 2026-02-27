import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Play, Shuffle } from 'lucide-react-native';
import { usePlaylist } from '@/hooks/useApi';
import { TrackRow } from '@/components/TrackRow';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { TrackRowSkeleton, Skeleton } from '@/components/Skeleton';
import { type TrackSummary } from '@/types';

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: playlist, isLoading, error, refetch } = usePlaylist(id ?? '');

  const tracks: TrackSummary[] = playlist?.tracks
    ? [...playlist.tracks]
        .sort((a, b) => a.position - b.position)
        .map((entry) => entry.track)
    : [];

  const handlePlayAll = () => {
    // Phase 6: connect to player
  };

  const handleShuffle = () => {
    // Phase 6: connect to player with shuffle
  };

  const handleTrackPress = (_track: TrackSummary) => {
    // Phase 6: connect to player
  };

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
          message="Could not load playlist. Please try again."
          onRetry={() => void refetch()}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            {isLoading ? (
              <View style={styles.headerMeta}>
                <Skeleton width="60%" height={28} />
                <Skeleton width="40%" height={14} />
              </View>
            ) : playlist ? (
              <View style={styles.headerMeta}>
                <Text style={styles.playlistName}>{playlist.name}</Text>
                <Text style={styles.trackCount}>
                  {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Action Buttons */}
          {!isLoading && playlist ? (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayAll}
                activeOpacity={0.8}
              >
                <Play size={18} color="#ffffff" fill="#ffffff" />
                <Text style={styles.playButtonText}>Play All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shuffleButton}
                onPress={handleShuffle}
                activeOpacity={0.8}
              >
                <Shuffle size={18} color="#d946ef" />
                <Text style={styles.shuffleButtonText}>Shuffle</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Track List */}
          <View style={styles.trackList}>
            {isLoading ? (
              <>
                <TrackRowSkeleton />
                <TrackRowSkeleton />
                <TrackRowSkeleton />
              </>
            ) : tracks.length > 0 ? (
              <FlatList
                data={tracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <TrackRow
                    track={item}
                    index={index}
                    onPress={handleTrackPress}
                  />
                )}
                scrollEnabled={false}
              />
            ) : (
              <EmptyState
                title="No tracks yet"
                subtitle="Add tracks to this playlist to start listening"
              />
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerMeta: {
    gap: 6,
  },
  playlistName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  trackCount: {
    fontSize: 14,
    color: '#9ca3af',
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d946ef',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  playButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  shuffleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2d2d2d',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  shuffleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#d946ef',
  },
  trackList: {
    marginTop: 4,
  },
});
