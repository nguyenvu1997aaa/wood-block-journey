type StringKeyObjectType = Record<string, string>
export default class LanguagePlugin<
        S extends string,
        T extends StringKeyObjectType,
        TT extends StringKeyObjectType
    >
    extends Phaser.Plugins.BasePlugin
    implements ILanguagePlugin<S, T, TT>
{
    public Text: T
    public Texture: TT

    private currentLocale: S
    private supportedLanguages: string[]
    private data: LanguageLocalesType<S, T, TT>

    private options: ILanguagePluginConfig<S, T, TT>

    public configure(options: ILanguagePluginConfig<S, T, TT>): void {
        this.applyOptions(options)
    }

    public getCurrentLanguage(): S {
        return this.currentLocale
    }

    public switchLanguage(locale = 'en'): void {
        const correctLocale = this.getCorrectLocale(locale)

        this.currentLocale = correctLocale
        this.Text = this.data[correctLocale].Text
        this.Texture = this.data[correctLocale].Texture
    }

    public getText(options: keyof T | ILanguageGetTextOptions<T>): string {
        if (typeof options == 'object') {
            const { key, variables = [], locale = this.currentLocale } = options
            const correctLocale = this.getCorrectLocale(locale)
            const text = this.data[correctLocale].Text[key]
            return this.replaceVariables(text, variables)
        }

        return this.Text[options]
    }

    public getTexture(options: keyof TT | ILanguageGetTextureOptions<TT>): string {
        if (typeof options == 'object') {
            const { key, variables = [], locale = this.currentLocale } = options
            const correctLocale = this.getCorrectLocale(locale)
            const text = this.data[correctLocale].Texture[key]
            return this.replaceVariables(text, variables)
        }

        return this.Texture[options]
    }

    public isSupportLanguage(locale: string): boolean {
        return this.supportedLanguages.indexOf(locale) >= 0
    }

    public applyOptions(options: ILanguagePluginConfig<S, T, TT>): void {
        this.options = { ...options }
        const { data, locale = 'en', upperCaseText = false } = options

        this.data = data

        this.supportedLanguages = Object.keys(data)

        const correctLocale = this.getCorrectLocale(locale)

        this.currentLocale = correctLocale
        this.Text = data[correctLocale].Text
        this.Texture = data[correctLocale].Texture
        if (upperCaseText) {
            for (const keyText in this.Text) {
                this.Text[keyText] = this.Text[keyText].toUpperCase() as T[Extract<keyof T, string>]
            }
        }
    }

    public makeText(scene: Phaser.Scene, config: ILangBitmapTextConfig): LangBitmapText {
        const {
            maxWidth = Phaser.Math.MAX_SAFE_INTEGER,
            maxHeight = Phaser.Math.MAX_SAFE_INTEGER,
            align = 'center',
            drawMaxBoxDebug = false,
        } = config
        const text = scene.make.bitmapText(config)

        if (align === 'center') {
            text.setCenterAlign()
        } else if (align === 'left') {
            text.setLeftAlign()
        } else if (align === 'right') {
            text.setRightAlign()
        }
        if ((config.text || '').indexOf(' ') >= 0) text.setMaxWidth(maxWidth)
        while (text.width > maxWidth || text.height >= maxHeight) {
            text.setFontSize(text.fontSize * 0.95)
            console.log({ t: config.text, w: text.width, h: text.height })
        }

        if (drawMaxBoxDebug && GameCore.Utils.Valid.isDebugger()) {
            const graphics = scene.game.globalScene.add.graphics({
                lineStyle: { width: 2, color: 0xff0000 },
            })
            graphics.setDepth(Phaser.Math.MAX_SAFE_INTEGER)
            scene.game.globalScene.events.on(Phaser.Scenes.Events.UPDATE, () => {
                graphics.clear()
                if (text && text.visible && text.active) {
                    const { x, y } = text.getWorldPosition()
                    graphics.strokeRect(
                        x - 0.5 * maxWidth + (0.5 - text.originX) * text.width,
                        y - 0.5 * maxHeight + (0.5 - text.originY) * text.height,
                        maxWidth,
                        maxHeight
                    )
                }
            })
        }

        return text
    }

    public setFontSize(text: LangBitmapText, maxWidth?: number, maxHeight?: number): void {
        const mw = maxWidth ? maxWidth : Phaser.Math.MAX_SAFE_INTEGER
        const mh = maxHeight ? maxHeight : Phaser.Math.MAX_SAFE_INTEGER
        if ((text.text || '').indexOf(' ') >= 0) text.setMaxWidth(mw)

        while (text.width > mw || text.height >= mh) {
            text.setFontSize(text.fontSize * 0.95)
        }
    }

    private replaceVariables(text: string, variables: any[]): string {
        const length = variables.length
        if (length == 0) return text
        let count = 0
        const res = text.replace(/{.*}/, function () {
            return String(variables[Math.min(count++, length - 1)])
        })
        return res
    }

    private getCorrectLocale(locale: string): S {
        let correctLocale = locale as S
        if (!this.isSupportLanguage(locale)) {
            correctLocale = 'en' as S
        }
        return correctLocale
    }
}
