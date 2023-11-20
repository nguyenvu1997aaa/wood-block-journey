/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp')
const zip = require('gulp-zip')
const request = require('request')
const fs = require('fs')
const op = require('open')
const del = require('del')
const { v4: uuidv4 } = require('uuid')
const { promisify } = require('util')
const i18nGenerator = require('i18n-generator')
const acorn = require('acorn')
const { glob } = require('glob')

function archive(archivesFolder, filename) {
    return new Promise(function (resolve, reject) {
        console.log('Going to create zip archive: ' + archivesFolder + '/' + filename)
        gulp.src([__dirname + '/build/**', '!' + __dirname + '/build/archives/**', '!**.zip'])
            .pipe(zip(filename))
            .on('error', reject)
            .pipe(gulp.dest(archivesFolder))
            .on('end', function () {
                console.log('ZIP archive created')
                resolve()
            })
    })
}

function upload(archivesFolder, filename) {
    return new Promise(async function (resolve, reject) {
        console.log('Going to upload archive: ' + archivesFolder + '/' + filename)
        const config = require('./fbdeploy-config.json')
        let developerName = typeof config.developer === 'undefined' ? 'undefined' : config.developer
        const currentBranch = await getCurrentGitBranchAsync()

        request.post(
            {
                url: 'https://graph-video.facebook.com/' + config.FB_appId + '/assets',
                formData: {
                    access_token: config.FB_uploadAccessToken,
                    type: 'BUNDLE',
                    comment: `Uploaded by ${developerName} (${currentBranch})`,
                    asset: {
                        value: fs.createReadStream(
                            __dirname + '/' + archivesFolder + '/' + filename
                        ),
                        options: {
                            filename: filename,
                            contentType: 'application/octet-stream',
                        },
                    },
                },
            },
            function (error, response, body) {
                if (error || !body) reject(error)
                try {
                    const responseBody = JSON.parse(response.body)
                    if (responseBody.success) {
                        console.log('Bundle uploaded via the graph API')
                        console.log("Don't forget you need to publish the build")
                        console.log('Opening developer dashboard...')
                        op(
                            'https://developers.facebook.com/apps/' +
                                config.FB_appId +
                                '/instant-games/hosting/'
                        )
                        resolve()
                    } else {
                        reject('Upload failed. Unexpected Graph API response: ' + response.body)
                    }
                } catch (e) {
                    reject('Upload failed. Invalid response response: ' + response.body)
                }
            }
        )
    })
}

const writeFileAsync = promisify(fs.writeFile)

// fetch command line arguments
const arg = ((argList) => {
    let arg = {},
        a,
        opt,
        thisOpt,
        curOpt
    for (a = 0; a < argList.length; a++) {
        thisOpt = argList[a].trim()
        opt = thisOpt.replace(/^-+/, '')

        if (opt === thisOpt) {
            // argument value
            if (curOpt) arg[curOpt] = opt
            curOpt = null
        } else {
            // argument name
            curOpt = opt
            arg[curOpt] = true
        }
    }

    return arg
})(process.argv)

/*
 * `gulp tasks`
 */

gulp.task('push', function () {
    const filename = uuidv4() + '.zip'
    const archivesFolder = 'build/archives'

    return archive(archivesFolder, filename)
        .then(function () {
            upload(archivesFolder, filename)
                .then(function () {
                    console.log('Success!')
                })
                .catch(function (error) {
                    console.log(error)
                })
        })
        .catch(function () {
            console.log('Archive Fail!')
        })
})

gulp.task('archive', function () {
    const filename = uuidv4() + '.zip'
    const archivesFolder = 'build/archives'

    return archive(archivesFolder, filename)
        .then(function () {
            console.log('Success!')
        })
        .catch(function (error) {
            console.log(error)
        })
})

gulp.task(
    'clear-sourcemap',
    () =>
        new Promise((resolve) => {
            del.sync(['build/sourcemaps'], { force: true })
            resolve()
        })
)

gulp.task('init-core', () => {
    return new Promise((resolve) => {
        const { developer, appid, apptoken } = arg
        if (!appid || !developer) {
            console.log(
                '===================================================================================================================='
            )
            console.log(
                'WARNING: Please run with args: --developer {your-name} --appid {appid} --apptoken {apptoken}'
            )
            console.log(
                '===================================================================================================================='
            )
            resolve('Lost args!')
            return
        }

        if (appid && apptoken && developer) {
            if (!fs.existsSync('./fbdeploy-config.json')) {
                writeFileAsync(
                    './fbdeploy-config.json',
                    `{\n\t"developer": "${developer}",\n\t"FB_appId": "${appid}",\n\t"FB_uploadAccessToken": "${appid}|${apptoken}"\n}`
                )
            }
        }

        // Creat empty env files
        if (!fs.existsSync('./env/.env.development.local')) {
            writeFileAsync('./env/.env.development.local', '')
        }

        if (!fs.existsSync('./env/.env.production.local')) {
            writeFileAsync('./env/.env.production.local', '')
        }

        // Creat empty configs files
        const content = `const defaultConfig: DeepPartial<IConfig> = {\n\tAppId: '${appid}'\n}\n\nexport default defaultConfig`
        writeFileAsync('./src/configs/config.production.custom.ts', content)
        writeFileAsync('./src/configs/config.development.custom.ts', content)

        resolve()
    })
})

