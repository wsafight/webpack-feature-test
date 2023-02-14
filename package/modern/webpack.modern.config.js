const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.mjs',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                "targets": {
                  "esmodules": true
                }
              }]
            ]
          }
        }
      },
    ]
  },
};