module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      // plugins: ['nativewind/babel'], // ✅ required for Tailwind to work
    };
  };
  