import { AnimatedSplash } from '@/components/AnimatedSplash';
import { GlistenColors } from '@/constants/theme';
import { initializeNotifications } from '@/utils/notifications';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

const GlistenDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: GlistenColors.background,
    card: GlistenColors.surface,
    text: GlistenColors.textPrimary,
    border: GlistenColors.surfaceBorder,
    primary: GlistenColors.primary,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the native splash immediately — our animated one takes over
      SplashScreen.hideAsync();
      initializeNotifications();

      if (Platform.OS === 'android') {
        NavigationBar.setBackgroundColorAsync(GlistenColors.surface);
        NavigationBar.setButtonStyleAsync('light');
      }
    }
  }, [fontsLoaded]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={GlistenDarkTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen
            name="session"
            options={{
              presentation: 'fullScreenModal',
              headerShown: false,
              animation: 'fade',
            }}
          />
        </Stack>
        {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
      </View>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

