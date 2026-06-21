import { Tabs } from 'expo-router';
import BottomTabBar from '../../components/layout/BottomTabBar';
import { useAuth } from '../context/AuthContext';
import { Redirect } from 'expo-router';

export default function TabsLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Discover' }} />
      <Tabs.Screen name="discover" options={{ title: 'Astrologers' }} />
      <Tabs.Screen name="starbase" options={{ title: 'Starbase' }} />
      <Tabs.Screen name="reports" options={{ title: 'Consultant' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}