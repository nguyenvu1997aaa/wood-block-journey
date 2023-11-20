const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
const { v4: uuid } = require('uuid')

module.exports = function (snowpackConfig, pluginOptions) {
    const { output } = pluginOptions

    return {
        name: 'snowpack-plugin-zip',

        async optimize({ buildDirectory, log }) {
            const zip = new AdmZip()
            const filename = uuid() + '.zip'
            const folder = path.resolve(`${buildDirectory}/${output}`)

            if (fs.existsSync(folder)) {
                fs.rmdirSync(folder, { force: true, recursive: true })
            }

            fs.mkdirSync(folder)

            zip.addLocalFolder(buildDirectory)
            zip.writeZip(path.resolve(`${folder}/${filename}`))

            log(`Wrote ZIP file to ${output}/${filename}`)
        },
    }
}
