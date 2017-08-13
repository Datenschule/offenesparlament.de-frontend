const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

const DIST = "_site/dist";

console.log(process.env.DEV ? "DEV Mode" : "Production Mode");


const plugins = [
    new webpack.DefinePlugin({
        API_BASE_URL: JSON.stringify(process.env.DEV ? "http://localhost:5000" : "http://api.offenesparlament.de"),
    }),
];

if (!process.env.DEV) {
    plugins.push(new UglifyJSPlugin({
        mangle: false,
        sourceMap: true,
    }));
}

module.exports = {
    entry: {
        main: "./app/main.js",
    },
    output: {
        path: path.join(__dirname, DIST),
        filename: "[name].js",
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "buble-loader",
        }, {
            test: /\.html/,
            loader: "html-loader",
        }, {
            test: /\.scss$/,
            loader: "style-loader!css-loader?minimize=true!sass-loader",
        }, {
            test: /\.css/,
            loader: "style-loader!css-loader?minimize=true",
        }, {
            test: /\.(png|svg|jpg)$/,
            loader: "file-loader?name=[path][name].[ext]&context=./scripts",
        }, {
            test: /\.(eot|woff|woff2|ttf)$/,
            loader: "file-loader?name=[path][name].[ext]&context=./scripts",
        }, {
            test: /\.json$/,
            loader: "json-loader",
        }],
    },
    plugins: plugins,
};


