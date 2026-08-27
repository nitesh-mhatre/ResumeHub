import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { AdMobProvider } from '../components/AdMobProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AdMobProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.gray50 },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="builder" />
        </Stack>
      </AdMobProvider>
    </SafeAreaProvider>
  );
}
