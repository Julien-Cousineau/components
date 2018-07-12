var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');



module.exports = {
    entry: {
    
      app:[
      //   // 'webpack-dev-server/client?https://components-jcousineau.c9users.io:8080',
      //   // 'webpack/hot/only-dev-server',
        './viz/index.js'
          ],
    
      vendor: [
            './dist/bootstrap.bundle.min.js',
            './dist/d3.min.js',
            ],
    },
    
    output: {
        path: path.join(__dirname, 'build'),
        filename: "[name].js"
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
        }
      ]
    },
   
    plugins: [
        new HtmlWebpackPlugin({
        title: 'Julien'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    })
        // new webpack.HotModuleReplacementPlugin()
    ]
};