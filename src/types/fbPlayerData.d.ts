interface FacebookPlayerData {
    score: number
    userGuideDisplays: number
    settings: IPlayerSetting
    gameData: FacebookPlayerGameData
}

interface FacebookPlayerGameData {
    coins: number
    diamond: number
    dailyRewarded: {
        lastRewarded: number
        logDays: boolean[]
    }
    dailyTasks: {
        startedTime: number
        logTasks: {
            [key: unknown]: TObject
            /* 'collect-diamonds': {
                diamond: number
                rewarded: boolean
            }
            'invite-friends': {
                friend: number
                rewarded: boolean
            }
            'pass-levels': {
                level: number
                rewarded: boolean
            }
            'reach-score': {
                score: number
                rewarded: boolean
            } */
        }
    }
    lastReceiveGift: number
}

type PlayerDataKeys = keyof FacebookPlayerData
type GameDataKeys = keyof FacebookPlayerGameData
