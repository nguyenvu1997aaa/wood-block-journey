/* eslint-disable @typescript-eslint/no-var-requires */

const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin')
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')

const useBundleAnalyzer = true

const {
    NODE_ENV,
    CHECK_TS,
    SENTRY_DEPLOY,
    ROLLBAR_DEPLOY,
    ROLLBAR_SOURCE_URL,
    SENTRY_SOURCE_URL,
    ROLLBAR_SERVER_ACCESS_TOKEN,
    SNOWPACK_PUBLIC_DEBUG: DEBUG,
    SNOWPACK_PUBLIC_GAME_SDK: GAME_SDK,
    SNOWPACK_PUBLIC_GAME_NAME: GAME_NAME,
    SNOWPACK_PUBLIC_SENTRY_SDK: SENTRY_SDK,
    SNOWPACK_PUBLIC_SENTRY_DSN: SENTRY_DSN,
    SNOWPACK_PUBLIC_BUILD_VERSION: BUILD_VERSION,
    SNOWPACK_PUBLIC_SENTRY_SAMPLE_RATE: SENTRY_TRACE_RATE,
    SNOWPACK_PUBLIC_GA_MEASUREMENT_ID: GA_MEASUREMENT_ID,
} = process.env

const filesToCopy = {
    patterns: [
        { from: './assets/fonts', to: 'assets/fonts' },
        { from: './assets/images', to: 'assets/images' },
        { from: './assets/json', to: 'assets/json' },
        { from: './assets/music', to: 'assets/music' },
        { from: './assets/sounds', to: 'assets/sounds' },
        { from: './assets/svgs', to: 'assets/svgs' },
        { from: './assets/textures', to: 'assets/textures' },
        { from: './assets/wideframes', to: 'assets/wideframes' },
        { from: './assets/spine', to: 'assets/spine' },
        { from: './node_modules/@sentry/browser/build/bundle.min.js', to: 'libs/sentry.min.js' },
        // { from: './node_modules/rollbar/dist/rollbar.min.js', to: 'libs/rollbar.min.js' },
        { from: './src/libs/initFbInstant.es5.js', to: 'libs/initFbInstant.es5.js' },
    ],
}

const scriptSentryWrapper = `<script defer src="${SENTRY_SDK}"></script>
    <script>
    "use strict"

    var waitSentryTimer = setInterval(function () {
    if (!window.hasOwnProperty('Sentry')) return
    clearInterval(waitSentryTimer)
    var dns = "${SENTRY_DSN}"
    if(dns === "null" || !dns) return
    
    Sentry.init({
        dsn: dns,
        environment: '${NODE_ENV}',
        release: '${BUILD_VERSION}',
        tracesSampleRate: '${SENTRY_TRACE_RATE}',
    })
    }, 100)
</script>`

const ga4Script = `
${
    GA_MEASUREMENT_ID != 'null'
        ? `<link href="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}" rel="preload" as="script"/>`
        : ''
}
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.__GA_CONFIG = {
            GAME_NAME: '${GAME_NAME}',
            GA_MEASUREMENT_ID: '${GA_MEASUREMENT_ID}',
            BUILD_VERSION: '${BUILD_VERSION}',
        }
        
    </script>`

const htmlConfig = {
    minify: true,
    inject: false,
    scriptLoading: 'defer',
    filename: 'index.html',
    template: './public/index.prod.html',
    templateParameters: {
        title: GAME_NAME,
        ga4Script,
        sentryScript: scriptSentryWrapper,
        gameScript: `<script src="${GAME_SDK}"></script>`,
    },
}

const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(htmlConfig),
    new InlineSourceWebpackPlugin({
        compress: true,
        rootpath: './src',
        noAssetMatch: 'error',
        deleteAssets: ['./libs/initFbInstant.es5.js'],
    }),
]

if (filesToCopy.patterns.length > 0) {
    plugins.push(new CopyWebpackPlugin(filesToCopy))
}

if (CHECK_TS) {
    plugins.push(new ForkTsCheckerWebpackPlugin())
}

if (SENTRY_DEPLOY && BUILD_VERSION && SENTRY_SOURCE_URL !== '~/') {
    plugins.push(
        new webpack.SourceMapDevToolPlugin({
            noSources: false,
            filename: 'sourcemaps/[file].map',
        })
    )

    plugins.push(
        new SentryWebpackPlugin({
            // dryRun: true,
            rewrite: false,
            validate: true,
            urlPrefix: SENTRY_SOURCE_URL,
            sourceMapReference: false,
            include: ['./build'],
            ignore: ['assets', 'libs', 'configs', 'node_modules'],
            release: BUILD_VERSION,
        })
    )
}

if (
    ROLLBAR_DEPLOY &&
    BUILD_VERSION &&
    ROLLBAR_SOURCE_URL !== '~/' &&
    ROLLBAR_SERVER_ACCESS_TOKEN !== null
) {
    console.log('Build version: ' + BUILD_VERSION)
    console.log('Rollbar source url: ' + ROLLBAR_SOURCE_URL)

    plugins.push(
        new webpack.SourceMapDevToolPlugin({
            noSources: false,
            filename: 'sourcemaps/[file].map',
        })
    )

    plugins.push(
        new RollbarSourceMapPlugin({
            version: BUILD_VERSION,
            publicPath: ROLLBAR_SOURCE_URL,
            accessToken: ROLLBAR_SERVER_ACCESS_TOKEN,
        })
    )
}

if (useBundleAnalyzer) {
    plugins.push(
        new BundleStatsWebpackPlugin({
            baseline: true,
            outDir: 'stats',
        })
    )
}

module.exports = {
    mode: 'production',
    devtool: false,
    plugins,
    // ? For embed mode
    devServer: {
        historyApiFallback: true,
        https: true,
        port: 8080,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.[jt]sx?$/,
                extractComments: false,
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: '6',
                        passes: 1,
                        inline: 2,
                        warnings: false,
                        arguments: true,
                        expression: true,
                        comparisons: false,
                        drop_console: DEBUG !== 'true',
                    },
                    output: {
                        ecma: 5,
                        safari10: true,
                        beautify: false,
                        comments: false,
                        ascii_only: true,
                    },
                    mangle: { safari10: true },
                },
            }),
        ],
    },
}
