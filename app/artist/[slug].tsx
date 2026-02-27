import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ArtistScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Artist', headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Artist: {slug}</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Artist detail coming soon</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#4b5563',
  },
});
