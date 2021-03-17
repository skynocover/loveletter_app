import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { AppProvider } from './appcontext';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = 'dark';
  // const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AppProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </AppProvider>
      </SafeAreaProvider>
    );
  }
}
