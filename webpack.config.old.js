var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const entrypath =(process.env.NODE_ENV === 'production')?'./src/index.js':'./viz/index.js'


module.exports = {
    entry: {
    
      index:[
          entrypath
          ],
    
      vendor: [
            './dist/bootstrap.bundle.min.js',
            './dist/d3.min.js',
            './dist/datatables.min.js',
            ],
    },
    
    output: {
        path: path.join(__dirname, 'build'),
        filename: "[name].js",
        chunkFilename: '[name]-[chunkhash].js', 
    },
    // devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, 'build'),
    // hot: true,
    // inline: true,
        
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', "sass-loader"]
        },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
      ]
    },
   

   
    plugins: [
        new HtmlWebpackPlugin({
        title: 'Julien'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
    })
        // new webpack.HotModuleReplacementPlugin()
    ]
};