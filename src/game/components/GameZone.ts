class GameZone extends Phaser.GameObjects.Zone {
    constructor(scene: Phaser.Scene, width: number, height: number) {
        super(scene, 0, 0, width, height)

        this.setOrigin(0, 0)
    }
}

export default GameZone
