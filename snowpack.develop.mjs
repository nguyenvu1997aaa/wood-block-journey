// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */

import fs from 'fs'
import path from 'path'

const EMBED = process.env.EMBED
const POLYFILL = process.env.POLYFILL

const cert = fs.readFileSync(path.resolve('./configs/localhost.cert'))
const key = fs.readFileSync(path.resolve('./configs/localhost.key'))

const plugins = [['@snowpack/plugin-typescript', { args: '--project tsconfig.json' }]]

if (POLYFILL) {
    plugins.push([
        '@snowpack/plugin-optimize',
        {
            target: ['es5'],
        },
    ])
    /* plugins.push([
        '@snowpack/plugin-babel',
        {
            input: ['.js', '.ts', '.mjs'],
            transformOptions: {
                configFile: './configs/babel.config.json',
            },
        },
    ]) */
}

export default {
    extends: './snowpack.config.mjs',
    mount: {
        libs: { url: '/libs', static: true },
        assets: { url: '/assets', static: true },
    },
    devOptions: {
        open: 'none',
        hmr: true,
        port: 8080,
        secure: EMBED ? { key, cert } : false,
        // output: 'stream',
    },
    optimize: {
        bundle: true,
        sourcemap: true,
        splitting: true,
        treeshake: true,
        target: 'es2017',
    },
    plugins,
}
