const createExpoWebpackConfigAsync = require('@expo/webpack-config');

const url = 'http://192.168.99.162:3002';

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
