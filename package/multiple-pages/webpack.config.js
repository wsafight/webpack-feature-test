const path = require('path');

const buildPages = (names) => {
  const ret = {}
  names.forEach(name => {
    ret[name] = `src/${name}/main.js`
  })
  return ret
}

module.exports = {
  entry: buildPages([]),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};