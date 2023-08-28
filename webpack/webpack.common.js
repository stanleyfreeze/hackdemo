const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src/pages/");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader,
        {
            loader: "css-loader",
            options: {
                modules: {
                    localIdentName: '[local]-[hash:5]'
                }
            }
        },
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env",
                    ],
                }
            }
        },
        preProcessor,
    ].filter(Boolean);
}

module.exports = {
    entry: {
        popup: path.join(srcDir, 'popup/index.tsx'),
        options: path.join(srcDir, 'options.tsx'),
        background: path.join(srcDir, 'background/index.ts'),
        content_script: path.join(srcDir, 'content/index.tsx'),
        inject: path.join(srcDir, 'inject.ts'),
        newtab: path.join(srcDir, 'newtab.tsx'),
        devtools: path.join(srcDir, 'devtools.ts'),
        panel: path.join(srcDir, 'panel.tsx'),
        receiver:path.join(srcDir, 'receiver.tsx'),
        offscreen:path.join(srcDir, 'offscreen.tsx'),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
        clean: true
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
                return chunk.name !== 'background';
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: getStyleLoaders(),
            },
            {
                test: /\.less$/,
                use: getStyleLoaders("less-loader")
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 20 * 1024,
                    }
                },
                generator: {
                    filename: "static/imgs/[hash:8][ext][query]",
                }
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        alias: {
            '@': path.resolve(__dirname, '../src'),
        }
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
    ],
};
