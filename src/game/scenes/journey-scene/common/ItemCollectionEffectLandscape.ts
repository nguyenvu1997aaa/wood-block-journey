import DEPTH_OBJECTS from '@/game/constants/depth'
import JourneyScene from '..'
import ItemCollectionEffect from './ItemCollectionEffect'

export default class ItemCollectionEffectLandscape extends ItemCollectionEffect {
    constructor(scene: JourneyScene) {
        super(scene)
    }

    public runAnimMoveToPosition(delay: number, duration: number, pX: number, pY: number): void {
        this.playing = true

        const { x: startX, y: startY } = this.target.getWorldPosition()

        this.path.startPoint = new Phaser.Math.Vector2(startX, startY)

        const centerHeight = this.scene.gameZone.height / 2

        const spaceX = Math.abs(pX - startX)
        const spaceY = Math.abs(pY - startY) + centerHeight - 50

        const fixedY = 1.5

        const splinePoint = []
        for (let i = 1; i < 4; i++) {
            let y = -1
            if (i % 2 == 0) {
                y = 1
            }

            const controlY = Phaser.Math.Between(spaceY / 18, spaceY / 17)
            const vectorX = startX - i * (spaceX / 4)
            const vectorY = (spaceY - y * controlY) * fixedY

            splinePoint.push(new Phaser.Math.Vector2(vectorX, vectorY))
        }

        splinePoint.push(new Phaser.Math.Vector2(pX, pY))

        this.path.splineTo(splinePoint)
        this.path.lineTo(pX, pY)

        const curve = new Phaser.Curves.Spline(splinePoint)

        // const graphics = this.scene.add.graphics()
        // graphics.clear()
        // graphics.lineStyle(1, 0xffffff, 1)

        // curve.draw(graphics, 64)

        const x = this.target.x
        const y = this.target.y

        this.tweenMoveTo = this.scene.add.tween({
            delay,
            targets: this.path,
            t: {
                from: 0,
                to: 1,
            },
            ease: 'Sine.easeInOut',
            duration,
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                const value = tween.getValue(0)
                const position = curve.getPoint(value)

                this.target.setPosition(position.x - startX - x, position.y - startY - y)
            },
            onComplete: () => {
                this.playing = false

                if (this.handleOnComplete) {
                    this.handleOnComplete()
                }
            },
        })
    }

    public runGemMoveToPosition(
        delay: number,
        duration: number,
        pX: number,
        pY: number
    ): Phaser.Tweens.Tween {
        this.playing = true
        this.target.setDepth(DEPTH_OBJECTS.ON_TOP)

        const startX = this.target.x
        const startY = this.target.y

        this.path.startPoint = new Phaser.Math.Vector2(startX, startY)

        const centerHeight = this.scene.gameZone.height / 2

        const spaceX = Math.abs(pX - startX)
        const spaceY = Math.abs(pY - startY) + centerHeight - 50

        const fixedY = 1.5

        const splinePoint = []
        for (let i = 1; i < 4; i++) {
            let y = -1
            if (i % 2 == 0) {
                y = 1
            }

            const controlY = Phaser.Math.Between(spaceY / 18, spaceY / 17)
            const vectorX = startX - i * (spaceX / 4)
            const vectorY = (spaceY - y * controlY) * fixedY

            splinePoint.push(new Phaser.Math.Vector2(vectorX, vectorY))
        }

        splinePoint.push(new Phaser.Math.Vector2(pX, pY))

        this.path.splineTo(splinePoint)
        this.path.lineTo(pX, pY)

        const curve = new Phaser.Curves.Spline(splinePoint)

        // const graphics = this.scene.add.graphics()
        // graphics.clear()
        // graphics.lineStyle(1, 0xffffff, 1)

        // curve.draw(graphics, 64)

        this.tweenMoveTo = this.scene.add.tween({
            delay,
            targets: this.path,
            t: {
                from: 0,
                to: 1,
            },
            ease: 'Sine.easeInOut',
            duration,
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                const value = tween.getValue(0)
                const alpha = 1 - value + 0.1
                const position = curve.getPoint(value)

                this.target.setAlpha(alpha)
                this.target.setPosition(position.x, position.y)
            },
            onComplete: () => {
                this.playing = false

                if (this.handleOnComplete) {
                    this.handleOnComplete()
                }
            },
        })

        return this.tweenMoveTo
    }
}
