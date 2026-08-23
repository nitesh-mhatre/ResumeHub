import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.gray50 },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="builder" />
      </Stack>
    </>
  );
}
