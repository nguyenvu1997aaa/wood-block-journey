// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */

export default {
    exclude: ['**/node_modules/**', './config/**', './phaser/**'],
    mount: {
        src: '/',
        public: '/',
    },
    alias: {
        phaser: './src/libs/phaser-custom.min.js',
        spinePlugin: './src/libs/phaser-spine-plugin.min.js',
        '@': './src',
    },
    packageOptions: {
        polyfillNode: false,
    },
    plugins: [
        ['@snowpack/plugin-dotenv', { dir: './env' }],
        '@snakemode/snowpack-html-loader-plugin',
    ],
}
