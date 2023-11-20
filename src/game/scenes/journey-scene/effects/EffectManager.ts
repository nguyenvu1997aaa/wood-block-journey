import JourneyScene from '..'
import StreakBreak from './StreakBreak'

export default class EffectManager {
    public scene: JourneyScene
    public streakBreak: StreakBreak

    constructor(scene: JourneyScene) {
        this.scene = scene
    }

    public init(): void {
        this.streakBreak = new StreakBreak(this.scene)
    }
}
