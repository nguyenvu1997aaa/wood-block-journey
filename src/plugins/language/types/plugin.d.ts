type LanguageLocalesType<S, T, TT> = {
    [locale in S]: {
        Text: T
        Texture: TT
    }
}

type LangBitmapText = Phaser.GameObjects.BitmapText
interface ILangBitmapTextConfig extends Phaser.Types.GameObjects.BitmapText.BitmapTextConfig {
    maxWidth?: number
    maxHeight?: number
    drawMaxBoxDebug?: boolean
    align?: 'left' | 'right' | 'center'
}

interface ILanguagePlugin<S, T, TT> extends Phaser.Plugins.BasePlugin {
    Text: T

    Texture: TT

    public configure(config: ILanguagePluginConfig<S, T, TT>)

    public getCurrentLanguage(): S

    public switchLanguage(locale: string = 'en'): void

    public getText(key: keyof T): string
    public getText(options: ILanguageGetTextOptions<T>): string

    public getTexture(key: keyof TT): string
    public getTexture(options: ILanguageGetTextureOptions<TT>): string

    public isSupportLanguage(locale: string): boolean

    public applyOptions(options: ILanguagePluginConfig<S, T, TT>): void

    /**
     * A bitmapText that auto decrease default fontSize to match `maxWidth` and `maxHeight`.
     *
     * Recommend use it with plugin language if you have to translate to many language
     */
    public makeText(scene: Phaser.Scene, config: ILangBitmapTextConfig): LangBitmapText

    /**
     * Auto set fontSize to match `maxWidth` and `maxHeight`
     */
    public setFontSize(text: LangBitmapText, maxWidth?: number, maxHeight?: number): void
}

interface ILanguagePluginConfig<S, T, TT> {
    data: LanguageLocalesType<S, T, TT>
    locale?: string
    upperCaseText?: boolean
}

interface ILanguageGetOptions {
    variables?: any[]
    locale?: S
}

interface ILanguageGetTextOptions<T> extends ILanguageGetOptions {
    key: keyof T
}

interface ILanguageGetTextureOptions<TT> extends ILanguageGetOptions {
    key: keyof TT
}
