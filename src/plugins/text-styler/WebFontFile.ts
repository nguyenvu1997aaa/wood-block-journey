import WebFontLoader from 'webfontloader'

class WebFontFile extends Phaser.Loader.File {
    private payload: WebfontPayload

    constructor(loader: Phaser.Loader.LoaderPlugin, payload: WebfontPayload) {
        super(loader, {
            type: 'webfont',
            key: payload.type,
        })

        this.payload = payload
    }

    public load() {
        const { type } = this.payload

        let config
        switch (type) {
            case 'google':
                config = this.getGoogleFontConfig(this.payload)
                break

            case 'local':
                config = this.getLocalFontConfig(this.payload)
                break
        }

        WebFontLoader.load(config)
    }

    private getGoogleFontConfig(payload: WebfontPayload): WebFontLoader.Config {
        const { character: charater, fontName, fontWeight = 400 } = payload

        return {
            google: {
                families: [`${fontName}:${fontWeight}`],
                text: charater,
            },
            active: () => {
                this.loader.nextFile(this, true)
            },
            timeout: 15000,
        }
    }

    private getLocalFontConfig(payload: WebfontPayload): WebFontLoader.Config {
        const { fontName, fontType } = payload

        //  Inject our CSS
        const element = document.createElement('style')
        document.head.appendChild(element)
        const sheet = element.sheet

        if (sheet) {
            const ext = fontType === 'opentype' ? '.otf' : '.ttf'
            const styles = `@font-face { font-family: "${fontName}"; src: url("assets/fonts/${fontName}${ext}") format("${fontType}"); }`

            sheet.insertRule(styles, 0)
        }

        return {
            custom: {
                families: [fontName],
            },
            active: () => {
                this.loader.nextFile(this, true)
            },
            timeout: 15000,
        }
    }
}

export default WebFontFile
