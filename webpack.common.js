const path = require("path");
const fs = require('fs');
const webpack = require('webpack');

const ArcGISPlugin = require("@arcgis/webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackNotifierPlugin = require('webpack-notifier');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

var srcFolder = "./wwwroot/src";
var distFolder = "./wwwroot/dist";

module.exports = {
  entry: [
    srcFolder + "/css/main.scss",
    '@babel/polyfill',
    'whatwg-fetch',
    //"@dojo/framework/shim/Promise",
    srcFolder + '/js/main.ts'
  ],

  output: {
    path: path.resolve(__dirname, distFolder),
    filename: "[name].[chunkhash].js",
    publicPath: ""
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      })
    ]
  },
  externals: [
    function(context, request, callback) {
      if (/pe-wasm$/.test(request)) {
        return callback(null, "amd " + request);
      }
      callback();
    },
    // Regex
    /^(jquery|\$)$/i
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "resolve-url-loader",
            options: { includeRoot: true }
          },
          "sass-loader?sourceMap"
        ]
      }
    ]
  },
  plugins: [

    new ArcGISPlugin({
      features: {
        "3d": false
      },
      locales: ["en"]
    }),
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      title: "Webpack Typescript Setup Template w. ArcGIS",
      template: srcFolder + "/index.ejs",
      filename: "index.html",
      favicon: srcFolder + "/assets/favicon.ico",
      chunksSortMode: 'none',
      //inlineSource: ".(css)$"
    }),

    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash].css",
      chunkFilename: "[id].css"
    }),
    new WebpackNotifierPlugin()
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, "/src"),
      path.resolve(__dirname, "node_modules/")
    ],
    extensions: [".ts", ".tsx", ".js", ".scss", ".css"]
  },
  node: {
    process: false,
    global: false,
    fs: "empty"
  },
};