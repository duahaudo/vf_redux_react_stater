const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client',
    'webpack/hot/only-dev-server',
    resolve(__dirname, 'hotReload'),
  ],
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname),
    publicPath: '/',
  },
  context: resolve(__dirname, '../src'),
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    host: '0.0.0.0',
    contentBase: resolve(__dirname, '../assets'),
    publicPath: '/',
    historyApiFallback: true,
  },
  module: {
    rules: [
			// Javascript and jsx assets
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}, {
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
				// loader: ExtractTextPlugin.extract("css")
      },
			{
				test: /\.scss$/,
				loaders: [
					'style-loader',
					'css-loader?-minimize',
					'sass-loader?outputStyle=compressed'
				]
				// loader: ExtractTextPlugin.extract({
				// 	fallback: 'style-loader',
				// 	use: ['css-loader?-minimize', 'sass-loader?outputStyle=compressed']
				// })
			},
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: 'style-loader', // creates style nodes from JS strings
      //     },
      //     {
      //       loader: 'css-loader', // translates CSS into CommonJS
      //     },
      //     {
      //       loader: 'sass-loader', // compiles Sass to CSS
      //     },
      //   ],
      // },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=public/fonts/[name].[ext]',
      },
			// Handling image assets
			{ test: /(\.png|\.gif|\.jpg|\.jpeg)$/, loaders: ['url-loader'] },
    ],
  },
  plugins: [
		// new ExtractTextPlugin("styles.css"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      title: 'VF React-Redux Stater',
      template: '../webpack/template.html',
			meta: {
      	viewport: 'width=device-width, initial-scale=1'
			}
    }),
  ],
  performance: { hints: false },
}
