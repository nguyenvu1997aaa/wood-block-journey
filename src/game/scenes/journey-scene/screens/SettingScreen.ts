import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import Popup from '@/game/components/Popup'
import SwitchButton from '@/game/components/SwitchButton'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import { ScreenDepth, ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import { getLives } from '@/modules/lives/selectors/lives'
import { startMultiModeGame } from '@/modules/match/actions/gameplay'
import { shareScore } from '@/redux/actions/share'
import vibrate from '@/utils/vibrate'
import HomeButton from './setting-screen/HomeButton'
import JourneyButton from './setting-screen/JourneyButton'
import PlayWithFriendsButton from './setting-screen/PlayWithFriendsButton'
import ReplayButton from './setting-screen/ReplayButton'
import { isSupportVibrateApi } from '@/utils/vibrate'
import JourneyScene from '..'

const { KEY, FRAME } = SPRITES.DEFAULT

class SettingsScreen extends GameCore.Screen {
    public scene: JourneyScene
    private popup: Popup
    private title: Phaser.GameObjects.Container
    private buttonClose: Button
    private contents: Phaser.GameObjects.Group
    private backgroundContent: Phaser.GameObjects.Image
    private settingMusic: SwitchButton
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

    private buttonReplay: ReplayButton
    private buttonPlayWithFriend: PlayWithFriendsButton

    private buttonHome: HomeButton
    private buttonJourney: JourneyButton
    // private buttonLeaderboard: LeaderBoardButton

    private debuggerCurrentLevelText: Phaser.GameObjects.BitmapText
    private debuggerCurrentLevel = 0

    constructor(scene: JourneyScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.createPopup()
        this.createTitle()
        this.createContentBackground()
        this.createSwitchButtons()
        this.createButtons()

        this.addItem()
        this.arrangeItems()
        this.createInput()

        this.createDebuggerInputLevel()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)

        if (this.scene.world.isLandscape()) {
            this.popup.setScale(this.popup.scale - 0.1)
        }
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
        this.backgroundContent = this.scene.make.image({
            key: KEY,
            frame: FRAME.POPUP_CONTENT_BACKGROUND,
        })

        this.backgroundContent.setWorldSize(263, 147)

        this.popup.add(this.backgroundContent)

        Phaser.Display.Align.In.TopCenter(this.backgroundContent, this.popup, 0, -48)
    }

    private createInput(): void {
        this.buttonClose.onClick = this.handleClose

        // this.settingMusic.onClick = this.handleMusicSetting
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
        this.popup = new Popup(this.scene, 0, 0, 290, 390)
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone)
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

        Phaser.Display.Align.In.Center(text, this.title, 0, 11)

        Phaser.Display.Align.In.Center(this.buttonClose, this.title, 135, -14)
    }

    private createButtons(): void {
        this.createReplayButton()
        // this.createPlayWithFriendButton()

        this.createHomeButton()
        this.createJourneyButton()
        // this.createLeaderboardButton()
    }

    private createReplayButton(): void {
        this.buttonReplay = new ReplayButton(this.scene)

        this.popup.add(this.buttonReplay)

        this.buttonReplay.onClick = this.clickReplay

        Phaser.Display.Align.In.Center(this.buttonReplay, this.popup, 0, 43)
    }

    private clickReplay = (): void => {
        const state = this.scene.storage.getState()
        const playerLives = getLives(state)

        if (playerLives < 1) {
            this.setVisible(false)
            this.scene.screen.open(ScreenKeys.CLAIM_HEART_SCREEN)
            return
        }

        // this.scene.storage.dispatch(decreaseLife())

        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(async () => {
            this.scene.screen.close(this.name)
            this.scene.handleRetryLevel()
        })
    }

    private createPlayWithFriendButton(): void {
        this.buttonPlayWithFriend = new PlayWithFriendsButton(this.scene)

        this.popup.add(this.buttonPlayWithFriend)

        this.buttonPlayWithFriend.onClick = this.clickButtonPlayWithFriends

        Phaser.Display.Align.In.Center(this.buttonPlayWithFriend, this.buttonReplay, 0, 65)
    }

    private clickButtonPlayWithFriends = (): void => {
        this.scene.storage.dispatch(startMultiModeGame())

        this.scene.screen.close(this.name)
    }

    private createHomeButton(): void {
        this.buttonHome = new HomeButton(this.scene)

        this.popup.add(this.buttonHome)

        this.buttonHome.onClick = this.clickButtonHome

        Phaser.Display.Align.In.Center(this.buttonHome, this.buttonReplay, -60, 72)
    }

    private clickButtonHome = (): void => {
        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(async () => {
            this.scene.scene.switch(SceneKeys.DASHBOARD_SCENE)
        })
    }

    private createJourneyButton(): void {
        this.buttonJourney = new JourneyButton(this.scene)

        this.popup.add(this.buttonJourney)

        this.buttonJourney.onClick = this.clickButtonJourney.bind(this)

        Phaser.Display.Align.In.Center(this.buttonJourney, this.buttonReplay, 60, 72)
    }

    private clickButtonJourney(): void {
        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(async () => {
            this.scene.scene.switch(SceneKeys.LEVEL_SCENE)
        })
    }

    // private createLeaderboardButton(): void {
    //     this.buttonLeaderboard = new LeaderBoardButton(this.scene)

    //     this.popup.add(this.buttonLeaderboard)

    //     this.buttonLeaderboard.onClick = this.clickButtonLeaderboard

    //     Phaser.Display.Align.In.Center(this.buttonLeaderboard, this.buttonReplay, 90, 72)
    // }

    private clickButtonLeaderboard = (): void => {
        this.scene.screen.open(ScreenKeys.LEADER_BOARD_SCREEN)
    }

    private clickButtonShare = (): void => {
        this.scene.storage.dispatch(shareScore())
    }

    private createSwitchButtons() {
        const { music, sound, vibrate } = this.scene.player.getPlayerSettings()

        this.createSoundButton(sound)

        if (isSupportVibrateApi()) {
            this.createVibrateButton(vibrate)

            Phaser.Display.Align.In.Center(
                this.settingSoundContainer,
                this.backgroundContent,
                0,
                -33
            )
            Phaser.Display.Align.In.Center(
                this.settingVibrateContainer,
                this.backgroundContent,
                0,
                28
            )
        } else {
            Phaser.Display.Align.In.Center(this.settingSoundContainer, this.backgroundContent, 0, 0)
        }

        // this.createMusicButton(music)
    }

    private createMusicButton(enable: boolean): void {
        this.settingMusicContainer = this.scene.make.container({})

        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_MUSIC,
        })

        icon.setWorldSize(37, 40)

        this.settingMusic = new SwitchButton(this.scene, {
            enable,
            width: 89,
            height: 31,
        })

        this.settingMusic.setName('Music')

        Phaser.Display.Align.In.Center(icon, this.settingMusicContainer, -60)

        Phaser.Display.Align.In.Center(this.settingMusic, this.settingMusicContainer, 40)

        this.settingMusicContainer.add([icon, this.settingMusic])

        this.popup.add(this.settingMusicContainer)

        Phaser.Display.Align.In.Center(this.settingMusicContainer, this.backgroundContent, 0, 60)
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

        icon.setWorldSize(41, 36)

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
    }

    private addItem() {
        this.popup.add([this.title])

        this.contents = this.scene.add.group()
        this.contents.addMultiple([])
    }

    private arrangeItems() {
        Phaser.Display.Align.In.TopCenter(this.title, this.popup)

        // Phaser.Display.Align.In.Center(this.settingVibrate, this.popup, 0, -60)
        // Phaser.Display.Align.In.Center(this.settingSound, this.popup, 0, 0)
        // Phaser.Display.Align.In.Center(this.settingMusic, this.popup, 0, 60)
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

    private createDebuggerInputLevel(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const container = this.scene.make.container({})

        for (let i = 0; i < 10; i++) {
            const lvl = this.scene.make.bitmapText({
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(34),
                origin: { x: 0.5, y: 0.5 },
                text: `${i}`,
            })

            container.add(lvl)

            lvl.setInteractive()
            lvl.on('pointerdown', () => {
                this.debuggerHandleClick(i)
            })

            Phaser.Display.Align.In.Center(lvl, container, i * 20)
        }

        this.add(container)

        Phaser.Display.Align.In.Center(container, this.popup, -100, 190)

        this.debuggerCurrentLevelText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(34),
            origin: { x: 0.5, y: 0.5 },
            text: 'Level 0',
        })

        this.add(this.debuggerCurrentLevelText)

        Phaser.Display.Align.In.Center(this.debuggerCurrentLevelText, this.popup, 0, 210)

        const textGo = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(34),
            origin: { x: 0.5, y: 0.5 },
            text: 'Go',
        })

        this.add(textGo)

        textGo.setInteractive()
        textGo.on('pointerdown', () => {
            this.close()

            this.scene.time.delayedCall(300, () => {
                this.scene.levelManager.setLevel(this.debuggerCurrentLevel)
                this.scene.startGame()
            })
        })

        Phaser.Display.Align.In.Center(textGo, this.popup, -70, 210)

        const textClear = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(34),
            origin: { x: 0.5, y: 0.5 },
            text: 'Clear',
        })

        textClear.setInteractive()
        textClear.on('pointerdown', () => {
            this.debuggerCurrentLevel = 0

            this.debuggerCurrentLevelText.setText(`Level ${String(this.debuggerCurrentLevel)}`)
        })

        this.add(textClear)

        Phaser.Display.Align.In.Center(textClear, this.popup, 70, 210)
    }

    private debuggerHandleClick(index: number) {
        console.log('index ------> ', index)

        const str = this.debuggerCurrentLevel + `${index}`

        this.debuggerCurrentLevel = parseInt(str)

        this.debuggerCurrentLevelText.setText(`Level ${String(this.debuggerCurrentLevel)}`)
    }
}

export default SettingsScreen
