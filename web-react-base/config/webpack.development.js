const HtmlWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { join, resolve } = require("path");

const port = 8080;

module.exports = {
  devServer: {
    historyApiFallback: true,
    static: {
      directory: join(__dirname, "../dist"),
    },
    hot: true,
    port,
  },
  output: {
    publicPath: "/",
    filename: "scripts/[name].bundle.js",
    assetModuleFilename: "images/[name].[ext]",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      favicon: "./public/logo.svg",
      template: resolve(__dirname, "../src/index-dev.html"),
    }),
    //TODO: webpack 代码包的大小分析 以便后续优化
    // new BundleAnalyzerPlugin(),
  ],
};
