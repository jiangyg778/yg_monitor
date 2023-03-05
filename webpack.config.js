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
    onBeforeSetupMiddleware: function (devServer) {
      devServer.app.get("/success", function (req, res) {
        res.json({ id: 1 });
      });
      devServer.app.post("/error", function (req, res) {
        res.sendStatus(500);
      });
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "head",
    }),
  ],
};
