const webpack = require("webpack");
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "0.0.0.0",
    port: 9696,
    client: {
      overlay: true,
    },
    hot: true,
    liveReload: true,
    historyApiFallback: { index: "/", disableDotRule: true },
  },
  optimization: {
    minimize: false,
    splitChunks: false,
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
    }),
  ],
});
