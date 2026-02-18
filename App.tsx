import 'react-native-gesture-handler';
import "./global.css";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { MusicProvider } from './src/context/MusicContext';
import { AuthProvider } from './src/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppContent from './src/components/AppContent';

// ── Reanimated logger: strict mode in dev, relaxed in prod ──
configureReanimatedLogger({
  strict: __DEV__,
  level: ReanimatedLogLevel.warn,
});

SplashScreen.preventAutoHideAsync();

// ── Deferred (non-first-screen) fonts loaded after splash hides ──
const DEFERRED_FONTS = {
  Inter_400Regular,
  Inter_700Bold,
  'RampartOne': require('./fonts/RampartOne-Regular.ttf'),
} as const;

export default function App() {
  // Critical fonts – required for PreloaderScreen / HeroSection / Ticker
  const [fontsLoaded, fontError] = useFonts({
    ArchivoBlack_400Regular,
    'BBHBartle': require('./fonts/BBHBartle-Regular.ttf'),
    'Bicubik': require('./fonts/Bicubik.otf'),
    'Gilton': require('./fonts/GiltonRegular.otf'),
    'Softura': require('./fonts/Softura-Demo.otf'),
  });

  // Hide splash as soon as critical fonts are ready
  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Load non-critical fonts in the background after first render
  React.useEffect(() => {
    if (fontsLoaded) {
      Font.loadAsync(DEFERRED_FONTS).catch(__DEV__ ? console.warn : () => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MusicProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <AppContent />
            </NavigationContainer>
            <StatusBar style="light" />
          </SafeAreaProvider>
        </AuthProvider>
      </MusicProvider>
    </GestureHandlerRootView>
  );
}
