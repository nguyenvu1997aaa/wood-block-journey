type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
}
interface IPhaserInspectorUserConfig {
    scene: Phaser.Scene
    isCreateAllFirst: boolean
    css: {
        alpha: number
        right: number
        top: number
    }
    init: {
        focus: Phaser.GameObjects.GameObject
        ignore: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject
        side: boolean
    }
}
interface IPhaserInspector {
    show: (scene: Phaser.Scene, config?: DeepPartial<IPhaserInspectorUserConfig>) => void
    init(game: Phaser, folder: any): Promise<void>
}
