var webpack = require("webpack");
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

const outputPath = path.join(process.cwd(), '/dist');

module.exports = {
    mode: 'development',
    devServer: {
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      port: 4444,
      disableHostCheck: true
    },
    // mode: 'production',
    stats: 'minimal',
    // devtool: 'cheap-eval-source-map',
    optimization: {
      minimizer: [
        new TerserJSPlugin({
          test: /\.js(\?.*)?$/i,
          cache: true,
          parallel: true,
          terserOptions: {
            extractComments: 'all',
            keep_fnames: true,
          }
        }),
        new OptimizeCSSAssetsPlugin({
          test: /\.css(\?.*)?$/i,
          cache: true,
          parallel: true,
        })
      ],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,

          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss$/,
            chunks: 'all',
          },
          js: {
            name: 'app',
            test: /\.js$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    entry: {
        app: ["./src/index.js"],
      },
    target: 'web',
    output: {
            publicPath: '/dist/',
            path: outputPath,
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery":"jquery"
        }),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[name].css',
        }),
    ],
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    '@babel/preset-env',
                    '@babel/react',
                  ],
                  "plugins": [
                    "@babel/plugin-proposal-class-properties",
                    '@babel/plugin-proposal-export-namespace-from',
                    "@babel/plugin-proposal-export-default-from",
                  ]
                },
            },
          }, {
            test: /\.(sa|sc|c)ss$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: process.env.NODE_ENV === 'development',
                  reloadAll: true,

                },
              },
              'css-loader',
              'sass-loader',
            ],
          }, {
            test: /\.(ttf|png|woff(2)?|ttf|jpe?g|gif|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader',
            options: {
            },
        }
        ]
    }
};
