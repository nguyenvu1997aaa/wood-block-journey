import PulsateHearBeatAnimation from '@/game/animations/attention/PulsateHearBeat'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import { ScreenDepth } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import { startMultiModeGame } from '@/modules/match/actions/gameplay'
import { getGameplayCurrentStats, getGameplayStats } from '@/modules/match/selectors/stats'
import { shareBestScore } from '@/redux/actions/share'
import HomeButton from './component/HomeButton'
import PlayWithFriendsButton from './component/PlayWithFriendsButton'
import ShareButton from './component/ShareButton'

const { KEY, FRAME } = SPRITES.DEFAULT

type TData = {
    bestScore: number
}

class YourScoreScreen extends GameCore.Screen {
    private popup: Popup
    private title: Phaser.GameObjects.Container
    private contents: Phaser.GameObjects.Group
    private scoreText: Phaser.GameObjects.BitmapText
    private bestScoreText: Phaser.GameObjects.BitmapText
    private tweenScoreText: Phaser.Tweens.Tween

    private popupShowUpAnimation: ShowUpAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeOutAnimation: FadeOutAnimation

    private scoreBlock: Phaser.GameObjects.Container
    private bestScoreBlock: Phaser.GameObjects.Container

    private playWithFriendsButton: PlayWithFriendsButton
    private homeButton: HomeButton
    private shareButton: ShareButton

    private bestScore: number
    private currentScore: number
    private payload: IBestScoreBlockPayload

    public counterAnimation: Phaser.Tweens.Tween | null

    public scoreAnimation: PulsateHearBeatAnimation

    public scene: Phaser.Scene

    constructor(scene: Phaser.Scene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.setVisible(false)

        this.scene = scene

        this.setDepth(ScreenDepth.POPUP)

        this.createPopup()

        this.createPopupContent()

        this.createScoreAnimation()

        Phaser.Display.Align.In.Center(this.popup, this.zone, 0, -100)

        this.background.setVisible(false)
    }

    public open = (data: TData): void => {
        super.open(data)

        this.initScore()

        this.updateScore()

        this.setVisible(true)

        this.runOpenAnimation()
    }

    private createPopup(): void {
        this.popup = new Popup(this.scene, 0, 0, 300, 310)

        this.add(this.popup)
    }

    private createPopupContent(): void {
        this.createTitle()
        this.createScoreBlock()
        this.createBestScoreBlock()
        this.createButtons()

        this.contents = this.scene.make.group({})

        this.contents.addMultiple([this.homeButton, this.playWithFriendsButton, this.shareButton])
    }

