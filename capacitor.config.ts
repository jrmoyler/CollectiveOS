/**
 * Capacitor Configuration for CollectiveOS Hybrid App
 *
 * This config enables the app to run natively on iOS and Android
 * with full-screen kiosk mode (hiding native status bars).
 *
 * To build for native platforms:
 *   npx cap add ios
 *   npx cap add android
 *   npm run build && npx cap sync
 *   npx cap open ios      // Opens in Xcode
 *   npx cap open android  // Opens in Android Studio
 */

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.collectiveai.collectiveos',
  appName: 'CollectiveOS',
  webDir: 'dist',
  server: {
    // Use the local dev server during development
    // url: 'http://localhost:5173',
    // cleartext: true,
  },
  plugins: {
    StatusBar: {
      // Hide the native status bar for true kiosk-mode experience
      // This ensures the app runs fullscreen with no native OS chrome
      style: 'DARK',
      backgroundColor: '#0f172a',
      overlaysWebView: true,
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0f172a',
      showSpinner: false,
      launchFadeOutDuration: 300,
    },
    Keyboard: {
      // Optimize keyboard behavior for mobile touch interactions
      resize: 'body' as unknown as undefined,
      style: 'DARK' as unknown as undefined,
    },
  },
  ios: {
    // Full-screen presentation hides the iOS status bar
    preferredContentMode: 'mobile',
    backgroundColor: '#0f172a',
    // In the native iOS project, set:
    //   View controller-based status bar appearance = YES
    //   Status bar is initially hidden = YES
    // in Info.plist for true kiosk mode
  },
  android: {
    // Android full-screen / immersive mode
    backgroundColor: '#0f172a',
    // In the native Android project, add to styles.xml:
    //   <item name="android:windowFullscreen">true</item>
    //   <item name="android:windowTranslucentStatus">true</item>
    //   <item name="android:windowTranslucentNavigation">true</item>
    // for true kiosk mode
  },
};

export default config;
