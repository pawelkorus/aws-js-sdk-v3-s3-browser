const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
      'index': './src/main.ts'
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.scss' ],
        fallback: {
          'http': require.resolve("stream-http"),
          'crypto': require.resolve("crypto-browserify"),
          'fs': false,
          'path': false,
          'os': false,
          'stream': require.resolve("stream-browserify"),
          'buffer': require.resolve("buffer/")
        }
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'target')
    },
    plugins: [
        new HtmlWebpackPlugin({
          inlineSource: '.(js|css)$', // embed all javascript and css inline
          filename: 'index.html'
        })
    ]
};
