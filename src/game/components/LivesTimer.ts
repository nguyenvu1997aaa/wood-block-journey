import {
    getCountDownStartAt,
    getLastBonusLifeTime,
    getLives,
} from '@/modules/lives/selectors/lives'
import { convertHMS } from '@/utils/DateTime'
import PulsateBubbleAnimation from '../animations/attention/PulsateBubble'
import FONTS from '../constants/resources/fonts'
import SPRITES from '../constants/resources/sprites'
import { ScreenKeys } from '../constants/screens'

const { KEY, FRAME } = SPRITES.DEFAULT
const { Lives } = GameCore.Configs

class LivesTimer extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Image
    private circle: Phaser.GameObjects.Image
    private icon: Phaser.GameObjects.Image
    private textLives: Phaser.GameObjects.Text
    private textTimer: Phaser.GameObjects.BitmapText
    private textFull: Phaser.GameObjects.Text

    private groupHeartBeat: Phaser.GameObjects.Container

    private heartBeat: PulsateBubbleAnimation
    private textLivesBeat: PulsateBubbleAnimation
    private iconBeat: PulsateBubbleAnimation

    private intervalTimer: NodeJS.Timer

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.scene.add.existing(this)

        this.createBackgroundLives()
        this.createTextLives()
        this.createTextTimer()
        this.createTextFull()
        this.createIconPlus()

        this.createHeartBeatAnimation()

        this.setSize(140, 27)

        this.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.screen.open(ScreenKeys.CLAIM_HEART_SCREEN)
        })
    }

    private createBackgroundLives(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.LIVES_TIME_BLOCK,
        })

        this.background.setWorldSize(111, 27)

        this.add(this.background)

        Phaser.Display.Align.In.Center(this.background, this)
    }

    public setFrameLivesTimeBlock2(): void {
        this.background.setFrame(FRAME.LIVES_TIME_BLOCK_2)
    }

    private createIconPlus(): void {
        this.icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_PLUS,
        })

        this.icon.setWorldSize(14, 14)

        this.add(this.icon)

        Phaser.Display.Align.In.Center(this.icon, this, -62, 11)
    }

    private createTextLives(): void {
        this.circle = this.scene.make.image({
            key: KEY,
            frame: FRAME.LIVES_HEART,
        })

        this.circle.setWorldSize(38, 31)

        this.add(this.circle)

        Phaser.Display.Align.In.Center(this.circle, this, -51, 0)

        const state = this.scene.storage.getState()
        const lives = getLives(state)

        this.textLives = this.scene.make.text({
            text: `${lives}`,
            style: {
                fontFamily: FONTS.FONT_FAMILY_ARIAL,
                fontSize: `${this.scene.fontSize(40)}px`,
                fontStyle: '700',
            },
            origin: { x: 0.5, y: 0.5 },
        })

        this.add(this.textLives)

        Phaser.Display.Align.In.Center(this.textLives, this.circle)
    }

    private createTextTimer(): void {
        this.textTimer = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(40),
            text: '00:00',
            origin: { x: 0.2, y: 0.5 },
        })

        this.add(this.textTimer)

        Phaser.Display.Align.In.Center(this.textTimer, this, 6, 2)
    }

    private createTextFull(): void {
        this.textFull = this.scene.make.text({
            text: this.scene.lang.Text.FULL,
            style: {
                fontFamily: FONTS.FONT_FAMILY,
                fontSize: `${this.scene.fontSize(40)}px`,
            },
            origin: { x: 0.5, y: 0.5 },
        })

        this.textFull.setTint(0xeed3b2)

        this.textFull.setVisible(false)

        this.add(this.textFull)

        Phaser.Display.Align.In.Center(this.textTimer, this, 6, 0)
    }

    private updateTextLives(): void {
        const state = this.scene.storage.getState()
        const lives = getLives(state)

        this.textLives.setText(lives)
    }

    public startIntervalTimer(): void {
        this.runHeartBeatAnimation()

        const bonusDurationMs = Lives.bonusDurationMins * 60 * 1000
        const lang = this.scene.lang

        this.intervalTimer = setInterval(() => {
            const state = this.scene.storage.getState()

            const lives = (getLives(state) as number) || 0

            if (lives === Lives.livesCapacity) {
                this.textTimer.setText(lang.Text.FULL)
                this.textLives.setText(String(Lives.livesCapacity))

                const locale = this.scene.facebook.getLocale()

                if (locale == 'ar') {
                    this.textTimer.setVisible(false)
                    this.textFull.setVisible(true)
                }

                return
            }

            let countDownStartAt = getCountDownStartAt(state)
            const lastBonusLifeTime = getLastBonusLifeTime(state)
            const currentTime = new Date().getTime()

            if (currentTime - lastBonusLifeTime < bonusDurationMs) {
                countDownStartAt = lastBonusLifeTime
            }

            const hms = convertHMS(bonusDurationMs - (currentTime - countDownStartAt))
            const minute = ('0' + hms.minutes).slice(-2)
            const second = ('0' + hms.seconds).slice(-2)

            if (parseInt(this.textLives.text) !== lives) {
                this.updateTextLives()
            }

            this.textTimer.setText(`${minute}:${second}`)
        }, 1000)
    }

    public stopIntervalTimer(): void {
        clearInterval(this.intervalTimer)
    }

    public setLives(lives: number) {
        this.textLives.setText(String(lives))
    }

    private runHeartBeatAnimation(): void {
        this.heartBeat.play()
        this.textLivesBeat.play()
        this.iconBeat.play()
    }

    private createHeartBeatAnimation(): void {
        this.heartBeat = new PulsateBubbleAnimation({
            targets: [this.circle],
            props: {
                scale: '+=0.005',
            },
        })

        this.textLivesBeat = new PulsateBubbleAnimation({
            targets: [this.textLives],
            props: {
                scale: '+=0.05',
            },
        })

        this.iconBeat = new PulsateBubbleAnimation({
            targets: [this.icon],
            props: {
                scale: '+=0.025',
            },
        })
    }
}

export default LivesTimer
