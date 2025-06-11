const merge = require("webpack-merge");
const argv = require("yargs-parser")(process.argv.slice(2));
const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ThemedProgressPlugin } = require("themed-progress-plugin");
const _mode = argv.mode || "development";
const _modeflag = _mode === "production" ? true : false;
const _mergeConfig = require(`./config/webpack.${_mode}.js`);

const webpackBaseConfig = {
  mode: _mode,
  entry: {
    app: resolve(__dirname, "./src/index.tsx"),
  },
  output: {
    path: resolve(process.cwd(), "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: "swc-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": resolve(__dirname, "./src"),
      "@assets": resolve(__dirname, "./src/assets"),
      "@components": resolve(__dirname, "./src/components"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@utils": resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: _modeflag
        ? "styles/[name].[contenthash:5].css"
        : "styles/[name].css",
      chunkFilename: _modeflag
        ? "styles/[name].[contenthash:5].css"
        : "styles/[name].css",
      ignoreOrder: false,
    }),
    new ThemedProgressPlugin(),
  ],
};

module.exports = merge.default(webpackBaseConfig, _mergeConfig);
