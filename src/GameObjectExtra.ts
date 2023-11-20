class GameObjectExtra {
    private game: Phaser.Game

    constructor(game: Phaser.Game) {
        this.game = game
    }

    public addKillRevive(): void {
        [
            Phaser.GameObjects.Container,
            Phaser.GameObjects.Image,
            Phaser.GameObjects.Sprite,
            Phaser.GameObjects.Graphics,
            Phaser.GameObjects.Text,
            Phaser.GameObjects.BitmapText,
            Phaser.GameObjects.Particles.ParticleEmitter,
            Phaser.GameObjects.Particles.ParticleEmitterManager,
        ].forEach((object) => {
            object.prototype.kill = this.kill
            object.prototype.revive = this.revive
        })
    }

    public addKillReviveGroup(): void {
        Phaser.GameObjects.Group.prototype.killGroup = this.killGroup
        Phaser.GameObjects.Group.prototype.reviveGroup = this.reviveGroup
    }

    public addSetWorldSize(): void {
        [Phaser.GameObjects.Image, Phaser.GameObjects.Sprite].forEach((object) => {
            object.prototype.setWorldSize = this.setWorldSize
        })
    }

    public addSetWorldSizeForContainer(): void {
        [Phaser.GameObjects.Container].forEach((object) => {
            object.prototype.setWorldSize = this.setWorldSizeForContainer
        })
    }

    public addGetWorldPosition(): void {
        [
            Phaser.GameObjects.Container,
            Phaser.GameObjects.Image,
            Phaser.GameObjects.Sprite,
            Phaser.GameObjects.Graphics,
            Phaser.GameObjects.Text,
            Phaser.GameObjects.BitmapText,
        ].forEach((object) => {
            object.prototype.getWorldPosition = this.getWorldPosition
        })
    }

    public addDrawDebugBox(): void {
        [
            Phaser.GameObjects.Container,
            Phaser.GameObjects.Image,
            Phaser.GameObjects.Sprite,
            Phaser.GameObjects.Graphics,
            Phaser.GameObjects.Text,
            Phaser.GameObjects.BitmapText,
            Phaser.GameObjects.Zone,
        ].forEach((object) => {
            object.prototype.drawDebugBox = this.drawDebugBox
        })
    }

    public addHighQuality(): void {
        [Phaser.GameObjects.Text].forEach((object) => {
            object.prototype.setHighQuality = this.setHighQuality
        })
    }

    public addSetLineHeightForBitmapText(): void {
        Phaser.GameObjects.BitmapText.prototype.setLineHeight = function (
            this: Phaser.GameObjects.BitmapText,
            lineHeight: number
        ) {
            this.lineHeight = lineHeight
            this.updateDisplayOrigin()
        }
    }

    private kill(this: Phaser.GameObjects.GameObject): void {
        this.setActive(false)
        this.setVisible(false)
    }

    private revive(this: Phaser.GameObjects.GameObject): void {
        this.setActive(true)
        this.setVisible(true)
    }

    private killGroup(this: Phaser.GameObjects.Group): void {
        this.getChildren().forEach((child: Phaser.GameObjects.GameObject) => {
            child.setActive(false)
            child.setVisible(false)
        })
    }

    private reviveGroup(this: Phaser.GameObjects.Group): void {
        this.getChildren().forEach((child: Phaser.GameObjects.GameObject) => {
            child.setActive(true)
            child.setVisible(true)
        })
    }

    private setWorldSize(this: Phaser.GameObjects.GameObject, width: number, height: number): void {
        this.setSize(width, height)
        this.setDisplaySize(width, height)
    }

    private setWorldSizeForContainer(
        this: Phaser.GameObjects.GameObject,
        width: number,
        height: number,
        dpr = 2
    ): void {
        this.setSize(width * dpr, height * dpr)
        this.setDisplaySize(width, height)
    }

    private getWorldPosition(this: Phaser.GameObjects.GameObject): TPosition {
        const target = this.getWorldTransformMatrix()
        const { translateX, translateY } = target.decomposeMatrix() as TTransformMatrix
        return { x: translateX, y: translateY }
    }

    private drawDebugBox(
        this: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Origin,
        color: number,
        alpha: number
    ): Phaser.GameObjects.Rectangle {
        const { x, y, width, height, depth, originX, originY } = this

        const debugBox = this.scene.add.rectangle(x, y, width, height, color, alpha)

        debugBox.setName('Debug Box')
        debugBox.setDepth(depth)

        const { isNumber } = GameCore.Utils.Valid
        if (isNumber(originX) && isNumber(originY)) {
            debugBox.setOrigin(originX, originY)
        }

        return debugBox
    }

    private setHighQuality(this: Phaser.GameObjects.Text): Phaser.GameObjects.Text {
        // ? setResolution is't working on canvas
        if (!(this.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer)) return this

        return this.setResolution(this.scene.game.world.getZoomRatio() * 2)
    }
}

export default GameObjectExtra
