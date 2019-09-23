const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional

const cleanOption = {
  cleanOnceBeforeBuildPatterns: [
    // '**/*', // dellete all file and folder
    'app.js'
  ]
};

module.exports = {
  mode: 'production',
  entry: {
    app: ['./src/app.jsx']
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8000
  },
  output: {
    path: path.join(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-env'
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(cleanOption)
  ]
};
