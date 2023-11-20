import { defaultSettings } from './DefaultSettings'

const defaultPlayerData: IPlayerData = {
    score: 0,
    settings: { ...defaultSettings },
    userGuideDisplays: 0,
    customFields: {
        diamond: 300,
        lastReceiveGift: 0,
    },
}

export default defaultPlayerData
