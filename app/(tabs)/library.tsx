import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { usePlaylists, useLikes, useHistory, useCreatePlaylist } from '@/hooks/useApi';
import { TrackRow } from '@/components/TrackRow';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { TrackRowSkeleton } from '@/components/Skeleton';
import { usePlayerStore } from '@/stores/playerStore';
import { type TrackSummary } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type LibraryTab = 'playlists' | 'liked' | 'history';

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlaylistsTab() {
  const router = useRouter();
  const { data: playlists, isLoading, error, refetch } = usePlaylists();
  const createPlaylist = useCreatePlaylist();

  const handleCreatePlaylist = () => {
    createPlaylist.mutate({ name: `Playlist ${(playlists?.length ?? 0) + 1}` });
  };

  if (error && !isLoading) {
    return <ErrorState message="Could not load playlists." onRetry={() => void refetch()} />;
  }

  return (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreatePlaylist}
        activeOpacity={0.8}
        disabled={createPlaylist.isPending}
      >
        <Plus size={18} color="#d946ef" />
        <Text style={styles.createButtonText}>Create Playlist</Text>
      </TouchableOpacity>

      {isLoading ? (
        <>
          <TrackRowSkeleton />
          <TrackRowSkeleton />
          <TrackRowSkeleton />
        </>
      ) : playlists && playlists.length > 0 ? (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.playlistRow}
              onPress={() => router.push(`/playlist/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.playlistIcon} />
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.playlistMeta}>
                  {item.tracks?.length ?? 0} tracks
                  {item.isPublic ? ' · Public' : ' · Private'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      ) : (
        <EmptyState
          title="No playlists yet"
          subtitle="Create a playlist to start organizing your music"
        />
      )}
    </View>
  );
}

function LikedSongsTab() {
  const { data: likes, isLoading, error, refetch } = useLikes();
  const { playTrack } = usePlayerStore();

  const likedTracks: TrackSummary[] = likes?.map((entry) => entry.track) ?? [];

  const handleTrackPress = (track: TrackSummary) => {
    void playTrack(track, likedTracks);
  };

  if (error && !isLoading) {
    return <ErrorState message="Could not load liked songs." onRetry={() => void refetch()} />;
  }

  if (isLoading) {
    return (
      <View style={styles.tabContent}>
        <TrackRowSkeleton />
        <TrackRowSkeleton />
        <TrackRowSkeleton />
      </View>
    );
  }

  if (!likes || likes.length === 0) {
    return (
      <EmptyState
        title="No liked songs"
        subtitle="Like a track to find it here"
      />
    );
  }

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={likes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackRow
            track={item.track}
            onPress={handleTrackPress}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

function HistoryTab() {
  const { data: history, isLoading, error, refetch } = useHistory();
  const { playTrack } = usePlayerStore();

  const handleTrackPress = (track: TrackSummary) => {
    // History plays single track without queue context
    void playTrack(track);
  };

  if (error && !isLoading) {
    return <ErrorState message="Could not load history." onRetry={() => void refetch()} />;
  }

  if (isLoading) {
    return (
      <View style={styles.tabContent}>
        <TrackRowSkeleton />
        <TrackRowSkeleton />
        <TrackRowSkeleton />
      </View>
    );
  }

  if (!history || history.length === 0) {
    return (
      <EmptyState
        title="No listening history"
        subtitle="Start playing music to see your history here"
      />
    );
  }

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackRow
            track={item.track}
            onPress={handleTrackPress}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('playlists');

  const TABS: { key: LibraryTab; label: string }[] = [
    { key: 'playlists', label: 'Playlists' },
    { key: 'liked', label: 'Liked Songs' },
    { key: 'history', label: 'History' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
      </View>

      {/* Segment Control */}
      <View style={styles.segmentControl}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.segmentTab,
              activeTab === tab.key && styles.segmentTabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentLabel,
                activeTab === tab.key && styles.segmentLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'playlists' && <PlaylistsTab />}
        {activeTab === 'liked' && <LikedSongsTab />}
        {activeTab === 'history' && <HistoryTab />}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  segmentControl: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 3,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentTabActive: {
    backgroundColor: '#2d2d2d',
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  segmentLabelActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  tabContent: {
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#d946ef',
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  playlistIcon: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#2d2d2d',
    flexShrink: 0,
  },
  playlistInfo: {
    flex: 1,
    gap: 3,
  },
  playlistName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  playlistMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
});
