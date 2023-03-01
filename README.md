# webpack-feature-test

> you can never be ready.

本包是对于 Webpack 各种功能的实验库。

## Webpack 内存溢出

node在运行时，内存是有限制的,一旦运行内存超过上述限制，就会出现堆栈溢出的报错。Webpack 在进行打包时候可能会出现 heap out of
memory 错误，此时我们可以直接制定 max_old_space_size 扩展内存进行打包构建。

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
module.exports = {
  //...
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

console.log("127.0.0.1");
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

可以利用 swc 加快打包速度，需要下载 swc-loader 和 @swc/core 两个库。

主要配置为

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.(jsx|js|ts|tsx)?$/,
        use: [
          {
            // 需要下载 thread-loader
            loader: "thread-loader",
            options: { workerParallelJobs: 50 },
          },
          "swc-loader",
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
```

## 多入口构建

针对一些大型项目来说，构建 MPA 项目也是必要的。多页面共用同一个壳和公共代码性能也是非常高的。我们可以这样构建。

```js
// 后续新增模块只需要添加模块名称
const buildPages = (names) => {
  const ret = {};
  names.forEach((name) => {
    ret[name] = `./src/pages/${name}/main.js`;
  });
  return ret;
};

module.exports = {
  // 构建 多入口
  entry: buildPages(["sale", "purchase"]),
};
```

同时也需要对公共依赖进行提取，否则会加载和运行更多的代码。配置如下：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 200,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
};
```

如此，我们就打出了 purchase-[hash].js sale-[hash].js 以及 vendor-[hash].js 三个文件。

## externals 获取外部 CDN 资源

前端项目基本上都会使用 Vue，React 以及相对应的组件库来搭建 SPA 单页面项目。但是在构建时候，把这些框架代码直接打包到项目中，并非是一个十分明智的选择。

我们可以直接在项目的 index.html 中添加如下代码。

```html
<script src="//cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.runtime.global.prod.js"
crossorigin="anonymous"></script>

<script src="//cdn.jsdelivr.net/npm/vue-router@4.1.6/dist/vue-router.global.prod.js" crossorigin="anonymous"></script>
```

然后可以在 webpack.config.js 中这样配置,如此就可以使用 CDN 中的 js 了。

```js
module.exports = {
  //...
  externals: {
    "vue": "Vue",
    "vue-router": "VueRouter",
  },
};
```

## resolve 解析

Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块，Resolve 配置 Webpack 如何寻找模块所对应的文件。 Webpack 内置 JavaScript 模块化语法解析功能，默认会采用模块化标准里约定好的规则去寻找，但你也可以根据自己的需要修改默认的规则。

没有配置 resolve 之前。想要引入 utils 文件夹中的文件，我们可能需要

```js
import { formatDate } from '../../utils/date'
```

配置 resolve 后

```js
module.exports = {
  // ...
  resolve: {
    alias: {
      utils: path.join(__dirname, 'src/utils'),
      // 关键字结尾，这里可以测试一下能否利用 webpack 参数传递路径构建不同项目
      'xxx$': '/path/to/xxx.js'
    }
  }
}
```

改写代码

```js
import { formatDate } from 'utils/date'
```


在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。可以配置 extensions 来定制解析使用文件后缀的顺序，Webpack 默认为 ['.js', '.json'] ，即先查看是否有 js，有则直接使用，如果没有，再查看是否有 json。 可以如下指定。

```js
module.exports = {
  // ...
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  }
}
```

extensions 越长，或者正确的后缀在越后面，就会造成尝试的次数越多，所以 resolve.extensions 的配置也会影响到构建的性能。在代码中应该准确的带上文件后缀。

## 按需加载


## 模块联邦

Webpack 的微前端解决方案。



## 其他资源

[webpack-examples](https://github.com/webpack/webpack/tree/main/examples)：来自 Webpack 官方的案例集合。