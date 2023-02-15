# webpack-feature-test

> you can never be ready.

本包是对于 Webpack 各种功能的实验库。

## Webpack 内存溢出

node在运行时，内存是有限制的,一旦运行内存超过上述限制，就会出现堆栈溢出的报错。Webpack 在进行打包时候可能会出现 heap out of memory 错误，此时我们可以直接制定 max_old_space_size 扩展内存进行打包构建。

```bash
node --max_old_space_size=8192 ./node_modules/webpack/bin/webpack.js --config=webpack.config.js"
```

## modern 现代模式

支持 ES modules 的现代浏览器可以使用新的语法。

通过 webpack 构建出两套 javaScript 代码。一个现代版的包，面向支持 ES modules 的现代浏览器，另一个旧版的包，面向不支持的旧浏览器。

支持 ES modules 浏览器会解析此处的 js 代码,老版浏览器由于不识别 type='module' 不会进行处理

```html
<script type="module" src="main.js"></scirpt>
```

支持 ES modules 浏览器不会解析此处代码，老板浏览器会解析此处代码

```html
<script nomodule src='main.js'></scirpt>
```

主要配置为
```js
{
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
                  // 目标位 esmodules
                  "esmodules": true
                }
              }]
            ]
          }
        }
      },
    ]
  },
}
```

## env 环境配置

可以使用 dotenv 配置不同坏境的变量，方便在不同情况下打包。

在当前项目中添加 .env 文件

```env
PUBLIC_PATH = /

DB_HOST = 127.0.0.1
```

安装 dotenv-webpack 包,并改写 webpack.config.js 文件。

```js
const Dotenv = require('dotenv-webpack');

module.exports = {
  ...
  plugins: [
    new Dotenv()
  ]
  ...
};
```

在代码中我们这样写
```ts
console.log(process.env.DB_HOST);

// 转化成

console.log('127.0.0.1');
```

还可以配置更多的版本。

```js
const mode = process.argv.includes('--mode=production') ? 'production' : 'dev';


module.exports = {
  ...
  plugins: [
    new Dotenv({
        // 如果是生产阶段的包将会使用 .env.production 中数据
        path: `./.env${mode === 'production' ? '.production' : ''}`
    })
  ]
  ...
};
```

为了安全，我们也需要在 .gitignore 添加 .env.production 配置。

当然，更好的方式是写一个打包工具，而不是直接将 .env.production 放在项目中。

## swc 加快打包速度

## 多页面构建

## 模块联邦

Webpack 的微前端解决方案。
