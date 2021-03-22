const createExpoWebpackConfigAsync = require('@expo/webpack-config');

const url = 'http://localhost:3002';

module.exports = async (env, argv) => {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.devServer = {
    ...config.devServer,
    proxy: {
      '/api': url,
      '/socket.io': {
        target: url,
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
