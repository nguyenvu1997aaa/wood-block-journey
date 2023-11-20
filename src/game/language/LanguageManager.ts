import LanguagePlugin from '@/plugins/language/LanguagePlugin'
import languageData from './locales'

class LanguageManager extends LanguagePlugin<
    SupportedLanguageType,
    LanguageTextType,
    LanguageTextureType
> {
    configure(config: ILanguageManagerConfig): void {
        super.configure({
            data: languageData,
            locale: 'en',
            upperCaseText: false,
            ...config,
        })
    }
}

export default LanguageManager
