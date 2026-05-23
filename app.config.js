/** @type {import('expo/config').ExpoConfig} */
const appEnv = process.env.APP_ENV ?? 'production';
const isProduction = appEnv === 'production';
const appScheme = process.env.EXPO_PUBLIC_APP_SCHEME ?? (isProduction ? 'trurex' : 'trurex-dev');
const nativeApplicationId = isProduction ? 'com.app.trurex' : 'com.app.trurex.dev';

module.exports = {
  expo: {
    name: isProduction ? 'truRex' : 'truRex Dev',
    slug: 'trurex',
    scheme: appScheme,
    version: '1.0.2',
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
      bundleIdentifier: nativeApplicationId,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: nativeApplicationId,
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
          locationWhenInUsePermission: 'Allow TruRex to use your location to tag recommendations.',
        },
      ],
    ],
    extra: {
      appEnv,
      appTarget: process.env.APP_TARGET ?? 'native',
      eas: {
        projectId: 'f032cbbd-67b0-4ced-8cfb-a196c47e0a1b',
      },
    },
  },
};
