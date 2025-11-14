const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Create resolver to handle missing native modules
config.resolver = {
  ...config.resolver,
  resolverMainFields: ['react-native', 'browser', 'main'],
  platforms: ['ios', 'android', 'native', 'web'],
};

// Mock missing native modules
config.resolver.alias = {
  ...config.resolver.alias,
  'RNEdgeToEdge': require.resolve('./mocks/RNEdgeToEdge.js'),
};

// Transform missing modules to prevent crashes
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;

