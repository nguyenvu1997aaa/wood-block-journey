import GameScene from '..'
import StreakBreak from './StreakBreak'

export default class EffectManager {
    public scene: GameScene
    public streakBreak: StreakBreak

    constructor(scene: GameScene) {
        this.scene = scene
    }

    public init(): void {
        this.streakBreak = new StreakBreak(this.scene)
    }
}
