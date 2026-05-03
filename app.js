// App.js
//
// This is the MAIN file of your app.
// It:
// 1. Loads all the fonts you need
// 2. Sets up navigation
// 3. Shows a loading screen while fonts load

import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import your bottom tab navigator
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

// Import colors
import { colors } from './src/theme/colors';

// Keep the splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

export default function App() {
  // appIsReady = true when all fonts are loaded
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // This function loads all fonts before showing the app
    async function prepare() {
      try {
        // Load all font files
        /*
        await Font.loadAsync({
          // We use system fonts that are always available on both platforms
          // In a production app, you'd load custom .ttf files
          'Montserrat_700Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
          'Inter_400Regular': require('./assets/fonts/Inter-Regular.ttf'),
          'Inter_600SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
          'Inter_700Bold': require('./assets/fonts/Inter-Bold.ttf'),
        });
        */
      } catch (error) {
        console.warn('Font loading error:', error);
        // If fonts fail to load, the app still works with system defaults
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Called when the layout is ready
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the native splash screen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Show loading spinner while fonts load
  if (!appIsReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading ZimPulse...</Text>
      </View>
    );
  }

  // Main app with navigation
  return (
    <SafeAreaProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up entire screen
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
});