    private createTitle(): void {
        this.title = this.scene.add.container()

        const imageScale = this.scene.world.getPixelRatio()

        const title = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_YOUR_SCORE,
        })

        const { width, height } = title

        title.setWorldSize(width / imageScale, height / imageScale)

        Phaser.Display.Align.In.Center(title, this.title, 0, 10)

        const close = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)
        close.onClick = this.handleClosePopup

        close.setName('Close')

        Phaser.Display.Align.In.RightCenter(close, this.title, 165, -15)

        this.title.add([title, close])

        this.popup.add(this.title)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup, 0, -2)
    }

    private createScoreBlock(): void {
        this.scoreBlock = this.scene.add.container()
        const background = this.scene.make.image({
            key: KEY,
            frame: FRAME.SCORE_PANEL,
        })

        background.setWorldSize(263, 76)

        this.scoreBlock.add(background)

        //
        this.scoreText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(55),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.scoreBlock.add(this.scoreText)

        this.popup.add(this.scoreBlock)

        Phaser.Display.Align.In.TopCenter(this.scoreBlock, this.popup, 0, -90)
    }

    private createBestScoreBlock(): void {
        this.bestScoreBlock = this.scene.add.container()
        const background = this.scene.make.image({
            key: KEY,
            frame: FRAME.BEST_SCORE_FRAME_LONG,
        })

        background.setWorldSize(193, 77)

        this.bestScoreBlock.add(background)

        //
        this.bestScoreText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(48),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.bestScoreBlock.add(this.bestScoreText)

        Phaser.Display.Align.In.Center(this.bestScoreText, this.bestScoreBlock, 0, 16)

        this.popup.add(this.bestScoreBlock)

        Phaser.Display.Align.In.Center(this.bestScoreBlock, this.scoreBlock, 0, 65)
    }

    private createButtons(): void {
        this.createButtonHome()
        this.createButtonPlayWithFriend()
        this.createButtonShare()
    }

    private createButtonHome(): void {
        this.homeButton = new HomeButton(this.scene)

        this.homeButton.onClick = this.clickHome.bind(this)

        this.popup.add(this.homeButton)

        Phaser.Display.Align.In.Center(this.homeButton, this.bestScoreBlock, -100, 80)
    }

    private clickHome(): void {
        this.scene.scene.switch(SceneKeys.DASHBOARD_SCENE)
    }

    private createButtonPlayWithFriend(): void {
        this.playWithFriendsButton = new PlayWithFriendsButton(this.scene)
        this.playWithFriendsButton.onClick = this.clickPlayWithFriends

        this.popup.add(this.playWithFriendsButton)

        Phaser.Display.Align.In.Center(this.playWithFriendsButton, this.bestScoreBlock, 0, 80)
    }

    private clickPlayWithFriends = (): void => {
        this.scene.storage.dispatch(startMultiModeGame())
    }

    private createButtonShare(): void {
        this.shareButton = new ShareButton(this.scene)

        this.shareButton.onClick = this.clickShare

        this.popup.add(this.shareButton)

        Phaser.Display.Align.In.Center(this.shareButton, this.bestScoreBlock, 100, 80)
    }

    private clickShare = (): void => {
        this.scene.storage.dispatch(shareBestScore())
    }

    private handleClosePopup = (): void => {
        // this.scene.audio.playSound(SOUND_EFFECT.POPUP_OFF, { volume: 0.6 })
        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(() => {
            // this.scene.scene.switch(SceneKeys.GAME_SCENE)
        })
    }

    private runCloseAnimation(): void {
        this.runPopupExitsAnimation(0, 200)
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
                },
            })
        }

        this.popupFadeOutAnimation?.play()
    }

    private setBestScore(bestScore: number): void {
        this.bestScoreText.setText(`${bestScore}`)
    }

    private runOpenAnimation(): void {
        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runPopupContentEntrancesAnimation(200, 300)
    }

    // Entrances animations
    private runPopupEntrancesAnimation(delay: number, duration: number): void {
        if (!this.popupShowUpAnimation) {
            const { y, scale } = this.popup
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
        if (!this.contentShowUpAnimation) {
            this.contentShowUpAnimation = new BubbleTouchAnimation({
                targets: this.contents.getChildren(),
                duration,
                delay: this.scene.tweens.stagger(80, { start: delay }),
                props: {
                    alpha: { start: 0, from: 0, to: 1 },
                },
            })
        }

        this.contentShowUpAnimation.play()
    }

    private initScore(): void {
        const playerScore = this.scene.player.getBestScore()

        this.bestScore = playerScore
        this.currentScore = 0
    }

    private updateScore() {
        const state = this.scene.storage.getState()
        const gamePlayCurrentStats = getGameplayCurrentStats(state)
        let { score, bestScore } = gamePlayCurrentStats

        if (score === undefined && bestScore === undefined) {
            const gamePlayStats = getGameplayStats(state)
            const playerStats = gamePlayStats[this.scene.player.getPlayerId()]

            score = playerStats?.score || 0
            bestScore = this.scene.player.getBestScore()
        }

        this.bestScore = (bestScore || 0) < this.bestScore ? this.bestScore : bestScore || 0
        this.currentScore = score

        this.updateData({
            bestScore: this.bestScore,
            currentScore: this.currentScore,
        })
    }

    public updateData(payload: IBestScoreBlockPayload): void {
        this.payload = payload

        const { bestScore, currentScore } = payload

        this.setBestScore(bestScore)

        if (currentScore <= bestScore) {
            this.setCurrentScore(currentScore)
            this.runScoreAnimation()

            if (currentScore > 0) {
                this.runScoreCounter()
            } else {
                this.counterAnimation = null
            }

            return
        }

        this.runAnimation()
    }

    private runAnimation(): void {
        this.runScoreCounter()
        this.scene.time.delayedCall(1300, () => {
            // this.entrancesAnimation.play()
        })
    }

    private runScoreAnimation(): void {
        this.scoreAnimation.play()
    }

    private createScoreAnimation(): void {
        this.scoreAnimation = new PulsateHearBeatAnimation({
            targets: [this.scoreText],
            props: {
                scale: { from: 1, to: 1.3 },
            },
        })
    }

    private runScoreCounter(): void {
        const { bestScore, currentScore } = this.payload

        this.counterAnimation?.remove()
        this.counterAnimation = this.scene.tweens.addCounter({
            from: 0,
            to: currentScore,
            delay: 700,
            duration: 2000,
            completeDelay: 300,
            onUpdate: (tween) => {
                this.scene.audio.playSound(SOUND_EFFECT.SCORE_COUNT)

                const score = Math.floor(tween.getValue())

                this.runScoreAnimation()
                this.setCurrentScore(score)
            },
            onComplete: () => {
                this.setBestScore(bestScore < currentScore ? currentScore : bestScore)
                this.setCurrentScore(currentScore)

                this.scene.audio.playSound(SOUND_EFFECT.GAME_OVER)
            },
        })
    }

    private setCurrentScore(value: number): void {
        this.scoreText.setText(`${value}`)
    }
}

export default YourScoreScreen
