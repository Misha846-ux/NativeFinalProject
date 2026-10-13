module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: process.env.VITE_API_URL,
  },
  plugins: [...(config.plugins ?? []), "expo-secure-store"],
});
