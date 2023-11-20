import DEPTH_OBJECTS from '@/game/constants/depth'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import {
    MATCH_MODE_CHALLENGE_FRIENDS,
    MATCH_MODE_MATCHING_GROUP,
    MATCH_MODE_SINGLE,
    MATCH_MODE_TOURNAMENTS,
} from '@/modules/match/constants/GameModes'
import { getGameplayMode } from '@/modules/match/selectors/gameplay'
import vibrate from '@/utils/vibrate'
import { EXPLODE_BY_LEVEL, FRAMES_BY_LEVEL } from '../constant/piece'
import { TARGET_SCORE } from '../constant/target'
import GameScene from '../JourneyScene'

const { Gameplay } = GameCore.Configs
const { VibrateValue } = Gameplay
const { KEY, FRAME } = SPRITES.EFFECTS

export default class Praise extends Phaser.GameObjects.Container {
    public scene: GameScene
    public listScore: number[] = []
    private score: number
    private startX: number
    private startY: number
    private scoreText: Phaser.GameObjects.BitmapText
    public tweenShowScoreText: Phaser.Tweens.Tween
    public tweenHideScoreText: Phaser.Tweens.Tween
    private tweenShowPraiseFrame: Phaser.Tweens.Tween
    private tweenHidePraiseFrame: Phaser.Tweens.Tween
    private praiseFrame: Phaser.GameObjects.Image
    private praiseScoreText: Phaser.GameObjects.BitmapText
    private particle: Phaser.GameObjects.Particles.ParticleEmitterManager
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        scene.add.existing(this)

        this.setVisible(false).setAlpha(0)

