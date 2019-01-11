// 自动注入模块
require('./schema.config');

// READYED
require('colors');
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ChunkRenamePlugin = require('webpack-chunk-rename-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 自带版本 (整合工程到后端,后端提供版本识别;否则使用自带版本命名规则)
const SCRIPT_FORMAT = '[name].[chunkhash:8].js';
const STYLES_FORMAT = '[name].[contenthash:8].css';
// const SCRIPT_FORMAT = '[name].bundle.js';
// const STYLES_FORMAT = '[name].bundle.css';

// 自带版本
const SCRIPT_CHUNK = '[name].[chunkhash:8].js';
const STYLES_CHUNK = '[name].[contenthash:8].css';

module.exports = function(env, args) {
  let hosts = args.hosts;
  // 默认线上环境
  if (!hosts) {
    hosts = 'en';
    console.log('**************************************');
    console.log('没有指定运行环境，默认使用英文生产环境'.green);
    console.log('可选值: en/zh/en-beta/zh-beta'.cyan);
    console.log('**************************************');
  }
  // 环境设置错误
  else {
    console.log('**************************************');
    if (!fs.existsSync(`./config/hosts/${hosts}.js`)) {
      console.log(`错误: 没有找到运行环境配置文件 ./config/hosts/${hosts}.js`.red);
      process.exit(0);
    }
    console.log(`使用环境配置文件: ./config/hosts/${hosts}.js`.cyan);
    console.log('**************************************');
  }

  shell.cp(`./config/hosts/${hosts}.js`, './src/env.config.js');

  const HOSTS = require('./src/env.config');
  const publicPath = args.mode === 'production' ? HOSTS.CDN + '/repair/' : '/';
  return {
    mode: args.mode || 'development',
    devtool: args.mode === 'production' ? false : 'source-map',
    entry: {
      app: './src/index.js',
    },
    output: {
      filename: SCRIPT_FORMAT,
      chunkFilename: SCRIPT_CHUNK,
      path: path.resolve(__dirname, 'dist/mobile/'),
      publicPath: publicPath,
    },
    // https://github.com/webpack/webpack/issues/3486
    performance: { hints: false },
    resolve: {
      extensions: ['.js', '.jsx', '.vue'],
      alias: {
        // 不需要编译器
        vue$: 'vue/dist/vue.runtime.esm.js',
      },
    },

    optimization: {
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            name: 'vendor',
          },
        },
      },
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin(),
      ],
    },

    plugins: [
      new ManifestPlugin(),
      new CleanWebpackPlugin(['dist']), // 多版本共存模式时 必须要取消这个插件
      new HtmlWebpackPlugin({
        title: 'BITMAIN',
        prefix: publicPath,
        template: 'index.html',
        chunksSortMode: 'none',
      }),
      new webpack.DefinePlugin({
        'process.env.DEBUG_ENV': JSON.stringify(env),
      }), // 模拟接口
      new MiniCssExtractPlugin({
        filename: STYLES_FORMAT,
        chunkFilename: STYLES_CHUNK,
      }),
      new VueLoaderPlugin(),
      // optimization会导致output.filename失效 所以使用此插件
      // https://github.com/webpack/webpack/issues/6598
      new ChunkRenamePlugin({
        app: SCRIPT_FORMAT,
        vendor: SCRIPT_FORMAT,
        manifest: SCRIPT_FORMAT,
      }),
      // 以下两个无论开发还是生产都启用 以便充分利用缓存
      new webpack.NamedChunksPlugin(),
      new webpack.HashedModuleIdsPlugin({ hashDigestLength: 8 }),
      // 复制文件
      new CopyWebpackPlugin(['./favicon.ico']),
    ],

    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
                minimize: true,
                sourceMap: true,
                localIdentName: '[hash:base64:8]',
              },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'less-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
          loader: 'file-loader',
          options: {
            name: 'assets/images/[hash:8].[ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[hash:8].[ext]',
          },
        },
        {
          test: /\.vue$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'vue-loader',
        },
        {
          enforce: 'pre',
          test: /\.vue$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'eslint-loader',
          options: { fix: true },
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
            {
              loader: 'eslint-loader',
              options: { fix: true },
            },
          ],
        },
      ],
    },

    devServer: {
      contentBase: './dist',
      port: '5001',
      host: '0.0.0.0',
      disableHostCheck: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:9001',
          pathRewrite: { '^/api': '' },
        },
      },
    },
  };
};
