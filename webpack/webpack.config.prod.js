const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    main: resolve(__dirname, '../src'),
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'redux',
      'redux-thunk',
      'emotion',
    ],
  },
  output: {
    // filename: '[name].[chunkhash].js',
    filename: '[name].js',
    //path: resolve(__dirname, '../dist'),
    path: '/Users/stiger/Projects/salesforces/va/src/staticresources/skedFollowUpAppointment.resource/dist',
    publicPath: '',
  },
  module: {
    rules: [
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
				// loader: 'style-loader!css-loader',
				loader: ExtractTextPlugin.extract("css")
			},
			{
				test: /\.scss$/,
				// loaders: [
				// 	'style-loader',
				// 	'css-loader?-minimize',
				// 	'sass-loader?outputStyle=compressed'
				// ]
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader?-minimize', 'sass-loader?outputStyle=compressed']
				})
			},
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=public/fonts/[name].[ext]',
      },
			{ test: /(\.png|\.gif|\.jpg|\.jpeg)$/, loaders: ['url-loader?name=public/images/[name].[ext]'] },
    ],
  },
  plugins: [
		new ExtractTextPlugin("styles.css"),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
			title: 'VF React-Redux Stater',
      template: 'webpack/template.html',
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as: 'script',
      include: 'all',
    }),
  ],
}
