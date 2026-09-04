import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { AdMobProvider } from '../components/AdMobProvider';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Routes that don't require authentication
const AUTH_ROUTES = ['login', 'onboarding'];

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  useEffect(() => {
    if (loading) return;

    const currentRoute = segments[0] as string | undefined;

    if (!user && currentRoute !== 'login' && currentRoute !== 'onboarding') {
      // Not logged in and not on an auth screen — redirect to login
      router.replace('/login');
    } else if (user && currentRoute === 'login') {
      // Logged in but on the login screen — redirect to home
      router.replace('/');
    }
    // Note: onboarding is handled by index.tsx checking the AsyncStorage flag,
    // so we don't force-redirect away from it
  }, [user, loading]);

  // Show splash/loading screen while Firebase checks auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.gray50 },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="builder" />
      <Stack.Screen name="templateBuilder" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AdMobProvider>
          <StatusBar style="dark" />
          <RootLayoutNav />
        </AdMobProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
  },
});
