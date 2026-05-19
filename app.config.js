/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: 'truRex',
    slug: 'trurex',
    scheme: 'trurex',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/truRexIcon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.app.trurex',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.app.trurex',
      adaptiveIcon: {
        foregroundImage: './assets/truRexIcon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
        },
      },
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/truRexIcon.png',
      name: 'TruRex',
    },
    plugins: [
      'expo-web-browser',
      'expo-router',
      'expo-secure-store',
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'Allow TruRex to use your location to tag recommendations.',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'f032cbbd-67b0-4ced-8cfb-a196c47e0a1b',
      },
    },
  },
};