        this.init()
    }

    init() {
        this.createScoreText()

        this.createTweenScoreText()

        this.createPraiseFrame()

        this.createPraiseScoreText()

        this.createParticle()

        this.createEmitter()
    }

    createParticle() {
        this.particle = this.scene.add.particles(KEY)
        this.particle.setDepth(DEPTH_OBJECTS.ON_TOP + 1)
    }

    createEmitter() {
        this.emitter = this.particle.createEmitter({
            x: 0,
            y: 0,
            scale: {
                start: 0.05,
                end: 0.2,
            },
            speed: { min: 20, max: 70 },
            lifespan: { min: 500, max: 1000 },
            quantity: 20,
            on: false,
            tint: [0xfadf04, 0xfa9703],
            frame: FRAME.FX_STAR,
            delay: 350,
        })
    }

    createScoreText() {
        this.scoreText = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(50),
            text: `+0`,
            origin: { x: 0.5, y: 0.5 },
        })

        this.scoreText.setScale(0).setAlpha(0)
        this.scoreText.setDepth(DEPTH_OBJECTS.ON_TOP)
        this.scoreText.setVisible(false)
    }

    createTweenScoreText() {
        const state = this.scene.storage.getState()
        const gamePlayMode = getGameplayMode(state)
        let x = this.scene.gameZone.width / 2
        const y = 65

        if (
            [
                MATCH_MODE_MATCHING_GROUP,
                MATCH_MODE_CHALLENGE_FRIENDS,
                MATCH_MODE_TOURNAMENTS,
            ].indexOf(gamePlayMode) >= 0
        ) {
            x = 105
        }

        this.tweenShowScoreText = this.scene.tweens.add({
            paused: true,
            targets: this.scoreText,
            scale: {
                from: 0,
                to: 1,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            duration: 300,
            onComplete: () => {
                this.tweenHideScoreText = this.scene.tweens.add({
                    targets: this.scoreText,
                    scale: {
                        from: 1,
                        to: 0.5,
                    },
                    alpha: {
                        from: 1,
                        to: 0.5,
                    },
                    x,
                    y,
                    delay: 1000,
                    duration: 300,
                    onComplete: () => {
                        this.scoreText.setVisible(false)
                        this.scoreText.setAlpha(0)
                        this.scoreText.setScale(0)

                        this.scene.handleAddScoreAnim(this.score || 0)
                    },
                })
            },
        })
    }

    playAnimShowScoreText() {
        if (this.tweenHideScoreText && this.tweenHideScoreText.isPlaying()) {
            this.tweenHideScoreText.stop()
            this.scoreText.setPosition(this.startX, this.startY)

            const state = this.scene.storage.getState()
            const mode = getGameplayMode(state)
            let currentScore = 0

            if (mode === MATCH_MODE_SINGLE) {
                const { header } = this.scene.layoutManager.objects
                currentScore = header.mainScoreBlock.score

                header.mainScoreBlock.setScore(currentScore + (this.score || 0))
                header.mainScoreBlock.setScoreText(currentScore + (this.score || 0))
            }
        }

        this.score = this.listScore.shift() || 0

        this.scene.handleUpdateScore(this.score)

        this.scoreText.setScale(0).setAlpha(0).setVisible(true)

        this.tweenShowScoreText.play()
    }

    createPraiseFrame() {
        this.praiseFrame = this.scene.make.image({
            x: 0,
            y: 0,
            key: KEY,
        })

        this.praiseFrame.setScale(0)
        this.praiseFrame.setAlpha(0)
        this.praiseFrame.setDepth(DEPTH_OBJECTS.ON_TOP)
        this.praiseFrame.setVisible(false)
    }

    createTweenPraiseFrame() {
        if (this.tweenShowPraiseFrame && this.tweenHidePraiseFrame) return

        const scale = this.praiseFrame.scale

        this.tweenShowPraiseFrame = this.scene.tweens.add({
            paused: true,
            targets: this.praiseFrame,
            scale: {
                from: 0,
                to: scale,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            duration: 300,
            delay: 100,
            ease: Phaser.Math.Easing.Back.Out,
            onComplete: () => {
                this.tweenHidePraiseFrame.play()
            },
        })

        this.tweenHidePraiseFrame = this.scene.tweens.add({
            paused: true,
            targets: this.praiseFrame,
            scale: {
                from: scale,
                to: 0,
            },
            alpha: {
                from: 1,
                to: 0,
            },
            duration: 300,
            delay: 1000,
            onComplete: () => {
                this.praiseFrame.setScale(0)
                this.praiseFrame.setAlpha(0)
                this.praiseFrame.setVisible(false)
            },
        })
    }

    playAnimShowPraiseFrame() {
        this.createTweenPraiseFrame()

        if (this.tweenShowPraiseFrame.isPlaying() || this.tweenHidePraiseFrame.isPlaying()) {
            this.tweenShowPraiseFrame.resetTweenData(false)
            this.tweenHidePraiseFrame.resetTweenData(false)
        }

        this.praiseFrame.setScale(0).setAlpha(0).setVisible(true)

        this.tweenShowPraiseFrame.play()
    }

    createPraiseScoreText() {
        this.praiseScoreText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(30),
            origin: { x: 0.5, y: 0.5 },
        })

        this.praiseScoreText.setDepth(DEPTH_OBJECTS.ON_TOP)

        this.add(this.praiseScoreText)

        Phaser.Display.Align.In.Center(this.praiseScoreText, this, 0, 20)
    }

    handlePraise(x: number, y: number, score: number, level: number) {
        this.startX = x
        this.startY = y + 15

        this.listScore.push(score)

        let xScoreText = x - 10
        const showScoreText = this.scene.targetMissionManager.getTargetType() === TARGET_SCORE

        this.scoreText.setPosition(xScoreText, y + 15)
        this.scoreText.setText(`+${score}`)
        this.scoreText.setVisible(showScoreText)

        if (xScoreText - this.scoreText.fontSize / 2 < 0) {
            xScoreText = xScoreText + this.scoreText.fontSize / 2

            this.scoreText.setPosition(xScoreText, y + 15)
        }

        if (showScoreText) {
            this.playAnimShowScoreText()

            this.handlePraiseFrameText(x, y, level)
        }

        const vibratePatterns = this.getVibrateByLevel(level)

        if (this.scene.player.getPlayerSettings().vibrate) {
            vibrate(vibratePatterns)
        }

        if (level <= 1) return

        this.changeExplode(xScoreText, y, level)
    }

    getVibrateByLevel(level: number) {
        return VibrateValue[level] || 0
    }

    changeExplode(x: number, y: number, level: number) {
        const explode = this.getExplodeByLevel(level)
        if (explode) {
            this.emitter.setScale({
                start: 0.05 * explode.scale,
                end: 0.2 * explode.scale,
            })

            this.emitter.setSpeed({
                min: 30 * explode.speed,
                max: 80 * explode.speed,
            })

            this.emitter.setQuantity(20 * explode.quantity)
        }

        this.emitter.explode(20 * explode.quantity, x, y)
    }

    handlePraiseFrameText(x: number, y: number, level: number) {
        const imageScale = this.scene.world.getPixelRatio()

        const frameText = this.getMainFrameByLevel(level)

        if (!frameText) return

        const bonusHeight =
            this.scene.targetMissionManager.getTargetType() === TARGET_SCORE ? -40 : 0

        switch (frameText) {
            case FRAME.TEXT_COOL:
                break

            case FRAME.TEXT_GOOD:
                break

            case FRAME.TEXT_EXCELLENT:
                break
        }

        this.praiseFrame.setFrame(frameText)

        const { width: widthFrame, height: heightFrame } = this.praiseFrame

        const width = widthFrame / imageScale
        const height = heightFrame / imageScale

        this.praiseFrame.setWorldSize(width, height)

        const { displayWidth } = this.praiseFrame
        let positionX = x
        const { width: widthScene } = this.scene.gameZone

        if (x - displayWidth / 2 < 0) {
            positionX = displayWidth / 2 + 5
        } else if (x + displayWidth / 2 > widthScene) {
            positionX = widthScene - displayWidth / 2 - 5
        } else {
            positionX = x
        }

        this.praiseFrame.setPosition(positionX, y + bonusHeight)

        this.playAnimShowPraiseFrame()
    }

    getExplodeByLevel(level: number) {
        const list = EXPLODE_BY_LEVEL[level - 1] || EXPLODE_BY_LEVEL[0]
        return list || null
    }

    getMainFrameByLevel(level: number) {
        const listFrames = FRAMES_BY_LEVEL[level - 1] || FRAMES_BY_LEVEL[0]
        return Phaser.Utils.Array.GetRandom(listFrames.frames)
    }

    public reset(): void {
        this.createTweenScoreText()
    }
}
