import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import AvatarFrame from '@/game/components/AvatarFrame'
import Button from '@/game/components/Button'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import { ScreenDepth, ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import {
    getDailyChallengeLeaders,
    getDailyChallengeTimePlay,
} from '@/modules/daily-challenge/selectors/dailyChallenge'
import { showMiniJourney } from '@/modules/match/actions/gameplay'
import JourneyScene from '..'
import HomeButton from './daily-challenge-screen/buttons/HomeButton'
import { iLeaderData } from './daily-challenge-screen/component/LeaderItem'
import LeaderItems from './daily-challenge-screen/component/LeaderItems'

const { KEY, FRAME } = SPRITES.DEFAULT

export default class DailyChallengeModeScreen extends GameCore.Screen {
    public scene: JourneyScene

    private popup: Popup
    private title: Phaser.GameObjects.Container
    private buttonHome: Button
    private contents: Phaser.GameObjects.Group
    private avatar: AvatarFrame
    private backgroundContent: Phaser.GameObjects.Image

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    private buttonClose: Button

    public leaderItems: LeaderItems

    private timeText: Phaser.GameObjects.BitmapText

    constructor(scene: JourneyScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.createPopup()
        this.createScroller()
        this.createContentBackground()
        this.createAvatar()
        this.createTitle()
        this.createTimeText()
        this.createButtons()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)

        if (this.scene.world.isLandscape()) {
            this.popup.setScale(this.popup.scale - 0.2)
        }
    }

    private createScroller(): void {
        this.leaderItems = new LeaderItems(this.scene)

        this.popup.add(this.leaderItems)

        Phaser.Display.Align.In.Center(this.leaderItems, this.popup, 0, 36)
    }

    private updateTimeText(): void {
        const state = this.scene.storage.getState()
        const time = getDailyChallengeTimePlay(state)
        this.timeText.setText(this.secondsToHms(time))
    }

    private secondsToHms(duration: number): string {
        const s = Math.round((duration / 1000) % 60)
        const m = Math.floor((duration / (1000 * 60)) % 60)
        const h = Math.floor((duration / (1000 * 60 * 60)) % 24)

        const hDisplay = ('0' + `${h}`).slice(-2)
        const mDisplay = ('0' + `${m}`).slice(-2)
        const sDisplay = ('0' + `${s}`).slice(-2)

        return hDisplay + ':' + mDisplay + ':' + sDisplay + ''
    }

    private getLeadersData(): iLeaderData[] {
        const state = this.scene.game.storage.getState()
        const leaders = getDailyChallengeLeaders(state)
        const data = []

        const objectKey = Object.values(leaders) || []

        // @ts-ignore
        const leadersByRank = objectKey.sort((a, b) => +a.score - +b.score)

        if (leadersByRank.length > 0) {
            for (const player of leadersByRank) {
                data.push(player)
            }
        }

        return data as iLeaderData[]
    }

    public open(): void {
        super.open()

        this.loadAvatar()

        this.updateTimeText()

        this.runOpenAnimation()
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, 20, 290, 280, {
            forceHeightTop: 54,
        })
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone, 0, -10)
    }

    private createContentBackground(): void {
        this.backgroundContent = this.scene.make.image({
            key: KEY,
            frame: FRAME.DAILY_BACKGROUND,
        })

        this.backgroundContent.setWorldSize(258, 132)

        this.popup.add(this.backgroundContent)

        Phaser.Display.Align.In.TopCenter(this.backgroundContent, this.popup, 0, -86)
    }

    private createAvatar(): void {
        this.avatar = new AvatarFrame(this.scene, {
            key: KEY,
            frame: FRAME.AVATAR_BORDER,
            background: FRAME.AVATAR_BACKGROUND,
            width: 70,
            height: 70,
            radius: 10,
            borderWidth: 10,
        })

        this.popup.add(this.avatar)

        Phaser.Display.Align.In.Center(this.avatar, this.backgroundContent, 71, -10)
    }

    private createTitle() {
        this.title = this.scene.add.container()

        const imageScale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_RESULT,
        })

        const { width, height } = text

        text.setWorldSize(width / imageScale, height / imageScale)

        this.buttonClose = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)

        this.buttonClose.setName('Close')

        this.buttonClose.onClick = this.clickButtonClose.bind(this)

        this.title.add([text, this.buttonClose])

        this.popup.add(this.title)

        Phaser.Display.Align.In.Center(text, this.title, 0, 10)

        Phaser.Display.Align.In.Center(this.buttonClose, this.title, 135, 0)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup, 0, -30)
    }

    private clickButtonClose(): void {
        this.runCloseAnimation()

        this.scene.storage.dispatch(showMiniJourney(true))
        this.scene.screen.open(ScreenKeys.MINI_JOURNEY_SCREEN)
    }

    private createTimeText(): void {
        this.timeText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(35),
            text: '00:00:00',
            origin: { x: 0.5, y: 0.5 },
        })

        this.popup.add(this.timeText)
        this.timeText.setPosition(70, 50)
    }

    private createButtons(): void {
        this.createButtonHome()
    }

    private createButtonHome(): void {
        this.buttonHome = new HomeButton(this.scene)

        this.popup.add(this.buttonHome)

        this.buttonHome.onClick = this.clickButtonHome.bind(this)

        Phaser.Display.Align.In.BottomCenter(this.buttonHome, this.popup, 0, 5)
    }

    private clickButtonHome(): void {
        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(async () => {
            this.scene.scene.switch(SceneKeys.DASHBOARD_SCENE)
        })
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

    private loadAvatar(): void {
        const { playerId, photo } = this.scene.player.getPlayer()

        this.avatar.loadPhoto(playerId, photo)
    }

    // private updateLeaderBoard(): void {}
}
