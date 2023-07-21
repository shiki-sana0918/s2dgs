const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  // コンパイルモード
  mode: "production",
  // エントリーポイントの設定
  entry: {
    // コンパイル対象のファイルを指定
    index: path.resolve(__dirname, "./src/js/index.js"),
    "index.css": path.resolve(__dirname, "./src/sass/index.scss"),
  },
  // 出力設定
  output: {
    path: path.resolve(__dirname, "./dist/"), // 出力先フォルダを絶対パスで指定
    filename: "js/[name].js", // [name]にはentry:で指定したキーが入る
  },
  module: {
    rules: [

      // sassのコンパイル設定
      {
        test: /\.(sa|sc|c)ss$/, // 対象にするファイルを指定
        use: [
          MiniCssExtractPlugin.loader, // JSとCSSを別々に出力する
          "css-loader",
          "postcss-loader", // オプションはpostcss.config.jsで指定
          "sass-loader",
          // 下から順にコンパイル処理が実行されるので、記入順序に注意
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "src/images/[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 出力先のフォルダを一旦空に
    new CleanWebpackPlugin({
      // 対象ファイル指定
      cleanOnceBeforeBuildPatterns: [
        // 複数ある場合は配列で指定
        "**/*", // 出力フォルダ（output: で指定したパス）内のすべてのファイル
      ],
    }),
    new FixStyleOnlyEntriesPlugin(), // CSS別出力時の不要JSファイルを削除
    new MiniCssExtractPlugin({
      // CSSの出力先
      filename: "css/[name]", // 出力ファイル名を相対パスで指定（[name]にはentry:で指定したキーが入る）
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/images/*",
          to: path.resolve(__dirname, "dist", "images", "[name][ext]"),
        },
        {
          from: "src/*.html",
          to: path.resolve(__dirname, "dist", "[name][ext]"),
        },
      ],
    }),

  ],
  // node_modules を監視（watch）対象から除外
  watchOptions: {
    ignored: /node_modules/,
  },
};