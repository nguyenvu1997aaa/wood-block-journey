export default class LanguageAdapter {
    static GetLangCode(locale: string): string {
        return locale.slice(0, 2)
    }
}
