const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async (env, argv) => {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.devServer = {
    ...config.devServer,
    proxy: {
      '/api': 'http://localhost:3002',
      '/socket.io': {
        target: 'http://localhost:3002',
        ws: true,
      },
    },
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-webview': 'react-native-web-webview',
  };

  return config;
};
