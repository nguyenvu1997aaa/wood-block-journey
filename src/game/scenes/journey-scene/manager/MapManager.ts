import { getJourneyMatchLevel } from '@/modules/match/selectors/match'
import JourneyScene from '..'

export default class MapManager {
    private scene: JourneyScene
    private map: Phaser.Tilemaps.Tilemap

    constructor(scene: JourneyScene) {
        this.scene = scene
        this.init()
    }

    private init(): void {
        this.initMap()
    }

    private initMap(): void {
        const levelConfig = this.scene.levelManager.getLevelConfig()

        this.map = this.scene.make.tilemap({
            key: levelConfig.key,
        })
    }

    public getTileMap(): Phaser.Tilemaps.Tilemap {
        return this.map
    }

    public reloadMap(): void {
        const state = this.scene.storage.getState()
        const level = getJourneyMatchLevel(state)
        if (level === 0) this.scene.levelManager.setLevel(1)

        const levelConfig = this.scene.levelManager.getLevelConfig()

        console.log('reloadMap === ', levelConfig)

        this.map?.destroy()
        this.map = this.scene.make.tilemap({
            key: levelConfig.key,
        })
    }
}
