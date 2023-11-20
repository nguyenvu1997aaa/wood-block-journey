import DEPTH_OBJECTS from '@/game/constants/depth'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import JourneyScene from '..'

const { KEY, FRAME } = SPRITES.GAMEPLAY
const { KEY: KEY_32 } = SPRITES.GAMEPLAY_32

export default class CollectItem extends Phaser.GameObjects.Container {
    public scene: JourneyScene
    private imageGem: Phaser.GameObjects.Image
    private imageCheck: Phaser.GameObjects.Image
    private text: Phaser.GameObjects.BitmapText
    private particle: Phaser.GameObjects.Particles.ParticleEmitterManager
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter
    private currentPosition: IPosition
    private imageGlow: Phaser.GameObjects.Image
    private tweenGlow: Phaser.Tweens.Tween
    private imageGlowCrop: Phaser.GameObjects.Image
    private tweenCropMaskTopDown: Phaser.Tweens.Tween
    private tweenCropMaskDownBottom: Phaser.Tweens.Tween
    private imageStar: Phaser.GameObjects.Image
    private tweenShowStar: Phaser.Tweens.Tween
    private tweenHideStar: Phaser.Tweens.Tween
    private tweenShowMe: Phaser.Tweens.Tween

    constructor(scene: JourneyScene) {
        super(scene)

        this.scene = scene

        this.init()
    }

    private init(): void {
        this.createImageGem()
        this.createImageCheck()
        this.createText()
        this.createParticle()
        this.createEmitter()
        this.createGlow()
        this.createTweenGlow()
        this.createGlowCrop()
        this.createStar()
        this.createTweenStar()
        this.createTweenShowMe()
    }

    private createImageGem(): void {
        this.imageGem = this.scene.make.image({
            key: KEY_32,
        })

        this.imageGem.setWorldSize(22, 22)

        this.add(this.imageGem)

        Phaser.Display.Align.In.Center(this.imageGem, this, 0, -7)
    }

