import BaseUIObjects from './BaseUIObjects'

abstract class BaseLayout {
    public scene: Phaser.Scene
    protected objects: BaseUIObjects | null

    public allUI: Phaser.GameObjects.Group
    public groups: { [key: string]: Phaser.GameObjects.Group }

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.objects = null

        this.createGroups()
    }

    public setUIObjects(objects: BaseUIObjects): void {
        this.objects = objects

        this.allUI.addMultiple(this.objects.getAll())
    }

    public abstract alignUI(): void

    protected createGroups(): void {
        this.groups = {}

        this.allUI = this.scene.add.group()

        this.groups.allUI = this.allUI
    }

    public killAllUI(): void {
        this.allUI.killGroup()
    }

    public reviveAllUI(): void {
        this.allUI.reviveGroup()
    }
}

export default BaseLayout
