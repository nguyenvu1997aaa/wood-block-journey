class Header extends Phaser.GameObjects.Container {
    public scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.scene = scene

        this.scene.add.existing(this)
    }
}

export default Header
