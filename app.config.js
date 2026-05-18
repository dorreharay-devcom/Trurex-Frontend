const appJson = require('./app.json');

module.exports = {
  expo: {
    ...appJson.expo,
    android: {
      ...appJson.expo.android,
      config: {
        ...(appJson.expo.android?.config ?? {}),
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
        },
      },
    },
    extra: {
      eas: {
        projectId: 'f032cbbd-67b0-4ced-8cfb-a196c47e0a1b',
      },
    },
  },
};
