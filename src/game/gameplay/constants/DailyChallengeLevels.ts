import { iGameLevel } from './GameLevels'

const DAILY_CHALLENGE_LEVELS = [
    {
        key: 'daily-level-0',
        mapJson: './assets/json/daily-levels/level-0.json',
    },
    // ? Alway start with index 1 (level 1)
]

for (let i = 1; i <= 57; i++) {
    DAILY_CHALLENGE_LEVELS.push({
        key: `daily-level-${i}`,
        mapJson: `./assets/json/daily-levels/level-${i}.json`,
    })
}

export const getLevelConfigDailyChallengeMode = (): number => {
    const startDay = new Date('01/01/2022')
    const today = new Date()
    const differenceInTime = today.getTime() - startDay.getTime()
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24))
    return differenceInDays % DAILY_CHALLENGE_LEVELS.length
}

export const getFileConfigDailyChallengeMode = (): iGameLevel => {
    const index = getLevelConfigDailyChallengeMode()

    return DAILY_CHALLENGE_LEVELS[index]
}

export default DAILY_CHALLENGE_LEVELS
