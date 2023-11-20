/* eslint-disable @typescript-eslint/no-var-requires */
// ! Support Phaser version 3.55.2
'use strict'

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { exec } = require('child_process')
// const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin')

const limitFps = false
const spinePlugin = true
const retryLoader = false
const showBundleStats = false
const copyTexture = true
const fixFBInstant = true
const customBitmapText = true

const types = []

const plugins = [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
        'typeof CANVAS_RENDERER': JSON.stringify(true),
        'typeof WEBGL_RENDERER': JSON.stringify(true),
        'typeof EXPERIMENTAL': JSON.stringify(false),
        'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
        'typeof PLUGIN_FBINSTANT': JSON.stringify(true),
    }),
    new CopyWebpackPlugin({
        patterns: [
            {
                from: './node_modules/phaser/plugins/spine/dist/SpinePlugin.min.js',
                to: './spine-plugin.min.js',
            },
        ],
    }),
]

if (limitFps) {
    plugins.push(
        new webpack.NormalModuleReplacementPlugin(/(.*)\/RequestAnimationFrame$/, function (
            resource
        ) {
            resource.request = path.resolve(__dirname, './override/dom/RequestAnimationFrame.js')
        })
    )
    types.push('--limit-fps')
}

if (retryLoader) {
    plugins.push(
        new webpack.NormalModuleReplacementPlugin(/(.*)\/LoaderPlugin$/, function (resource) {
            resource.request = path.resolve(__dirname, './override/loader/LoaderPlugin.js')
        }),
        new webpack.NormalModuleReplacementPlugin(/(.*)\/XHRLoader$/, function (resource) {
            resource.request = path.resolve(__dirname, './override/loader/XHRLoader.js')
        }),
        new webpack.NormalModuleReplacementPlugin(/(.*)\/XHRSettings$/, function (resource) {
            resource.request = path.resolve(__dirname, './override/loader/XHRSettings.js')
        }),
        new webpack.NormalModuleReplacementPlugin(/(.*)\/Config$/, function (resource) {
            resource.request = path.resolve(__dirname, './override/core/Config.js')
        })
    )

    types.push('--retry-loader')
}

if (spinePlugin) {
    plugins.push(
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './node_modules/phaser/plugins/spine/dist/SpinePlugin.min.js',
                    to: './phaser-spine-plugin.min.js',
                },
            ],
        })
    )

    types.push('--spine-plugin')
}

if (fixFBInstant) {
    plugins.push(
        new webpack.NormalModuleReplacementPlugin(/(.*)\/FacebookInstantGamesPlugin$/, function (
            resource
        ) {
            resource.request = path.resolve(
                __dirname,
                './override/plugins/fbinstant/FacebookInstantGamesPlugin.js'
            )
        })
    )
    types.push('--fix-fbinstant')
}

if (customBitmapText) {
    plugins.push(
        new webpack.NormalModuleReplacementPlugin(/(.*)\/GetBitmapTextSize$/, function (resource) {
            resource.request = path.resolve(
                __dirname,
                './override/gameobjects/bitmaptext/GetBitmapTextSize.js'
            )
        })
    )
}

if (copyTexture) {
    plugins.push(
        new webpack.NormalModuleReplacementPlugin(/(.*)\/Texture$/, function (resource) {
            // ignore
            if (resource.context.match(/phaser[\\/]src[\\/]gameobjects[\\/]components/)) {
                return
            }
            resource.request = path.resolve(__dirname, './override/textures/Texture.js')
        })
    )
    plugins.push(
        new webpack.NormalModuleReplacementPlugin(/(.*)\/Frame$/, function (resource) {
            resource.request = path.resolve(__dirname, './override/textures/Frame.js')
        })
    )
    types.push('--copy-texture')
}

if (showBundleStats) {
    plugins.push(
        new BundleStatsWebpackPlugin({
            baseline: true,
            outDir: 'stats',
        })
    )

    types.push('--show-bundle-stats')
}

const paramBuildTypes = types.join(' ')
exec(`yarn gulp build-phaser-types ${paramBuildTypes}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error.message}`)
        return
    }

    if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
    }

    console.log(`Build types phaser success fully with params: ${paramBuildTypes}`)
})

const initConfig = () => ({
    mode: 'production',
    stats: {
        preset: 'normal',
    },
    cache: {
        type: 'memory',
    },
    entry: {
        'phaser-custom': [path.resolve(__dirname, './phaser-custom.js')],
    },
    resolve: {
        alias: {
            phaser: path.resolve(__dirname, '../node_modules/phaser/src'),
            'phaser-plugins': path.resolve(__dirname, '../node_modules/phaser/plugins'),
            eventemitter3: path.resolve(__dirname, '../node_modules/eventemitter3'),
        },
        modules: ['node_modules/phaser/src', 'node_modules/phaser/plugins'],
    },
    output: {
        path: path.resolve(__dirname, '../src/libs'),
        filename: '[name].min.js',
        library: 'Phaser',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    devtool: false,
    performance: { hints: false },
    plugins,
})

module.exports = initConfig
