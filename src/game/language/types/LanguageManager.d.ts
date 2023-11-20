type ILanguageManagerConfig = Omit<
    ILanguagePluginConfig<SupportedLanguageType, LanguageLocalesType, LanguageLocalesType>,
    'data'
>

interface ILanguageManager
    extends ILanguagePlugin<SupportedLanguageType, LanguageTextType, LanguageTextureType> {
    public configure(config: ILanguageManagerConfig): void
}
