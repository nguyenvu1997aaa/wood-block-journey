import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import Popup from '@/game/components/Popup'
import SwitchButton from '@/game/components/SwitchButton'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import { isSupportVibrateApi } from '@/utils/vibrate'
import vibrate from '@/utils/vibrate'

const { KEY, FRAME } = SPRITES.DEFAULT

class SettingsScreen extends GameCore.Screen {
    private popup: Popup
    private title: Phaser.GameObjects.Container
    private buttonClose: Button
    private contents: Phaser.GameObjects.Group
    private settingSound: SwitchButton
    private settingVibrate?: SwitchButton
    private settingSoundContainer: Phaser.GameObjects.Container
    private settingMusicContainer: Phaser.GameObjects.Container
    private settingVibrateContainer: Phaser.GameObjects.Container

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    constructor(scene: Phaser.Scene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.createPopup()
        this.createContentBackground()
        this.createTitle()
        this.createButtons()

        this.addItem()
        this.arrangeItems()
        this.createInput()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)
    }

    public open(): void {
        super.open()

        const { player } = this.scene
        const playerSettings = player.getPlayerSettings()
        const { sound, vibrate } = playerSettings

        this.settingSound.updateStatus(sound)
        this.settingVibrate?.updateStatus(vibrate)

        this.runOpenAnimation()
    }

    private createContentBackground(): void {
        const background = this.scene.make.image({
            key: KEY,
            frame: FRAME.POPUP_CONTENT_BACKGROUND,
        })

        background.setWorldSize(260, 145)

        this.popup.add(background)

        Phaser.Display.Align.In.Center(background, this.popup, 0, -4)
    }

    private createInput(): void {
        this.buttonClose.onClick = this.handleClose

        this.settingSound.onClick = this.handleSoundSetting
        if (this.settingVibrate) {
            this.settingVibrate.onClick = this.handleVibrateSetting
        }
    }

    private handleClose = (): void => {
        this.runCloseAnimation()
    }

    private handleMusicSetting = (enable: boolean): void => {
        this.scene.player.setSetting('music', enable)

        if (enable) {
            this.scene.audio.playMusic()
        } else {
            this.scene.audio.pauseMusic()
        }
    }

    private handleSoundSetting = (enable: boolean): void => {
        this.scene.player.setSetting('sound', enable)
    }

    private handleVibrateSetting = (enable: boolean): void => {
        if (enable) {
            vibrate(199)
        }

        this.scene.player.setSetting('vibrate', enable)
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, 0, 286, 226)
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone, 0, 10)
    }

    private createTitle() {
        this.title = this.scene.add.container()

        const imageScale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_SETTING,
        })

        const { width, height } = text

        text.setWorldSize(width / imageScale, height / imageScale)

        this.buttonClose = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)

        this.buttonClose.setName('Close')

        this.title.add([text, this.buttonClose])

        Phaser.Display.Align.In.Center(text, this.title)

        Phaser.Display.Align.In.Center(this.buttonClose, this.title, 135, -18)
    }

    private createButtons() {
        const { sound, vibrate } = this.scene.player.getPlayerSettings()

        this.createSoundButton(sound)

        if (isSupportVibrateApi()) {
            this.createVibrateButton(vibrate)
            Phaser.Display.Align.In.Center(this.settingSoundContainer, this.popup, 0, -33)
            Phaser.Display.Align.In.Center(this.settingVibrateContainer, this.popup, 0, 28)
        } else {
            Phaser.Display.Align.In.Center(this.settingSoundContainer, this.popup, 0, 0)
        }
    }

    private createVibrateButton(enable: boolean): void {
        this.settingVibrateContainer = this.scene.make.container({})

        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_VIBRATE,
        })

        icon.setWorldSize(41, 48)

        this.settingVibrate = new SwitchButton(this.scene, {
            enable,
            width: 89,
            height: 31,
        })

        this.settingVibrate.setName('Vibrate')

        this.settingVibrateContainer.add([icon, this.settingVibrate])

        Phaser.Display.Align.In.Center(icon, this.settingVibrateContainer, -60)
        Phaser.Display.Align.In.Center(this.settingVibrate, this.settingVibrateContainer, 35)

        this.popup.add(this.settingVibrateContainer)
    }

    private createSoundButton(enable: boolean): void {
        this.settingSoundContainer = this.scene.make.container({})

        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_SOUND,
        })

        icon.setWorldSize(40, 35)

        this.settingSound = new SwitchButton(this.scene, {
            enable,
            width: 89,
            height: 31,
        })

        this.settingSound.setName('Sound')

        this.settingSoundContainer.add([icon, this.settingSound])

        Phaser.Display.Align.In.Center(icon, this.settingSoundContainer, -58)
        Phaser.Display.Align.In.Center(this.settingSound, this.settingSoundContainer, 35)

        this.popup.add(this.settingSoundContainer)

        Phaser.Display.Align.In.Center(this.settingSoundContainer, this.popup, 0, -33)
    }

    private addItem() {
        this.popup.add([this.title])

        this.contents = this.scene.add.group()
        this.contents.addMultiple([])
    }

    private arrangeItems() {
        Phaser.Display.Align.In.TopCenter(this.title, this.popup)
    }

    // Animations
    private runOpenAnimation(): void {
        if (this.popupShowUpAnimation?.tween?.isPlaying()) return

        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runFadeInMaskAnimation(100, 300)
        this.runPopupContentEntrancesAnimation(200, 300)
    }

    private runCloseAnimation(): void {
        if (this.popupFadeOutAnimation?.tween?.isPlaying()) return

        // this.scene.audio.playSound(SOUND_EFFECT.POPUP_OFF, { volume: 0.6 })

        this.runPopupExitsAnimation(50, 200)
        this.runFadeOutMaskAnimation(0, 200)
    }

    // Entrances animations
    private runPopupEntrancesAnimation(delay: number, duration: number): void {
        if (!this.popupShowUpAnimation) {
            const { scale } = this.popup
            this.popupShowUpAnimation = new ShowUpAnimation({
                targets: [this.popup],
                delay,
                duration,
                props: {
                    y: 0,
                    alpha: { start: 1, from: 1, to: 1 },
                    scale: { start: 0, from: 0, to: scale },
                },
            })
        }

        this.popupShowUpAnimation.play()
    }

    private runPopupContentEntrancesAnimation(delay: number, duration: number): void {
        this.contentShowUpAnimation?.remove()
        this.contentShowUpAnimation = new BubbleTouchAnimation({
            targets: this.contents.getChildren(),
            duration,
            delay,
            props: {
                alpha: { start: 0, from: 0, to: 1 },
            },
        })

        this.contentShowUpAnimation.play()
    }

    // Exits animations
    private runPopupExitsAnimation(delay: number, duration: number): void {
        if (!this.popupFadeOutAnimation) {
            this.popupFadeOutAnimation = new FadeOutAnimation({
                targets: [this.popup],
                delay,
                duration,
                props: {
                    scale: 0,
                },
                ease: Phaser.Math.Easing.Back.In,
                onComplete: () => {
                    this.popup.setY(0)
                    this.scene.screen.close(this.name)
                },
            })
        }

        this.popupFadeOutAnimation.play()
    }

    private runFadeInMaskAnimation(delay: number, duration: number): void {
        if (!this.popupFadeInMaskAnimation) {
            const { alpha } = this.background
            this.popupFadeInMaskAnimation = new FadeInAnimation({
                targets: [this.background],
                delay,
                duration,
                props: {
                    alpha: { start: 0, from: 0, to: alpha },
                },
            })
        }

        this.popupFadeInMaskAnimation.play()
    }

    private runFadeOutMaskAnimation(delay: number, duration: number): void {
        if (!this.popupFadeOutMaskAnimation) {
            const { alpha } = this.background
            this.popupFadeOutMaskAnimation = new FadeOutAnimation({
                targets: [this.background],
                delay,
                duration,
                props: {
                    alpha: { start: alpha, from: alpha, to: 0 },
                },
            })
        }

        this.popupFadeOutMaskAnimation.play()
    }
}

export default SettingsScreen
