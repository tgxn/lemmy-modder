const webpack = require("webpack");
const { merge } = require("webpack-merge");

const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const common = require("./webpack.common.js");

const package = require("./package.json");
const packageVersion = package.version;

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  output: {
    filename: "[name].bundle.[contenthash].js",
    chunkFilename: "[name].bundle.[contenthash].js",

    publicPath: "./",
    clean: true,
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "production",
      PACKAGE_VERSION: packageVersion,
    }),
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 128000,
    maxAssetSize: 0,
  },

  optimization: {
    moduleIds: "deterministic",
    minimizer: [new CssMinimizerPlugin({})],
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
