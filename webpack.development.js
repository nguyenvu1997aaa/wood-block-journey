/* eslint-disable @typescript-eslint/no-var-requires */

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const {
    NODE_ENV,

    SNOWPACK_PUBLIC_GAME_SDK: GAME_SDK,
    SNOWPACK_PUBLIC_GAME_NAME: GAME_NAME,
    SNOWPACK_PUBLIC_SENTRY_SDK: SENTRY_SDK,
    SNOWPACK_PUBLIC_SENTRY_DSN: SENTRY_DSN,
    // SNOWPACK_PUBLIC_ROLLBAR_SDK: ROLLBAR_SDK,
    SNOWPACK_PUBLIC_BUILD_VERSION: BUILD_VERSION,
    SNOWPACK_PUBLIC_SENTRY_SAMPLE_RATE: SENTRY_TRACE_RATE,
    SNOWPACK_PUBLIC_GA_MEASUREMENT_ID: GA_MEASUREMENT_ID,
} = process.env

const filesToCopy = {
    patterns: [
        { from: './assets/fonts', to: 'assets/fonts' },
        { from: './assets/images', to: 'assets/images' },
        { from: './assets/music', to: 'assets/music' },
        { from: './assets/sounds', to: 'assets/sounds' },
        { from: './assets/svgs', to: 'assets/svgs' },
        { from: './assets/textures', to: 'assets/textures' },
        { from: './assets/wideframes', to: 'assets/wideframes' },
        { from: './node_modules/@sentry/browser/build/bundle.min.js', to: 'libs/sentry.min.js' },
        // { from: './node_modules/rollbar/dist/rollbar.min.js', to: 'libs/rollbar.min.js' },
        { from: './src/libs/initFbInstant.es5.js', to: 'libs/initFbInstant.es5.js' },
        { from: './libs/fbinstant.mock.es5.js', to: 'libs/fbinstant.mock.es5.js' },
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
    inject: true,
    scriptLoading: 'defer',
    filename: 'index.html',
    template: './public/index.host.html',
    templateParameters: {
        title: GAME_NAME,
        ga4Script,
        sentryScript: scriptSentryWrapper,
        gameScript: `<script src="${GAME_SDK}"></script>`,
    },
}

const plugins = [new HtmlWebpackPlugin(htmlConfig)]

if (filesToCopy.patterns.length > 0) {
    plugins.push(new CopyWebpackPlugin(filesToCopy))
}

module.exports = {
    mode: 'development',
    devtool: 'eval',
    plugins,
    devServer: {
        historyApiFallback: true,
        https: false,
        port: 8080,
    },
}
