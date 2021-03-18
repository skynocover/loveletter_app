const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async (env, argv) => {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.devServer = {
    ...config.devServer,
    proxy: {
      '/api': 'http://192.168.99.162:3002',
      '/socket.io': {
        target: 'http://192.168.99.162:3002',
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
