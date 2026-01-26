import 'react-native-gesture-handler';
import "./global.css";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { MusicProvider } from './src/context/MusicContext';
import { AuthProvider } from './src/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppContent from './src/components/AppContent';

configureReanimatedLogger({
  strict: false,
  level: ReanimatedLogLevel.warn,
});

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    ArchivoBlack_400Regular,
    Inter_400Regular,
    Inter_700Bold,
    'BBHBartle': require('./fonts/BBHBartle-Regular.ttf'),
    'Bicubik': require('./fonts/Bicubik.otf'),
    'Gilton': require('./fonts/GiltonRegular.otf'),
    'RampartOne': require('./fonts/RampartOne-Regular.ttf'),
    'Softura': require('./fonts/Softura-Demo.otf'),
  });

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

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
