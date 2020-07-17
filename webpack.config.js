const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
const styledComponentsTransformer = createStyledComponentsTransformer();
const envPath = path.join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
require('dotenv').config({ path: envPath })

module.exports = {
  entry: './client/App.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'app.[contenthash].js',
    chunkFilename: '[name].[chunkhash].bundle.js'
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      { test: /\.html?$/, loader: 'html-loader' },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.PORT': process.env.PORT
    }),
    new HtmlWebpackPlugin({
      template: 'client/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'client/assets/images', to: 'public/images' },
      ]
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react"
        },
        utilityVendor: {
          test: /[\\/]node_modules[\\/](lodash|moment|moment-timezone)[\\/]/,
          name: "utility"
        },
        vendor: {
          test: /[\\/]node_modules[\\/]cl(!lodash)(!moment)(!moment-timezone)[\\/]/,
          name: "vendor"
        },
      }
    }
  }
}
