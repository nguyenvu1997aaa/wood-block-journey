/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const { mergeAndConcat } = require('merge-anything')
const dotenv = require('dotenv-flow')
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin')

const env = dotenv.config({
    path: path.resolve('./env'),
})

const { NODE_ENV, AUTO_VERSION, WEBPACK_CACHE, GRAPHICS_COMPRESS } = process.env

let BUILD_VERSION = process.env.SNOWPACK_PUBLIC_BUILD_VERSION

// Auto change new version
if (AUTO_VERSION === 'true' && +BUILD_VERSION >= 0) {
    const nextVersion = `${+BUILD_VERSION + 1}`

    const file = path.resolve(__dirname, `./env/.env.${NODE_ENV}.local`)

    if (file) {
        let data = fs.readFileSync(file, 'utf8')
        data = data.replace(/(SNOWPACK_PUBLIC_BUILD_VERSION\s?=)\s?([0-9]+)/, `$1 ${nextVersion}`)
        fs.writeFileSync(file, data)

        BUILD_VERSION = nextVersion
        env.parsed.SNOWPACK_PUBLIC_BUILD_VERSION = nextVersion
        process.env.SNOWPACK_PUBLIC_BUILD_VERSION = nextVersion

        console.log('BUILD_VERSION:', BUILD_VERSION)
    }
}

if (!NODE_ENV) {
    console.log('NODE_ENV not found')
    return
}

// console.log(env.parsed)

const globalVars = {}
Object.keys(env.parsed).forEach((key) => {
    globalVars[`import.meta.env.${key}`] = JSON.stringify(env.parsed[key])
})

const initConfig = () => {
    const webpackProduction = require('./webpack.production')
    const webpackDevelopment = require('./webpack.development')

    const envConfigs = {
        production: webpackProduction,
        development: webpackDevelopment,
    }

    const entryGame = [
        'whatwg-fetch',
        'abortcontroller-polyfill/dist/polyfill-patch-fetch',
        './libs/toBlobPolyfill.js',
        './src/GameCore.ts',
        './src/modules/game-sdk/index.ts',
    ]

    entryGame.push(path.resolve(__dirname, './src/libs/phaser-custom.min.js'))

    const spinePluginPath = path.resolve(__dirname, './src/libs/phaser-spine-plugin.min.js')
    const existSpinePlugin = fs.existsSync(spinePluginPath)

    if (existSpinePlugin) {
        entryGame.push(spinePluginPath)
    }

    entryGame.push(path.resolve(__dirname, './src/index.ts'))

    const plugins = [
        new webpack.DefinePlugin(globalVars),
        new webpack.ProgressPlugin(),
        new InlineSourceWebpackPlugin({
            compress: true,
            rootpath: './src',
            noAssetMatch: 'error',
            deleteAssets: ['./libs/initFbInstant.es5.js'],
        }),
    ]

    if (GRAPHICS_COMPRESS === 'true') {
        plugins.push(
            new ImageMinimizerPlugin({
                exclude: [
                    'assets/spine',
                    'assets/textures/1x/gameplay-resources.png',
                    'assets/textures/2x/gameplay-resources.png',
                    'assets/textures/1x/gameplay-32-resources.png',
                    'assets/textures/2x/gameplay-32-resources.png',
                    'assets/wideframes/wide-frame-game-result.png',
                    'assets/wideframes/wide-frame-message-win.png',
                ],
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    // Lossless optimization with custom option
                    // Feel free to experiment with options for better result for you
                    options: {
                        plugins: [
                            // ["imagemin-gifsicle", { interlaced: true }],
                            // jpegtran: lossless
                            // mozjpeg: lossy
                            ['imagemin-mozjpeg', { progressive: false }],
                            // optipng: lossless
                            // pngquant: lossy
                            // ["imagemin-optipng"],
                            [
                                'imagemin-pngquant',
                                {
                                    speed: 4,
                                    dithering: 1,
                                    quality: [0.3, 0.95],
                                    strip: true,
                                },
                            ],
                        ],
                    },
                },
            })
        )
    }

    const defaultConfig = {
        node: false,
        devtool: 'source-map',
        cache: WEBPACK_CACHE === 'true' && {
            type: 'filesystem',
            compression: 'gzip',
            allowCollectingMemory: true,
            cacheDirectory: path.resolve(__dirname, '.webpack_cache'),
        },
        entry: {
            game: entryGame,
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, './build'),
        },
        performance: {
            hints: 'warning',
            assetFilter: function (assetFilename) {
                return ['phaser-custom.min', 'bundle-stats'].indexOf(assetFilename) > -1
            },
        },
        plugins,
        optimization: {
            nodeEnv: NODE_ENV,
            moduleIds: 'size',
            minimize: true,
            sideEffects: true,
            runtimeChunk: false,
            providedExports: true,
            concatenateModules: true,
            minimizer: [new JsonMinimizerPlugin()],
            splitChunks: {
                cacheGroups: {
                    sdk: {
                        name: 'sdk',
                        test: /[[\\/]src[\\/]modules[\\/]game-sdk[\\/]/,
                        chunks: 'initial',
                    },
                    engine: {
                        name: 'engine',
                        test: /[[\\/]src[\\/]libs[\\/]/,
                        chunks: 'initial',
                    },
                    vendors: {
                        name: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    exclude: /node_modules/,
                    type: 'asset',
                },
                {
                    test: /\.[jt]sx?$/,
                    include: [
                        path.resolve(__dirname, './src'),

                        //* Add libs here if it not support es5
                        path.resolve(__dirname, './node_modules/is-what'),
                        path.resolve(__dirname, './node_modules/merge-anything'),
                        path.resolve(__dirname, './node_modules/.cache'),
                        path.resolve(__dirname, './node_modules/@snowpack'),
                        path.resolve(__dirname, './node_modules/@types'),
                        path.resolve(__dirname, './node_modules/is-what'),
                        path.resolve(__dirname, './node_modules/jest-worker'),
                    ],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            configFile: './configs/babel.config.json',
                        },
                    },
                },
                {
                    test: /\.htm$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: 'html-loader',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.ts'],
            alias: {
                './html/MockAd': path.resolve(__dirname, './src/ads/html/MockAd.webpack.htm'),
                phaser: path.resolve(__dirname, './src/libs/phaser-custom.min.js'),
                spinePlugin: existSpinePlugin ? spinePluginPath : false,
                '@': path.resolve(__dirname, './src'),
            },
        },
        watchOptions: {
            ignored: ['build', 'node_modules', '.history', '.webpack_cache'],
        },
    }

    const config = mergeAndConcat(defaultConfig, envConfigs[NODE_ENV])

    // console.info(config)

    return config
}

module.exports = initConfig
