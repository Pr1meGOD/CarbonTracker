const path = require('path');

module.exports = {
  // Your existing Webpack configuration

  resolve: {
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "url": require.resolve("url/"),
      "querystring": require.resolve("querystring-es3"),
      "zlib": require.resolve("browserify-zlib"),
      "buffer": require.resolve("buffer/"),
      "http": require.resolve("stream-http"),
      "net": false
    }
  },
  
  // Other configurations like module, plugins, etc.
};
