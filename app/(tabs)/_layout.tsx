import { Tabs } from 'expo-router';
import { Home, Search, Library, User } from 'lucide-react-native';

const TAB_ICON_SIZE = 24;

const TAB_BAR_STYLE = {
  backgroundColor: '#1a1a1a',
  borderTopColor: '#242424',
  borderTopWidth: 1,
  paddingTop: 8,
  paddingBottom: 4,
  height: 64,
} as const;

const TAB_BAR_LABEL_STYLE = {
  fontSize: 11,
  fontWeight: '500' as const,
  marginTop: 4,
} as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarLabelStyle: TAB_BAR_LABEL_STYLE,
        tabBarActiveTintColor: '#d946ef',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Home size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Search size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => (
            <Library size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <User size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
