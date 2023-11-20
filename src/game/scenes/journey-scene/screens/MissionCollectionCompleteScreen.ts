import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import LivesTimer from '@/game/components/LivesTimer'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import { ScreenDepth, ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import GAME_LEVELS from '@/game/gameplay/constants/GameLevels'
import { getLives } from '@/modules/lives/selectors/lives'
import { getJourneyMatchLevel } from '@/modules/match/selectors/match'
import JourneyScene from '..'

const { KEY, FRAME } = SPRITES.DEFAULT

export default class MissionCollectionCompleteScreen extends GameCore.Screen {
    public scene: JourneyScene

    private popup: Popup
    private title: Phaser.GameObjects.Container
    private buttonBack: Button
    private buttonContinue: Button
    private contents: Phaser.GameObjects.Group

    private textLevel: Phaser.GameObjects.BitmapText
    private textLevel2: Phaser.GameObjects.Text
    private textLevelComplete: Phaser.GameObjects.BitmapText
    private textLevelComplete2: Phaser.GameObjects.Text
    private backgroundContent: Phaser.GameObjects.Image
    private textNextLevel: Phaser.GameObjects.Image

    private livesTimer: LivesTimer

    private listTargets: Phaser.GameObjects.Image[] = []

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    private buttonClose: Button

    constructor(scene: JourneyScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.createPopup()
        this.createContentBackground()

        this.createTitle()
        this.createTexts()
        this.createButtons()
        this.createLivesTimer()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)
    }

    public open(): void {
        super.open()

        // if (this.listTargets.length === 0) {
        //     this.createTargetItems()
        // } else {
        //     this.updateTargetItems()
        // }

        this.updateInfo()

        this.runOpenAnimation()
    }

    private updateInfo(): void {
        let level = this.scene.levelManager.getLevel()

        if (level < GAME_LEVELS.length - 1) {
            level = level - 1
        }

        if (level > GAME_LEVELS.length - 1) {
            level = GAME_LEVELS.length - 1
        }

        this.textLevel.setText(`${this.scene.lang.Text.Level} ${level}`)
        this.textLevel2.setText(`${this.scene.lang.Text.Level} ${level}`)

        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.textLevel2.setVisible(true)
            this.textLevel.setVisible(false)
        }

        this.updateTextNextLevel()
    }

    private updateTextNextLevel(): void {
        const level = this.scene.levelManager.getLevel()
        const scale = this.scene.world.getPixelRatio()

        if (level > GAME_LEVELS.length - 1) {
            this.textNextLevel.setFrame(FRAME.TEXT_START_OVER)

            this.textNextLevel.setWorldSize(
                this.textNextLevel.width / scale,
                this.textNextLevel.height / scale
            )

            return
        }

        this.textNextLevel.setFrame(FRAME.TEXT_NEXT_LEVEL)

        this.textNextLevel.setWorldSize(
            this.textNextLevel.width / scale,
            this.textNextLevel.height / scale
        )
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, 0, 290, 234)
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone, 0, -20)
    }

    private createContentBackground(): void {
        this.backgroundContent = this.scene.make.image({
            key: KEY,
            frame: FRAME.POPUP_CONTENT_BACKGROUND,
        })

        this.backgroundContent.setWorldSize(260, 147)

        this.popup.add(this.backgroundContent)

        Phaser.Display.Align.In.TopCenter(this.backgroundContent, this.popup, 0, -66)
    }

    private createTitle() {
        this.title = this.scene.add.container()

        const scale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_CONGRATULATION,
        })

        text.setWorldSize(text.width / scale, text.height / scale)

        this.buttonClose = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)

        this.buttonClose.setName('Close')

        this.buttonClose.onClick = this.clickButtonClose.bind(this)

        this.title.add([text, this.buttonClose])

        this.popup.add(this.title)

        Phaser.Display.Align.In.Center(text, this.title, 0, 30)

        Phaser.Display.Align.In.Center(this.buttonClose, this.title, 135, 5)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup)
    }

    private createTexts(): void {
        this.createTextLevel()
        this.createTextLevel2()

        this.createTextLevelComplete()

        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.createTextLevelComplete2()
            this.textLevelComplete.setVisible(false)
        }
    }

    private createTextLevel(): void {
        this.textLevel = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(40),
            text: `${this.scene.lang.Text.Level} 1`,
            origin: { x: 0.5, y: 0.5 },
        })

        this.popup.add(this.textLevel)

        Phaser.Display.Align.In.Center(this.textLevel, this.popup, 0, -23)
    }

    private createTextLevel2(): void {
        this.textLevel2 = this.scene.make.text({
            text: `${this.scene.lang.Text.Level} 1`,
            style: {
                fontFamily: FONTS.FONT_FAMILY,
                fontSize: `${this.scene.fontSize(40)}px`,
            },
            origin: { x: 0.5, y: 0.5 },
        })

        this.textLevel2.setTint(0x73391a)
        this.textLevel2.setVisible(false)

        this.popup.add(this.textLevel2)

        Phaser.Display.Align.In.Center(this.textLevel2, this.popup, 0, -23)
    }

    private createTextLevelComplete(): void {
        this.textLevelComplete = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(44),
            text: this.scene.lang.Text.Completed,
            origin: { x: 0.5, y: 0.5 },
        })

        this.popup.add(this.textLevelComplete)

        Phaser.Display.Align.In.Center(this.textLevelComplete, this.popup, 0, 3)
    }

    private createTextLevelComplete2(): void {
        this.textLevelComplete2 = this.scene.make.text({
            text: this.scene.lang.Text.Completed,
            style: {
                fontFamily: FONTS.FONT_FAMILY,
                fontSize: `${this.scene.fontSize(44)}px`,
            },
            origin: { x: 0.5, y: 0.5 },
        })

        this.textLevelComplete2.setTint(0x73391a)

        this.popup.add(this.textLevelComplete2)

        Phaser.Display.Align.In.Center(this.textLevelComplete2, this.popup, 0, 3)
    }

    private createTargetItems(): void {
        const { header } = this.scene.layoutManager.objects
        const targetKeys = header.collectItems.getTargetKeys()

        if (!targetKeys || targetKeys.length === 0) return

        const position = this.calcPosition(targetKeys.length)

        for (let i = 0; i < targetKeys.length; i++) {
            const image = this.scene.make.image({
                key: SPRITES.GAMEPLAY.KEY,
            })

            image.setWorldSize(50, 50)
            image.setFrame(targetKeys[i] || targetKeys[0])
            image.setX(position[i])

            this.listTargets.push(image)
        }

        this.popup.add(this.listTargets)
    }

    private clickButtonClose(): void {
        this.runCloseAnimation()
        const { header } = this.scene.layoutManager.objects

        this.scene.time.delayedCall(300, () => {
            header.progressBar.reset()
            this.scene.clearFen()
            this.scene.scene.switch(SceneKeys.LEVEL_SCENE)
        })
    }

    private updateTargetItems(): void {
        const { header } = this.scene.layoutManager.objects
        const targetKeys = header.collectItems.getTargetKeys()

        if (!targetKeys || targetKeys.length === 0) return

        this.popup.remove(this.listTargets)

        const position = this.calcPosition(targetKeys.length)

        for (let i = 0; i < targetKeys.length; i++) {
            let image = this.listTargets[i]

            if (!image) {
                image = this.scene.make.image({
                    key: SPRITES.GAMEPLAY.KEY,
                })

                this.listTargets.push(image)
            }

            image.setWorldSize(50, 50)
            image.setFrame(targetKeys[i] || targetKeys[0])
            image.setX(position[i])
        }

        this.popup.add(this.listTargets)
    }

    private calcPosition(amount: number): number[] {
        const result = []
        const mainWidth = 310
        const padding = mainWidth / (amount + 1)
        const increasePadding = (padding * (amount - 1)) / 2

        for (let i = 0; i < amount; i++) {
            result.push(padding * i - increasePadding)
        }

        return result
    }

    private createButtons(): void {
        this.createButtonBack()
        this.createButtonContinue()
    }

    private createButtonBack(): void {
        const iconBack = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_BACK,
        })

        iconBack.setWorldSize(30, 30)

        this.buttonBack = new Button(this.scene, KEY, FRAME.BUTTON_MINOR, 62, 54)

        this.buttonBack.setName('Back')

        this.buttonBack.add(iconBack)

        this.popup.add(this.buttonBack)

        this.buttonBack.onClick = this.clickButtonBack.bind(this)

        Phaser.Display.Align.In.Center(this.buttonBack, this.popup, -90, 52)
    }

    private clickButtonBack(): void {
        this.runCloseAnimation()
        const { header } = this.scene.layoutManager.objects

        this.scene.time.delayedCall(300, () => {
            header.progressBar.reset()
            this.scene.clearFen()
            this.scene.scene.switch(SceneKeys.LEVEL_SCENE)
        })
    }

    private createButtonContinue(): void {
        const scale = this.scene.world.getPixelRatio()

        this.textNextLevel = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_NEXT_LEVEL,
        })

        this.textNextLevel.setWorldSize(
            this.textNextLevel.width / scale,
            this.textNextLevel.height / scale
        )

        this.buttonContinue = new Button(this.scene, KEY, FRAME.BUTTON_GREEN, 178, 54)

        this.buttonContinue.setName('Continue')

        this.buttonContinue.add(this.textNextLevel)

        this.popup.add(this.buttonContinue)

        this.buttonContinue.onClick = this.clickButtonContinue.bind(this)

        Phaser.Display.Align.In.Center(this.buttonContinue, this.popup, 33, 52)
    }

    private clickButtonContinue(): void {
        const state = this.scene.storage.getState()
        const playerLives = getLives(state)

        if (playerLives < 1) {
            this.runCloseAnimation()
            this.scene.screen.open(ScreenKeys.CLAIM_HEART_SCREEN, {
                onClose: () => {
                    this.scene.screen.open(ScreenKeys.MISSION_COLLECTION_COMPLETE_SCREEN)
                },
            })
            return
        }

        const currentLevel = getJourneyMatchLevel(state)

        if (currentLevel >= GAME_LEVELS.length - 1) {
            this.scene.handleClickStartOver()

            return
        }

        // this.scene.storage.dispatch(decreaseLife())

        this.runCloseAnimation()
        const { header, main } = this.scene.layoutManager.objects

        this.scene.time.delayedCall(300, () => {
            this.scene.analytics.levelStart(
                this.scene.levelManager.getLevel(),
                undefined,
                this.scene.getLevelName()
            )

            const tween = main.board.fadeOut()

            if (tween) {
                tween.on('complete', () => {
                    header.progressBar.reset()
                    this.scene.clearFen()
                    this.scene.startGame()
                })

                return
            }

            header.progressBar.reset()
            this.scene.clearFen()
            this.scene.startGame()
        })
    }

    private createLivesTimer(): void {
        this.livesTimer = new LivesTimer(this.scene)

        this.livesTimer.startIntervalTimer()

        this.livesTimer.setFrameLivesTimeBlock2()

        this.add(this.livesTimer)

        Phaser.Display.Align.In.TopCenter(this.livesTimer, this, 0, -62)
    }

    // Animations
    private runOpenAnimation(): void {
        if (this.popupShowUpAnimation?.tween?.isPlaying()) return

        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runFadeInMaskAnimation(100, 300)
        // this.runPopupContentEntrancesAnimation(200, 300)
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
}
