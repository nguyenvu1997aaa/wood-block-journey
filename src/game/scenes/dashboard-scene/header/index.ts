import Leaf from './Leaf'

class HeaderBar extends Phaser.GameObjects.Container {
    private leaf: Leaf

    constructor(scene: Phaser.Scene) {
        super(scene)

        // this.createLeaf()

        this.scene.add.existing(this)
    }

    private createLeaf(): void {
        this.leaf = new Leaf(this.scene)

        this.add(this.leaf)

        Phaser.Display.Align.In.Center(this.leaf, this, 0, this.leaf.displayHeight / 2)
    }
}

export default HeaderBar
