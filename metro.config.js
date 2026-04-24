const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@react-native/normalize-colors': path.resolve(
    __dirname,
    'node_modules/@react-native/normalize-colors',
  ),
};

module.exports = withNativeWind(config, { input: './global.css' });
