import JourneyScene from '..'
import ScaleUpAnimation from '@/game/animations/basic/ScaleUp'
import ScaleDownAnimation from '@/game/animations/basic/ScaleDown'
import DEPTH_OBJECTS from '@/game/constants/depth'

export default class ItemCollectionEffect {
    public scene: JourneyScene
    private tweenScaleUp: ScaleUpAnimation
    private tweenScaleDown: ScaleDownAnimation
    public tweenMoveTo: Phaser.Tweens.Tween
    public target: Phaser.GameObjects.Image
    public handleOnComplete: Function
    public playing: boolean
    public path: Phaser.Curves.Path

    constructor(scene: JourneyScene) {
        this.scene = scene

        this.path = new Phaser.Curves.Path()
    }

    public runScaleUpAnimation(delay: number, duration: number): void {
        this.tweenScaleUp?.remove()

        if (!this.tweenScaleUp) {
            this.tweenScaleUp = new ScaleUpAnimation({
                targets: [this.target],
                delay,
                duration,
                props: {
                    scale: '+=0.05',
                },
            })
        }

        this.tweenScaleUp.play()
    }

    public runScaleDownAnimation(delay: number, duration: number): void {
        this.tweenScaleDown?.remove()

        if (!this.tweenScaleDown) {
            this.tweenScaleDown = new ScaleDownAnimation({
                targets: [this.target],
                delay,
                duration,
                props: {
                    scale: '-=0.15',
                },
            })
        }

        this.tweenScaleDown.play()
    }

    public runAnimMoveToPosition(delay: number, duration: number, pX: number, pY: number): void {
        this.playing = true

        const { x: startX, y: startY } = this.target.getWorldPosition()

        this.path.startPoint = new Phaser.Math.Vector2(startX, startY)

        const spaceX = Math.abs(pX - startX) / 2
        const spaceY = Math.abs(pY - startY)

        const randomX = Phaser.Math.Between(1, 2)

        const splinePoint = []
        for (let i = 1; i < 4; i++) {
            let x = -1
            if (i % 2 == 0) {
                x = 1
            }

            const controlX = Phaser.Math.Between(spaceX / 4, spaceX / 3)
            const vectorX = (spaceX - x * controlX) * randomX
            const vectorY = startY - i * (spaceY / 4)

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

        const centerWidth = this.scene.gameZone.width / 2

        const spaceX = Math.abs(pX - startX) + centerWidth - 50
        const spaceY = Math.abs(pY - startY)

        const fixedX = 1.5

        const splinePoint = []
        for (let i = 1; i < 4; i++) {
            let x = -1
            if (i % 2 == 0) {
                x = 1
            }

            const controlX = Phaser.Math.Between(spaceX / 8, spaceX / 7)
            const vectorX = (spaceX - x * controlX) * fixedX
            const vectorY = startY - i * (spaceY / 4)

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

    public set onComplete(onComplete: Function) {
        this.handleOnComplete = onComplete
    }

    public setTarget(target: Phaser.GameObjects.Image): void {
        this.target = target
    }

    public get isPlaying(): boolean {
        return this.playing
    }
}
