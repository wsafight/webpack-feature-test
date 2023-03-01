const path = require('path');

const buildPages = (names) => {
  const ret = {}
  names.forEach(name => {
    ret[name] = `./src/pages/${name}/main.js`
  })
  return ret
}

module.exports = {
  entry: buildPages(['sale', 'purchase']),
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 200,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    }
  },
  output: {
    filename: '[name]-[hash].js',
    chunkFilename: '[name].js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};