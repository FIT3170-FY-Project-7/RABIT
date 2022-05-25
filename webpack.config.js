// Webpack Plugins.
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Buffer = require("buffer/").Buffer;
const {
    ProvidePlugin,
    SourceMapDevToolPlugin,
    BannerPlugin,
    ProgressPlugin,
} = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const DEV_PLUGINS = [
    // Development-only plugins.
    new SourceMapDevToolPlugin({ filename: "[file].map[query]" }),
    new BundleAnalyzerPlugin(),
    new SpeedMeasurePlugin(),
];
const PROD_PLUGINS = []; // Production-only plugins.

// Path library.
const path = require("path");

// Webpack configuration.
const PACKAGE_JSON = require("./package.json"); // The package.json file.

// Module configuration.
const INLINE_LIMIT = 10000; // 10 kb limit for inlining asset data.

module.exports = (env, argv) => {
    // Production VS Development.
    const IS_PROD = argv.mode === "production";

    return {
        devtool: IS_PROD ? false : "source-map",

        resolve: {
            alias: { react: path.join(__dirname, "node_modules", "react") },
            modules: [path.join(__dirname, "src"), "node_modules"],
            extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
            fallback: {
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer/"),
            },
        },
        entry: "./src/index.tsx",

        output: {
            publicPath: "/",
            path: path.resolve(__dirname, "dist"),
            hotUpdateMainFilename: "[id].hot-update.[fullhash].json",
            hotUpdateChunkFilename: "[id].hot-update.[fullhash].js",
            filename: "[name].[fullhash].bundle.js",
            clean: true,
        },

        devServer: {
            historyApiFallback: true,
            port: 3000
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: {
                                            node: "current",
                                            esmodules: true,
                                        },
                                    },
                                ],
                                "@babel/preset-typescript",
                                ["@babel/preset-react", { runtime: "automatic" }],
                            ],
                            plugins: [
                                "@babel/plugin-proposal-class-properties",
                                "@babel/plugin-transform-runtime",
                                "@babel/plugin-syntax-dynamic-import",
                            ],
                        },
                    },
                },
                { test: /\.css$/, use: ["style-loader", "css-loader"] },
                {
                    test: /\.scss$/,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                //{ test : /\.html$/, use : ['html-loader' /* 'markup-inline-loader' */                         ] },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: "svg-url-loader",
                            options: {
                                name: "[name].[fullhash].[ext]",
                                limit: INLINE_LIMIT, // If size < INLINE_LIMIT, add escaped image URL to CSS.
                                outputPath: "images", // If size > INLINE_LIMIT, move SVG file to public/images via file-loader.
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|gif|jpg|jpeg)(\?[a-z0-9]+)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                name: "[name].[fullhash].[ext]",
                                limit: INLINE_LIMIT, // If size < INLINE_LIMIT, inline base64-encoding of the image.
                                outputPath: "images", // If size > INLINE_LIMIT, move image to public/images via file-loader.
                            },
                        },
                    ],
                },
                {
                    test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                name: "[name].[fullhash].[ext]",
                                limit: INLINE_LIMIT, // If size < INLINE_LIMIT, inline base64-encoding of the font.
                                outputPath: "fonts", // If size > INLINE_LIMIT, move font to public/fonts via file-loader.
                            },
                        },
                    ],
                },
            ],
        },

        plugins: [
            ...(IS_PROD ? PROD_PLUGINS : DEV_PLUGINS),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "public",
                        to: "public",
                        globOptions: { ignore: ["index.html"] },
                    },
                ],
            }),
            new BannerPlugin(
                `${PACKAGE_JSON.name} | ${PACKAGE_JSON.version} | ${PACKAGE_JSON.author}`
            ),
            new ProgressPlugin((percent, msg, ...args) =>
                console.log(
                    `${(percent * 100).toFixed(2).padEnd(7)}% | ${msg} | ${args.join(
                        " | "
                    )}`
                )
            ),
            new HtmlWebPackPlugin({
                template: "./public/index.html", // The index.html file is used as a template here, which is why we ignore it in CopyWebpackPlugin.
                filename: "index.html", // The output file name.
                meta: {
                    // Metadata to be passed to the template's placeholder strings.
                    author: PACKAGE_JSON.author,
                    keywords: PACKAGE_JSON.keywords.join(","),
                    description: PACKAGE_JSON.description,
                },
            }),
        ],

        optimization: { minimize: IS_PROD, minimizer: [new TerserPlugin()] },
    };
};
