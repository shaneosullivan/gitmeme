const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = "../src/";

module.exports = {
  entry: {
    // popup: path.join(__dirname, srcDir + "popup.ts"),
    // options: path.join(__dirname, srcDir + "options.ts"),
    service_worker: path.join(__dirname, srcDir + "service_worker.ts"),
    contentScript: path.join(__dirname, srcDir + "contentScript.ts"),
  },
  output: {
    path: path.join(__dirname, "../build"),
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    // exclude locale files in moment
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new CopyPlugin([{ from: ".", to: "../" }], { context: "public" })
  ],
};
