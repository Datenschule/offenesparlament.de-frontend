const webpack = require("webpack");
const path = require("path");

const DIST = "dist";

module.exports = {
    entry: {
        main: "./app/main.js"
    },
    output: {
        path: path.join(__dirname, DIST),
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "buble-loader"
        }, {
            test: /\.html/,
            loader: "html-loader"
        }, {
            test: /\.scss$/,
            loader: "style-loader!css-loader?minimize=true!sass-loader"
        }, {
            test: /\.css/,
            loader: "style-loader!css-loader?minimize=true"
        }, {
            test: /\.(png|svg|jpg)$/,
            loader: "file-loader?name=[path][name].[ext]&context=./scripts"
        }, {
            test: /\.(eot|woff|woff2|ttf)$/,
            loader: "file-loader?name=[path][name].[ext]&context=./scripts"
        }, {
            test: /\.json$/,
            loader: "json-loader"
        }],
    },
    devServer:
        {
            contentBase: path.join(__dirname, DIST),
            compress:
                true,
            port:
                9000
        }
};