    private createImageCheck(): void {
        this.imageCheck = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_CHECK,
        })

        this.imageCheck.setWorldSize(22, 17)

        this.imageCheck.setVisible(false)

        this.add(this.imageCheck)

        Phaser.Display.Align.In.Center(this.imageCheck, this.imageGem)
    }

    private createText(): void {
        this.text = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(24),
            origin: { x: 0.5, y: 0.5 },
        })

        this.add(this.text)

        Phaser.Display.Align.In.Center(this.text, this.imageGem, 0, 19)
    }

    private createParticle(): void {
        this.particle = this.scene.add.particles(KEY).setDepth(DEPTH_OBJECTS.ON_TOP)
    }

    private createEmitter(): void {
        const scale = 1.5 / this.scene.world.getPixelRatio()

        this.emitter = this.particle.createEmitter({
            on: false,
            angle: { start: 0, end: 360, steps: 8 },
            frame: [FRAME.DUST],
            lifespan: 1000,
            // maxParticles: 8,
            quantity: 1,
            scale: { start: scale, end: 0, ease: 'Quart.easeIn' },
            speed: 50,
        })
    }

    private createGlow(): void {
        this.imageGlow = this.scene.make.image({
            key: KEY,
            frame: FRAME.VIOLET_GLOW,
        })

        this.imageGlow.setVisible(false).setScale(0).setAlpha(0)

        this.add(this.imageGlow)

        Phaser.Display.Align.In.Center(this.imageGlow, this.imageGem)
    }

    private createTweenGlow(): void {
        this.tweenGlow = this.scene.tweens.add({
            targets: [this.imageGlow],
            paused: true,
            scale: {
                from: 0,
                to: 0.6,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            delay: 100,
            duration: 600,
            onComplete: () => {
                this.imageGlow.setVisible(false).setScale(0).setAlpha(0)

                this.playAnimMaskCrop()

                this.playAnimStar()
            },
        })
    }

    private createGlowCrop(): void {
        this.imageGlowCrop = this.scene.make.image({
            key: KEY,
            frame: FRAME.MASK,
        })

        this.imageGlowCrop.setVisible(false)

        this.imageGlowCrop.setWorldSize(this.imageGem.displayWidth, this.imageGem.displayHeight)

        this.add(this.imageGlowCrop)

        Phaser.Display.Align.In.Center(this.imageGlowCrop, this.imageGem)
    }

    private createStar(): void {
        this.imageStar = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_STAR_1,
        })

        this.imageStar.setVisible(false).setScale(0).setAlpha(0)

        this.imageStar.setWorldSize(27, 26)

        this.add(this.imageStar)

        Phaser.Display.Align.In.Center(this.imageStar, this.imageGem, -10, -10)
    }

    private createTweenStar(): void {
        this.tweenHideStar = this.scene.add.tween({
            paused: true,
            targets: [this.imageStar],
            scale: {
                from: 1,
                to: 0,
            },
            alpha: {
                from: 1,
                to: 0,
            },
            delay: 100,
            duration: 500,
            onComplete: () => {
                this.imageStar.setVisible(false).setScale(0).setAlpha(0)
            },
        })

        this.tweenShowStar = this.scene.add.tween({
            paused: true,
            targets: [this.imageStar],
            scale: {
                from: 0,
                to: 1,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            delay: 100,
            duration: 500,
            onComplete: () => {
                this.tweenHideStar.play()
            },
        })
    }

    private createTweenShowMe(): void {
        this.tweenShowMe = this.scene.add.tween({
            paused: true,
            targets: [this],
            alpha: {
                from: 0,
                to: 1,
            },
            duration: 200,
        })
    }

    private cropTopDownImageGlow(): void {
        if (!this.tweenCropMaskTopDown) {
            const imageHeight = this.imageGlowCrop.displayHeight
            const imageWidth = this.imageGlowCrop.displayWidth
            const scaleX = this.imageGlowCrop.scaleX
            const scaleY = this.imageGlowCrop.scaleY

            this.tweenCropMaskTopDown = this.scene.tweens.addCounter({
                from: 0,
                to: 1,
                delay: 200,
                duration: 300,
                paused: true,
                onUpdate: (tween) => {
                    const value = tween.getValue(0)
                    const height = value * imageHeight

                    this.imageGlowCrop.setCrop(0, 0, imageWidth / scaleX, height / scaleY)
                },
                onComplete: () => {
                    this.cropDownBottomImageGlow()
                },
            })
        }

        this.tweenCropMaskTopDown.play()
    }

    private cropDownBottomImageGlow(): void {
        if (!this.tweenCropMaskDownBottom) {
            const imageHeight = this.imageGlowCrop.displayHeight
            const imageWidth = this.imageGlowCrop.displayWidth
            const scaleX = this.imageGlowCrop.scaleX
            const scaleY = this.imageGlowCrop.scaleY

            this.tweenCropMaskDownBottom = this.scene.tweens.addCounter({
                from: 0,
                to: 1,
                delay: 200,
                duration: 300,
                paused: true,
                onUpdate: (tween) => {
                    const value = tween.getValue(0)
                    const y = value * imageHeight

                    this.imageGlowCrop.setCrop(
                        0,
                        y / scaleY,
                        imageWidth / scaleX,
                        imageHeight / scaleY
                    )
                },
            })
        }

        this.tweenCropMaskDownBottom.play()
    }

    private playAnimStar(): void {
        this.imageStar.setVisible(true)

        this.tweenShowStar.play()
    }

    private playAnimMaskCrop(): void {
        this.imageGlowCrop.setVisible(true).setCrop(0, 0, 0, 0)
        this.cropTopDownImageGlow()
    }

    public setFrame(frame: string): void {
        this.imageGem.setFrame(frame)
    }

    public getFrame(): string {
        return this.imageGem.frame.name
    }

    public setText(amount: number, target: number): void {
        this.text.setText(`${amount} / ${target}`)
    }

    public completeMission(): void {
        this.imageGem.setAlpha(0.3)
        this.text.setAlpha(0.3)
        this.imageCheck.setVisible(true)
    }

    public reset(): void {
        this.imageGem.setAlpha(1)
        this.text.setAlpha(1)
        this.imageCheck.setVisible(false)
    }

    public updateCurrentPosition(position: IPosition): void {
        this.currentPosition = position
    }

    public runAnimCollectionItem(): void {
        const { header } = this.scene.layoutManager.objects
        const center = this.scene.gameZone.width / 2

        let pX = center + this.currentPosition.x
        let pY = this.currentPosition.y - 25

        if (this.scene.world.isLandscape()) {
            pX = header.collectItems.getWorldPosition().x
            pY = header.collectItems.getWorldPosition().y + this.currentPosition.y
        }

        this.tweenGlow.play()

        this.emitter.explode(8, pX, pY)
    }

    public playAnimShowMe(): void {
        this.setVisible(true).setAlpha(0)

        this.tweenShowMe.play()
    }
}
