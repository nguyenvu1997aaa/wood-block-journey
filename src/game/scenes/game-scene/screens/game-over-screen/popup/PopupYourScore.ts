import PulsateHearBeatAnimation from '@/game/animations/attention/PulsateHearBeat'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import PlayWithFriendsButton from '../../component/PlayWithFriendsButton'
import PlayButton from '../../component/PlayButton'
import HomeButton from '../../component/HomeButton'
import {
    startMultiModeGameRandomFriends,
    startSingleModeGame,
} from '@/modules/match/actions/gameplay'
import { getGameplayCurrentStats, getGameplayStats } from '@/modules/match/selectors/stats'
import Emitter from '@/utils/emitter'
import GAME_EVENT from '@/game/gameplay/events/game'
import Journey1Button from '../../component/Journey1Button'

const { KEY, FRAME } = SPRITES.DEFAULT

class PopupYourScore extends Phaser.GameObjects.Container {
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
    private playButton: PlayButton
    private homeButton: HomeButton
    private journeyButton: Journey1Button

    private bestScore: number
    private currentScore: number
    private payload: IBestScoreBlockPayload

    public buttonClose: Button

    public counterAnimation: Phaser.Tweens.Tween | null

    public scoreAnimation: PulsateHearBeatAnimation

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.initScore()

        this.scene = scene

        this.createPopup()

        this.createPopupContent()

        this.createScoreAnimation()
    }

    private createPopup(): void {
        this.popup = new Popup(this.scene, 0, 0, 290, 290, {
            forceHeightTop: 54,
        })

        this.add(this.popup)
    }

    private createPopupContent(): void {
        this.createTitle()
        this.createScoreBlock()
        this.createBestScoreBlock()
        this.createButtons()

        this.contents = this.scene.make.group({})

        this.contents.addMultiple([
            this.homeButton,
            this.playWithFriendsButton,
            this.playButton,
            this.journeyButton,
        ])
    }

    public updateButtons(): void {
        try {
            this.playWithFriendsButton.setVisible(false)
            this.playButton.setVisible(true)
        } catch (error) {
            console.log(error)
        }
    }

    private createTitle(): void {
        this.title = this.scene.add.container()
        const scale = this.scene.world.getPixelRatio()

        const title = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_YOUR_SCORE,
        })

        title.setWorldSize(title.width / scale, title.height / scale)

        Phaser.Display.Align.In.Center(title, this.title, 0, 10)

        this.buttonClose = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)

        this.buttonClose.setName('Close')

        Phaser.Display.Align.In.RightCenter(this.buttonClose, this.title, 155, -12)

        this.title.add([title, this.buttonClose])

        this.popup.add(this.title)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup, 0, -2)
    }

    private createScoreBlock(): void {
        this.scoreBlock = this.scene.add.container()
        const background = this.scene.make.image({
            key: KEY,
            frame: FRAME.SCORE_PANEL,
        })

        background.setWorldSize(263, 70)

        this.scoreBlock.add(background)

        //
        this.scoreText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(85),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.scoreBlock.add(this.scoreText)

        Phaser.Display.Align.In.Center(this.scoreText, this.scoreBlock, 0, 4)

        this.popup.add(this.scoreBlock)

        Phaser.Display.Align.In.TopCenter(this.scoreBlock, this.popup, 0, -78)
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
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(44),
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
        this.createButtonPlay()
        this.createButtonJourney()
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

        this.playWithFriendsButton.setVisible(false)

        this.popup.add(this.playWithFriendsButton)

        Phaser.Display.Align.In.Center(this.playWithFriendsButton, this.bestScoreBlock, 0, 80)
    }

    private clickPlayWithFriends = (): void => {
        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(async () => {
            await this.scene.storage.dispatch(startMultiModeGameRandomFriends())
            Emitter.emit(GAME_EVENT.REPLAY)
        })
    }

    private createButtonPlay(): void {
        this.playButton = new PlayButton(this.scene)

        this.playButton.onClick = this.clickPlay

        this.playButton.setVisible(false)

        this.popup.add(this.playButton)

        Phaser.Display.Align.In.Center(this.playButton, this.bestScoreBlock, 0, 80)
    }

    private clickPlay = (): void => {
        this.runCloseAnimation()
        this.scene.storage.dispatch(startSingleModeGame())
        Emitter.emit(GAME_EVENT.REPLAY)
    }

    private createButtonJourney(): void {
        this.journeyButton = new Journey1Button(this.scene)

        this.journeyButton.onClick = this.clickJourney1

        this.popup.add(this.journeyButton)

        Phaser.Display.Align.In.Center(this.journeyButton, this.bestScoreBlock, 100, 80)
    }

    private clickJourney1 = (): void => {
        this.scene.scene.switch(SceneKeys.LEVEL_SCENE)
    }

    public runCloseAnimation(): void {
        console.log('Close popup your score')

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

    public runOpenAnimation(): void {
        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        console.log('WWWWWWWW ', this.popup.scale, this.popup.visible)

        this.runPopupEntrancesAnimation(0, 300)
        this.runPopupContentEntrancesAnimation(200, 300)
    }

    // Entrances animations
    private runPopupEntrancesAnimation(delay: number, duration: number): void {
        if (!this.popupShowUpAnimation) {
            this.popupShowUpAnimation = new ShowUpAnimation({
                targets: [this.popup],
                delay,
                duration,
                props: {
                    y: 0,
                    alpha: { start: 1, from: 1, to: 1 },
                    scale: { start: 0, from: 0, to: 1 },
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

    public updateScore(): void {
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
            this.setCurrentScore(0)
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
            },
        })
    }

    private setCurrentScore(value: number): void {
        this.scoreText.setText(`${value}`)
    }
}

export default PopupYourScore
