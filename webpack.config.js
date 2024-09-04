const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const USE_LINTER = false; // Uses the .eslintrc.json file if set to true

console.log("[" + String(new Date().getHours()).padStart(2, '0') + 
                ":" + String(new Date().getMinutes()).padStart(2, '0') + 
                ":" + String(new Date().getSeconds()).padStart(2, '0') + "] " + 
                "Creating files for dist folder...\n");

////////////////////////////////////////////////////////////////////////////////
// Objects and values for webpack setup
////////////////////////////////////////////////////////////////////////////////

const JS_ENTRY = {
    "dkfds": './src/js/dkfds.js',
};

const JS_OUTPUT_PATH = path.resolve(__dirname, 'dist');

const JS_OUTPUT_LIBRARY = {
    name: 'DKFDS',
    type: 'umd',
};

const JS_BABEL = {
    rules: [
        {
            test: /\.(?:js|mjs|cjs)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', { targets: "Chrome >= 102 or Edge >= 102 or Firefox >= 112 or Safari >= 15.5 or last 2 iOS versions or last 2 ChromeAndroid versions or last 2 Samsung versions or > 0.5% and not dead" }]
                    ]
                }
            }
        }
    ]
};

const CSS_ENTRY = {
    "dkfds-borgerdk": './src/stylesheets/dkfds-borgerdk.scss',
    "dkfds-virkdk": './src/stylesheets/dkfds-virkdk.scss',
    "dkfds": './src/stylesheets/dkfds.scss',
    "dkfds-custom-input": './src/stylesheets/custom-elements/fds-input.scss',
};

const CSS_REMOVE_EMPTY_SCRIPTS = 
    new RemoveEmptyScriptsPlugin(); // There's a bug in webpack/loaders where empty js files are created for each stylesheet - remove those js files

const CSS_LOADER = {
    loader: 'css-loader',
    options: {
        importLoaders: 2, // Import postcss-loader and sass-loader
        url: false        // Prevent parsing of urls
    }
};

const CSS_POSTCSS_LOADER = {
    loader: "postcss-loader",
    options: {
        postcssOptions: {
            plugins: [
                [
                    "postcss-preset-env",
                    {
                        // Stage options: https://github.com/csstools/postcss-preset-env?tab=readme-ov-file#stage
                        stage: 2,
                        // Feature list: https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md
                        features: { 
                            "cascade-layers": false,
                            "text-decoration-shorthand": false,
                            "unset-value": false
                        },
                        // Autoprefixer options: https://github.com/postcss/autoprefixer#options
                        autoprefixer: { 
                            remove: false
                        }
                    },
                ],
            ],
        },
    },
};

const CSS_OUTPUT = {
    path: path.resolve(__dirname, 'dist'),
};

////////////////////////////////////////////////////////////////////////////////
// Objects for module.exports
////////////////////////////////////////////////////////////////////////////////

const copyFilesAndCreateJavaScript = {
    name: 'copyFilesAndCreateJavaScript',
    mode: 'production',
    module: JS_BABEL,
    optimization: {
        minimize: false
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/fonts", to: "fonts" },
                { from: "src/img", to: "img" },
                { from: "src/stylesheets", to: "scss" },
                { from: path.resolve(__dirname, 'README.md'), to: path.resolve(__dirname, 'dist') },
                { from: path.resolve(__dirname, 'LICENSE.md'), to: path.resolve(__dirname, 'dist') },
            ],
        }),
        new ESLintPlugin({
            emitError: USE_LINTER,
            emitWarning: USE_LINTER,
            failOnError: false,
            failOnWarning: false,
            fix: false
        }),
    ],
    entry: JS_ENTRY,
    output: {
        path: JS_OUTPUT_PATH,
        clean: true, // Clean the entire dist directory before emit.
        filename: 'js/[name].js',
        globalObject: 'this',
        library: JS_OUTPUT_LIBRARY,
    },
    stats: 'minimal',
};

const createMinifiedJavaScript = {
    name: 'createMinifiedJavaScript',
    dependencies: ['copyFilesAndCreateJavaScript'],
    mode: 'production',
    module: JS_BABEL,
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    devtool: "source-map",
    entry: JS_ENTRY,
    output: {
        path: JS_OUTPUT_PATH,
        filename: 'js/[name].min.js',
        globalObject: 'this',
        library: JS_OUTPUT_LIBRARY,
    },
    stats: 'minimal',
};

