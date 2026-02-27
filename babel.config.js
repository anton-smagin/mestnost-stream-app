module.exports = function (api) {
  // Cache based on NODE_ENV so test/non-test have different caches
  api.cache.using(() => process.env.NODE_ENV);

  const isTest = process.env.NODE_ENV === 'test';

  const plugins = [];

  if (!isTest) {
    plugins.push('nativewind/babel');
  }

  // react-native-reanimated must be last
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: isTest ? undefined : 'nativewind' }],
    ],
    plugins,
  };
};
