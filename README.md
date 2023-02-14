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

## 模块联邦

Webpack 的微前端解决方案。