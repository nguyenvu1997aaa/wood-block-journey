const path = require('path')
const fse = require('fs-extra')

module.exports = function (snowpackConfig, pluginOptions) {
    const { patterns } = pluginOptions

    return {
        name: 'snowpack-plugin-copy-files',

        async optimize({ buildDirectory, log }) {
            if (patterns.length < 1) return

            for (const { source, destination, filenames = [] } of patterns) {
                source.map((src, index) => {
                    const filename = filenames[index] || path.basename(src)
                    const sourceResolve = path.resolve(src)

                    const destinationResolve = path.resolve(
                        `${buildDirectory}/${destination}/${filename}`
                    )

                    fse.copySync(sourceResolve, destinationResolve)
                })
            }

            log('Copy files done!')
        },
    }
}
