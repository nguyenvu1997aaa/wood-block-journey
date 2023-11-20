// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */

import fs from 'fs'
import path from 'path'

const cert = fs.readFileSync(path.resolve('./configs/localhost.cert'))
const key = fs.readFileSync(path.resolve('./configs/localhost.key'))

export default {
    extends: './snowpack.config.mjs',
    optimize: {
        preload: true,
        bundle: true,
        minify: true,
        sourcemap: false,
        splitting: true,
        treeshake: true,
        target: 'es2017',
    },
    mount: {
        libs: { url: '/libs', static: true },
        assets: { url: '/assets', static: true },
    },
    devOptions: {
        open: 'none',
        hmr: true,
        port: 8080,
        secure: { cert, key },
        // output: 'stream',
    },
    buildOptions: {
        baseUrl: './',
        clean: false,
        sourcemap: false,
    },
    plugins: [
        // ['@snowpack/plugin-optimize'],
        // ['@snowpack/plugin-webpack'],
        [
            './libs/snowpack-plugin-copy-files.js',
            {
                patterns: [
                    /* {
                        source: ['./node_modules/@sentry/browser/build/bundle.min.js'],
                        filenames: ['sentry.min.js'],
                        destination: 'libs',
                    }, */
                    /* {
                        source: ['./node_modules/rollbar/dist/rollbar.min.js'],
                        filenames: ['rollbar.min.js'],
                        destination: 'libs',
                    }, */
                    {
                        source: [
                            './assets/fonts',
                            './assets/images',
                            './assets/music',
                            './assets/sounds',
                            './assets/svgs',
                            './assets/textures',
                            './assets/wideframes',
                            './assets/spine',
                        ],
                        destination: 'assets',
                    },
                ],
            },
        ],
        ['./libs/snowpack-plugin-zip.js', { output: 'archives' }],
    ],
}
