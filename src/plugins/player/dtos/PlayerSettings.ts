import { defaultSettings } from '../constants/DefaultSettings'

const {
    sound: defaultSound,
    music: defaultMusic,
    vibrate: defaultVibrate,
    language: defaultLanguage,
    theme: defaultTheme,
} = defaultSettings

class PlayerSettingsDtos {
    private sound: boolean
    private music: boolean
    private vibrate: boolean
    private language: string
    private theme: string

    constructor(data: TObject) {
        const { sound, music, vibrate, language, theme } = data || {}

        this.sound = GameCore.Utils.Valid.isBoolean(sound) ? sound : defaultSound
        this.music = GameCore.Utils.Valid.isBoolean(music) ? music : defaultMusic
        this.vibrate = GameCore.Utils.Valid.isBoolean(vibrate) ? vibrate : defaultVibrate
        this.language = GameCore.Utils.Valid.isString(language) ? language : defaultLanguage
        this.theme = GameCore.Utils.Valid.isString(theme) ? theme : defaultTheme
    }

    toObject(): IPlayerSetting {
        return {
            sound: this.sound,
            music: this.music,
            vibrate: this.vibrate,
            language: this.language,
            theme: this.theme,
        }
    }
}

export default PlayerSettingsDtos
