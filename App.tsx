import "./global.css";
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import HomeScreen from './src/screens/HomeScreen';

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

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <HomeScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
