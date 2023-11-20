const { Gameplay, Match } = GameCore.Configs
const { Levels } = Match

export default class LevelManager {
    private levelIndex = 0
    private levels: number[] = Levels

    public recentLevel: number

    public increaseLevel(): void {
        this.levelIndex++
    }

    public getCurrentTargetScore() {
        return this.levels[this.levelIndex]
    }

    public getNextTargetScoreLevel() {
        return this.levels[this.levelIndex + 1]
    }

    public getCurrentIndex(): number {
        return this.levelIndex
    }

    public updateCurrentLevelByScore(score: number): number {
        const index = this.levels.findIndex((item) => {
            return item > score
        })

        if (index === -1) {
            return this.handleAutoGrantNewLevel(score)
        }

        this.levelIndex = index

        const recentLevel = this.levels[index - 1]

        if (recentLevel) {
            this.recentLevel = recentLevel
        }

        return this.levels[index]
    }

    public restart() {
        this.levelIndex = 0
        this.recentLevel = 0
    }

    private handleAutoGrantNewLevel(score: number): number {
        const { BonusScore } = Gameplay.Progress
        const lastLevel = this.levels[this.levels.length - 1]
        const targetScore = lastLevel + BonusScore

        this.levels.push(targetScore)

        if (targetScore <= score) {
            return this.handleAutoGrantNewLevel(score)
        }

        this.levelIndex = this.levels.length - 1
        this.recentLevel = this.levels[this.levelIndex]

        return targetScore
    }
}
