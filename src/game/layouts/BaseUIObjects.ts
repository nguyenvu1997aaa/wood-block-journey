abstract class BaseUIObjects {
    public scene: Phaser.Scene
    protected group: Phaser.GameObjects.Group

    constructor(scene: Phaser.Scene) {
        this.scene = scene

        this.createGroup()
        this.createObjects()
    }

    public getAll(): Phaser.GameObjects.GameObject[] {
        return this.group.getChildren()
    }

    private createGroup(): void {
        this.group = this.scene.add.group()
    }

    protected abstract createObjects(): void
}

export default BaseUIObjects