gulp.task('language', () => {
    return new Promise((resolve, reject) => {
        i18nGenerator.get('./assets/language/text.csv', 'csv', (err, data) => {
            const keys = Object.keys(data)

            for (key of keys) {
                fs.writeFileSync(
                    `./src/game/language/locales/${key}.json`,
                    JSON.stringify(data[key], undefined, 4).replace(/\\\\/g, '\\')
                )
            }

            const firstKey = keys[0]
            const defaultLanguage = data[firstKey]
            const text = defaultLanguage['Text']
            const texture = defaultLanguage['Texture']
            const keysOfText = Object.keys(text)
            const keysOfTexture = Object.keys(texture)

            let typeFile = 'type SupportedLanguageType="' + keys.join('" | "') + '";\n'

            typeFile += 'type LanguageTextType={\n    '

            for (const k of keysOfText) {
                typeFile += `"${k}": string;\n    `
            }
            typeFile += '};\ntype LanguageTextureType={\n    '

            for (const k of keysOfTexture) {
                typeFile += `"${k}": string;\n    `
            }

            typeFile += '};\n'

            fs.writeFileSync('./src/game/language/types/locales.d.ts', typeFile)

            let indexFile = ''
            for (key of keys) {
                indexFile += `import ${key} from './${key}.json'\n`
            }

            indexFile +=
                '\nconst locales: LanguageLocalesType<SupportedLanguageType, LanguageTextType, LanguageTextureType> = {\n'

            for (key of keys) {
                indexFile += `    ${key},\n`
            }

            indexFile += '}\n\nexport default locales\n'

            fs.writeFileSync('./src/game/language/locales/index.ts', indexFile)

            resolve()
        })
    })
})

gulp.task('build-phaser-types', () => {
    return new Promise((resolve) => {
        const param = process.argv
        copyDirectory('./node_modules/phaser/types', 'phaser/types')

        if (param.indexOf('--retry-loader') >= 0) {
            const phaserTypePath = './phaser/types/phaser.d.ts'
            const phaserTypes = fs.readFileSync(phaserTypePath)

            const LoaderConfigTypes = fs.readFileSync(
                './phaser/types-custom/LoaderConfig.custom.d.ts'
            )

            const XHRSettingsObjectTypes = fs.readFileSync(
                './phaser/types-custom/XHRSettingsObject.custom.d.ts'
            )

            let phaserTypesString = phaserTypes.toString()

            phaserTypesString = phaserTypesString.replace(
                /[^\S\r\n]*type LoaderConfig = {([\s\S]*?)};/,
                LoaderConfigTypes.toString()
            )

            phaserTypesString = phaserTypesString.replace(
                /[^\S\r\n]*type XHRSettingsObject = {([\s\S]*?)};/,
                XHRSettingsObjectTypes.toString()
            )

            fs.writeFileSync('./phaser/types/phaser.d.ts', phaserTypesString)
        }

        resolve()
    })
})

gulp.task('validate-es5-build-files', () => {
    return new Promise(async (resolve) => {
        const { in: input } = arg

        if (!input) {
            throw new Error('Input path not found!')
        }

        const paths = input.split(' ')

        const buildFiles = await glob(paths)

        if (!buildFiles || buildFiles.length <= 0) {
            throw new Error('Build files not found!')
        }

        buildFiles.forEach((file) => {
            console.log(`Validating file: ${file}`)

            const content = fs.readFileSync(file)

            try {
                acorn.parse(content.toString(), { ecmaVersion: 5, locations: true })
            } catch (error) {
                throw error
            }
        })

        console.log('All files are es5 compatible!')

        resolve()
    })
})

gulp.task('validate-es5-single-code', () => {
    return new Promise((resolve) => {
        const { in: input } = arg

        if (!input) {
            throw new Error('No input code found!')
        }

        try {
            acorn.parse(input, { ecmaVersion: 5, locations: true })
        } catch (error) {
            throw error
        }

        console.log('Code is es5 compatible!')

        resolve()
    })
})

function copyDirectory(source, destination) {
    fs.mkdirSync(destination, { recursive: true })

    fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
        let sourcePath = `${source}/${entry.name}`
        let destinationPath = `${destination}/${entry.name}`

        entry.isDirectory()
            ? copyDirectory(sourcePath, destinationPath)
            : fs.copyFileSync(sourcePath, destinationPath)
    })
}

const getCurrentGitBranchAsync = () => {
    return new Promise((resolve) => {
        const { exec } = require('child_process')

        exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
            if (err) throw new Error(err)
            resolve(stdout?.trim())
        })
    })
}
