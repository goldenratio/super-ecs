const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: {
    main: './example/index.ts'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './bin'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        exclude: /node_modules/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"}
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'super-ecs': path.resolve(__dirname, 'src/')
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'super-ecs sandbox'
    }),
    new CopyPlugin([
      { from: './example/assets', to: './assets' }
    ])
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'bin')
  }
};
