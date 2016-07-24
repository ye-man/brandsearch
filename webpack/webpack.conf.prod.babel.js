import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'

import baseWebpackConfig from './webpack.conf.base.babel'

export default webpackMerge(baseWebpackConfig, {
  devtool: 'source-map',
  entry: {
    app: './client/app/main.js'
  },
  output: {
    publicPath: '/',
    filename: path.posix.join('static', 'js/[name].js'),
    chunkFilename: path.posix.join('static', 'js/chunk.[id].js')
  },
  module: {
    loaders: [
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract('css?sourceMap!postcss-loader!sass?sourceMap')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      __DEV__: false
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin(path.posix.join('static', 'css/[name].css')),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      template: './client/index.html',
      inject: true,
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
})