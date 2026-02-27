import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, User as UserIcon } from 'lucide-react-native';
import { useProfile } from '@/hooks/useApi';
import { useAuthStore } from '@/stores/authStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMemberSince(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { data: user, isLoading } = useProfile();

  const handleLogout = () => {
    clearAuth();
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#d946ef" size="large" />
          </View>
        ) : (
          <>
            {/* User Info */}
            <View style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <UserIcon size={40} color="#6b7280" />
              </View>
              <View style={styles.userInfo}>
                {user?.displayName ? (
                  <Text style={styles.displayName}>{user.displayName}</Text>
                ) : null}
                {user?.email ? (
                  <Text style={styles.email}>{user.email}</Text>
                ) : null}
                {user?.createdAt ? (
                  <Text style={styles.memberSince}>
                    Member since {formatMemberSince(user.createdAt)}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <LogOut size={18} color="#ef4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    gap: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 9999,
    backgroundColor: '#2d2d2d',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  email: {
    fontSize: 14,
    color: '#9ca3af',
  },
  memberSince: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2d2d2d',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ef4444',
  },
});
