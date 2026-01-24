import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import HomeScreen from './src/screens/HomeScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Disable strict mode to suppress "Reading from value during component render" warning
// likely caused by library interactions (e.g. carousel) rather than application code
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
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
