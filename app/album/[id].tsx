import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Play, Shuffle } from 'lucide-react-native';
import { useAlbum } from '@/hooks/useApi';
import { TrackRow } from '@/components/TrackRow';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton, TrackRowSkeleton } from '@/components/Skeleton';
import { usePlayerStore } from '@/stores/playerStore';
import { type TrackSummary } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatReleaseDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).getFullYear().toString();
  } catch {
    return dateStr;
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: album, isLoading, error, refetch } = useAlbum(id ?? '');
  const { playTrack } = usePlayerStore();

  const tracks: TrackSummary[] = album?.tracks
    ? [...album.tracks].sort((a, b) => a.trackNumber - b.trackNumber)
    : [];

  const handlePlayAll = () => {
    if (tracks.length === 0) return;
    void playTrack(tracks[0], tracks);
  };

  const handleShuffle = () => {
    if (tracks.length === 0) return;
    const shuffled = shuffleArray(tracks);
    void playTrack(shuffled[0], shuffled);
  };

  const handleTrackPress = (track: TrackSummary) => {
    void playTrack(track, tracks);
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
          message="Could not load album. Please try again."
          onRetry={() => void refetch()}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Album Header */}
          <View style={styles.header}>
            {isLoading ? (
              <>
                <Skeleton width={200} height={200} borderRadius={12} />
                <View style={styles.headerMeta}>
                  <Skeleton width="70%" height={24} />
                  <Skeleton width="50%" height={14} />
                  <Skeleton width="40%" height={12} />
                </View>
              </>
            ) : album ? (
              <>
                {album.coverImageUrl ? (
                  <Image
                    source={{ uri: album.coverImageUrl }}
                    style={styles.coverArt}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.coverArt, styles.coverArtPlaceholder]} />
                )}
                <View style={styles.headerMeta}>
                  <Text style={styles.albumTitle}>{album.title}</Text>
                  {formatReleaseDate(album.releaseDate) ? (
                    <Text style={styles.releaseYear}>
                      {formatReleaseDate(album.releaseDate)}
                    </Text>
                  ) : null}
                  <Text style={styles.trackCount}>
                    {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                  </Text>
                </View>
              </>
            ) : null}
          </View>

          {/* Action Buttons */}
          {!isLoading && album ? (
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
                <TrackRowSkeleton />
                <TrackRowSkeleton />
              </>
            ) : tracks.length > 0 ? (
              <FlatList
                data={tracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TrackRow
                    track={item}
                    coverImageUrl={album?.coverImageUrl}
                    onPress={handleTrackPress}
                  />
                )}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No tracks on this album</Text>
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
    paddingBottom: 24,
    gap: 20,
  },
  coverArt: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  coverArtPlaceholder: {
    backgroundColor: '#2d2d2d',
  },
  headerMeta: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  releaseYear: {
    fontSize: 14,
    color: '#9ca3af',
  },
  trackCount: {
    fontSize: 13,
    color: '#6b7280',
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
  emptyText: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
