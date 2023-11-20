import { getFileConfigDailyChallengeMode } from '@/game/gameplay/constants/DailyChallengeLevels'
import GAME_LEVELS, { iGameLevel } from '@/game/gameplay/constants/GameLevels'
import { getJourneyChallengeMode, getJourneyMatchLevel } from '@/modules/match/selectors/match'
import JourneyScene from '..'

export default class LevelManager {
    private scene: JourneyScene
    private currentLevel: number

    constructor(scene: JourneyScene) {
        this.scene = scene
        this.init()
    }

    private init(): void {
        const state = this.scene.storage.getState()
        const level = getJourneyMatchLevel(state)
        const correctLevel = level || 1

        this.currentLevel = correctLevel
    }

    public setLevel(level: number): void {
        this.currentLevel = level
    }

    public getLevel(): number {
        return this.currentLevel
    }

    public getLevelConfig(): iGameLevel {
        const state = this.scene.storage.getState()
        const isChallengeMode = getJourneyChallengeMode(state)

        if (isChallengeMode) {
            return getFileConfigDailyChallengeMode()
        }

        return GAME_LEVELS[this.currentLevel]
    }

    public getNextLevel(): number {
        return this.currentLevel + 1
    }

    public getNextLevelConfig(): iGameLevel {
        return GAME_LEVELS[this.currentLevel + 1]
    }

    public increaseLevel(): void {
        this.currentLevel++
    }
}
