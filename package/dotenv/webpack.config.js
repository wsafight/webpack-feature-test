const path = require('path');
const Dotenv = require('dotenv-webpack');

const mode = process.argv.includes('--mode=production')? 'production' : 'dev';


module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new Dotenv({
      path: `./.env${mode === 'production' ? '.production' : ''}`
    })
  ]
};