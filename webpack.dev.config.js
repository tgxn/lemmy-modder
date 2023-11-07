const webpack = require("webpack");
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

// get git branch and short commit
const gitBranch = require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
const gitCommit = require("child_process").execSync("git rev-parse --short HEAD").toString().trim();

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
      PACKAGE_VERSION: `git-${gitBranch}-${gitCommit}`,
    }),
  ],
});
