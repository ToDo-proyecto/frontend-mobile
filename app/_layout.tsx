import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <AuthProvider>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#151718' },
              headerTintColor: '#ECEDEE',
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="lists/[id]"
              options={{ title: 'Tasks', headerBackTitle: 'Back' }}
            />
            {__DEV__ && (
              <Stack.Screen name="storybook" options={{ headerShown: false }} />
            )}
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
