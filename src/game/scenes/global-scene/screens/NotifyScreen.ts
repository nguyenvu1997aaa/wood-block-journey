import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import Loading from '@/game/components/Loading'
import FONTS from '@/game/constants/resources/fonts'
import { ScreenDepth } from '@/game/constants/screens'

type TData = {
    message: string
    duration: number
    loading: boolean
}

class NotifyScreen extends GameCore.Screen {
    private loadingIcon: Loading
    private messageText: Phaser.GameObjects.BitmapText

    private openAnimation: BubbleTouchAnimation
    private closeTimerEvent: Phaser.Time.TimerEvent

    private countDownTween: Phaser.Tweens.Tween

    constructor(scene: Phaser.Scene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.addLoadingIcon()
        this.addMessageText()

        this.setDepth(ScreenDepth.PRIORITY)

        this.background.setAlpha(0.8)
    }

    public open(data: TData): void {
        super.open(data)

        const [message = '', duration = 0, loading = false, countDown = false] = this.getData([
            'message',
            'duration',
            'loading',
            'countDown',
        ])

        this.countDownTween?.remove()

        if (countDown) {
            this.setMessage(message, [Math.round(duration / 1000)])
            this.countDownTween = this.scene.tweens.addCounter({
                from: duration,
                to: 0,
                duration,
                onUpdate: (tween) => {
                    const value = tween.getValue()
                    this.setMessage(message, [Math.round(value / 1000)])
                },
            })
        } else {
            this.setMessage(message)
        }

        this.showLoading(loading)

        this.closeTimerEvent?.remove()
        if (duration > 0) {
            this.closeTimerEvent = this.scene.time.addEvent({
                delay: duration,
                callback: () => {
                    if (this.visible) {
                        this.scene.screen.close(this.name)
                    }
                },
            })
        }

        this.runOpenAnimation()
    }

    private addLoadingIcon(): void {
        this.loadingIcon = new Loading(this.scene)
        this.add(this.loadingIcon)

        Phaser.Display.Align.In.Center(this.loadingIcon, this.zone)
    }

    private addMessageText() {
        this.messageText = this.scene.make.bitmapText({
            size: this.scene.fontSize(40),
            font: FONTS.PRIMARY_LIGHT.KEY,
            origin: { x: 0.5, y: 0.5 },
        })

        this.messageText.setCenterAlign()

        this.add(this.messageText)
    }

    private setMessage(message: string, values?: any[]): void {
        this.messageText.setText(this.printf(message, values))
    }

    private showLoading(loading: boolean) {
        this.loadingIcon.setVisible(loading)

        const posY = loading === false ? 20 : 80
        Phaser.Display.Align.In.Center(this.messageText, this.zone, 0, posY)
    }

    private runOpenAnimation(): void {
        this.openAnimation?.stop()
        this.openAnimation?.remove()

        this.openAnimation = new BubbleTouchAnimation({
            targets: [this.messageText, this.loadingIcon],
            props: {
                scale: {
                    getStart: (target) => target.scale - 0.3,
                    getEnd: (target) => target.scale,
                },
            },
        })

        this.openAnimation.play()
    }

    protected logPageviewOnOpen() {
        //? No log page view for notify screen
    }

    protected logPageviewOnClose() {
        //? No log page view for notify screen
    }

    private printf(str: string, ...args: any[]) {
        if (args.length === 0) return str
        return args.reduce((_str, val) => _str.replace(/%s|%v|%d|%f|%d/, val), str)
    }
}

export default NotifyScreen
