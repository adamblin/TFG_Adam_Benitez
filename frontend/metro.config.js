const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable .web.js resolution so packages like react-native-svg
// serve their web variants when bundling for web.
config.resolver.platforms = ['ios', 'android', 'web'];

module.exports = config;
