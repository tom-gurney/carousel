// webpack.config.js

var webpack = require('webpack');
var path = require('path');
var libraryName = 'carousel';
var outputFile = libraryName + '.js';

var config = {
    entry: './src/carousel.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }
            }
        ]
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: [".js", ".json", ".jsx", ".css"],
    }
};

module.exports = config;
