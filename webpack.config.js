const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [
              ["transform-runtime", {
                "regenerator": true,
              }]
            ]
          }
        }
      },
      {
       test: /\.(mp3|wav)$/,
       use: [
         {
           loader: 'file-loader',
           options: {
              name: 'audio/[name].[ext]'
           }
         }
       ]
      },
      {
       test: /\.(png|jpg|gif|svg)$/,
       use: [
         {
           loader: 'file-loader',
           options: {
              name: 'images/[name].[ext]'
           }
         }
       ]
      },
      {
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { url: false }
            }
          ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
    new MiniCssExtractPlugin({
      filename: "style/index.css"
    }),
    new HtmlWebpackPlugin({
      template: '!!html-loader?interpolate!src/index.html'
    })
  ]
};