const createCSS = {
    name: 'createCSS',
    dependencies: ['copyFilesAndCreateJavaScript'],
    mode: 'production',
    entry: CSS_ENTRY,
    plugins: [
        CSS_REMOVE_EMPTY_SCRIPTS,
        /* Create stylesheets */
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    CSS_LOADER,
                    CSS_POSTCSS_LOADER,
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                outputStyle: "expanded",
                            },
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        /* File is not minified - this step just remove comments. List of options: https://cssnano.co/docs/what-are-optimisations/ */
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            autoprefixer: false,
                            cssDeclarationSorter: false,
                            calc: false,
                            colormin: false,
                            convertValues: false,
                            discardComments: true, // Remove comments from CSS files
                            discardDuplicates: false,
                            discardEmpty: false,
                            discardOverridden: false,
                            discardUnused: false,
                            mergeIdents: false,
                            mergeLonghand: false,
                            mergeRules: false,
                            minifyFontValues: false,
                            minifyGradients: false,
                            minifyParams: false,
                            minifySelectors: false,
                            normalizeCharset: false,
                            normalizeDisplayValues: false,
                            normalizePositions: false,
                            normalizeRepeatStyle: false,
                            normalizeString: false,
                            normalizeTimingFunctions: false,
                            normalizeUnicode: false,
                            normalizeUrl: false,
                            normalizeWhitespace: false,
                            orderedValues: false,
                            reduceIdents: false,
                            reduceInitial: false,
                            reduceTransforms: false,
                            svgo: false,
                            uniqueSelectors: false,
                            zindex: false
                        },
                    ],
                },
            }),
        ],
    },
    output: CSS_OUTPUT,
    stats: 'minimal',
};

const createMinifiedCSS = {
    name: 'createMinifiedCSS',
    dependencies: ['copyFilesAndCreateJavaScript'],
    mode: 'production',
    devtool: "source-map",
    entry: CSS_ENTRY,
    plugins: [
        CSS_REMOVE_EMPTY_SCRIPTS,
        /* Create minified stylesheets */
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    CSS_LOADER,
                    CSS_POSTCSS_LOADER,
                    {
                        loader: "sass-loader",
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
    output: CSS_OUTPUT,
    stats: 'minimal',
};

////////////////////////////////////////////////////////////////////////////////
// DEPRECATED
////////////////////////////////////////////////////////////////////////////////

const createDEPRECATEDJavaScript = {
    name: 'createDEPRECATEDJavaScript',
    dependencies: ['copyFilesAndCreateJavaScript'],
    mode: 'production',
    module: JS_BABEL,
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    devtool: "source-map",
    entry: {
        "dkfds-DEPRECATED": './src/DEPRECATED/js/dkfds-DEPRECATED.js',
    },
    output: {
        path: JS_OUTPUT_PATH,
        filename: 'DEPRECATED/[name].min.js',
        globalObject: 'this',
        library: JS_OUTPUT_LIBRARY,
    },
    stats: 'minimal',
};

const createDEPRECATEDCSS = {
    name: 'createDEPRECATEDCSS',
    dependencies: ['copyFilesAndCreateJavaScript'],
    mode: 'production',
    devtool: "source-map",
    entry: {
        "dkfds-borgerdk-DEPRECATED": './src/DEPRECATED/stylesheets/dkfds-borgerdk-DEPRECATED.scss',
        "dkfds-virkdk-DEPRECATED": './src/DEPRECATED/stylesheets/dkfds-virkdk-DEPRECATED.scss',
    },
    plugins: [
        CSS_REMOVE_EMPTY_SCRIPTS,
        /* Create minified stylesheets */
        new MiniCssExtractPlugin({
            filename: 'DEPRECATED/[name].min.css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    CSS_LOADER,
                    CSS_POSTCSS_LOADER,
                    {
                        loader: "sass-loader",
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
    output: CSS_OUTPUT,
    stats: 'minimal',
};

////////////////////////////////////////////////////////////////////////////////
// CUSTOM ELEMENT
////////////////////////////////////////////////////////////////////////////////

const createCustomElementJavaScript = {
    name: 'createCustomElementJavaScript',
    dependencies: ['copyFilesAndCreateJavaScript'],
    mode: 'production',
    module: JS_BABEL,
    optimization: {
        minimize: false
    },
    devtool: "source-map",
    entry: {
        "dkfds-custom-elements": './src/js/dkfds-custom-elements.js',
    },
    output: {
        path: JS_OUTPUT_PATH,
        filename: 'js/[name].js',
    },
    stats: 'minimal',
};

////////////////////////////////////////////////////////////////////////////////
// module.exports
////////////////////////////////////////////////////////////////////////////////

module.exports = [copyFilesAndCreateJavaScript, createMinifiedJavaScript, createCSS, createMinifiedCSS, createDEPRECATEDJavaScript, createDEPRECATEDCSS, createCustomElementJavaScript];