const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const entrypath =(process.env.NODE_ENV === 'production')?'./dummyapp/index.js':'./dummyapp/index.js';


module.exports = {
    entry: {
      index:[entrypath,],
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: "[name].js",
        chunkFilename: '[name]-[chunkhash].js', 
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
    },
    module: {
      rules: [
        {test: /\.css$/,use: ['style-loader', 'css-loader']},
        {test: /\.scss$/,use: ['style-loader', 'css-loader', "sass-loader"]},
        {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
        {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
      ]
    },
   
    plugins: [
        new HtmlWebpackPlugin({
        title: 'Julien'
      }),
       new CopyWebpackPlugin([
            { from: './build' }
            ]),
    ]
};