const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  context: process.cwd(), //Webpack将基于运行Webpack命令的当前工作目录来解析入口文件和其他文件的路径
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "monitor.js",
  },
  devServer: {
    static: path.join(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "head",
    }),
  ],
};
