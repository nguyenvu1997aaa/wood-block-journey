import defaultPlayerData from '../constants/DefaultPlayerData'
import PlayerSettingsDtos from './PlayerSettings'

const {
    userGuideDisplays: defaultUserGuideDisplays,
    customFields: defaultCustomFields,
    settings: defaultSettings,
} = defaultPlayerData

class PlayerDataLocalDtos {
    private data: IPlayerData

    constructor(data: TObject) {
        const { settings, score, customFields, userGuideDisplays: UGD } = data

        const correctScore = GameCore.Utils.Valid.isNumber(score) && score > 0 ? score : 0
        const correctUGD = GameCore.Utils.Valid.isNumber(UGD) ? UGD : defaultUserGuideDisplays
        const correctCTF = GameCore.Utils.Valid.isObject(customFields)
            ? customFields
            : defaultCustomFields

        let correctSettings = defaultSettings
        if (GameCore.Utils.Valid.isObject(settings)) {
            correctSettings = new PlayerSettingsDtos(settings).toObject()
        }

        this.data = {
            score: correctScore,
            userGuideDisplays: correctUGD,
            settings: correctSettings,
            customFields: correctCTF,
        }
    }

    toObject(): IPlayerData {
        return this.data
    }
}

export default PlayerDataLocalDtos
