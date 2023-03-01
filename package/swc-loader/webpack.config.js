const path = require('path');

module.exports = {
  entry: './main.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(jsx|js|ts|tsx)?$/,
        use: [
          {
            loader: 'thread-loader',
            options: { workerParallelJobs: 50 },
          },
          'swc-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};