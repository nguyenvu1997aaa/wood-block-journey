interface IPlayers {
    [key: string]: TPlayer
}

type TPlayer = {
    playerId: string
    name: string
    photo: string
    locale: string
}

interface IPlayerData extends TObject {
    score: number
    settings: IPlayerSetting
    customFields?: TObject
    userGuideDisplays: number
}

interface IPlayerSetting extends TObject {
    sound: boolean
    music: boolean
    vibrate: boolean
    language: string
    theme: string
}

interface IPlayerState {
    ASID: string
    playerId: string
    name: string
    photo: string
    locale: string
    connectedPlayers: IPlayers
    data: IPlayerData
    isUserNew: boolean
}
