import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import AvatarFrame from '@/game/components/AvatarFrame'
import Popup from '@/game/components/Popup'
import SPRITES from '@/game/constants/resources/sprites'
import HomeButton from '../../component/HomeButton'
import ShareButton from '../../component/ShareButton'
import PlayWithFriendsButton from '../../component/PlayWithFriendsButton'
import PlayButton from '../../component/PlayButton'
import Button from '@/game/components/Button'
import FONTS from '@/game/constants/resources/fonts'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import Emitter from '@/utils/emitter'
import { shareBestScore, shareGameResult, shareScore } from '@/redux/actions/share'
import { getGameplayStats } from '@/modules/match/selectors/stats'
import {
    getChallengeMatchOpponentInfo,
    getIsOpponentFinishChallengeMatch,
    getIsPlayerFinishChallengeMatch,
} from '@/modules/match/selectors/match'
import {
    listPlayerIds,
    startMultiModeGameRandomFriends,
    startSingleModeGame,
} from '@/modules/match/actions/gameplay'
import { SceneKeys } from '@/game/constants/scenes'
import GAME_EVENT from '@/game/gameplay/events/game'
import { getGameplayMode } from '@/modules/match/selectors/gameplay'
import { MATCH_MODE_TOURNAMENTS } from '@/modules/match/constants/GameModes'

const { KEY, FRAME } = SPRITES.DEFAULT

class PopupResult extends Phaser.GameObjects.Container {
    private popup: Popup
    private avatarMe: AvatarFrame
    private textScoreMe: Phaser.GameObjects.BitmapText
    private avatarOpponent: AvatarFrame
    private textScoreOpponent: Phaser.GameObjects.BitmapText
    private title: Phaser.GameObjects.Container
    private titleFrame: Phaser.GameObjects.Image
    private contents: Phaser.GameObjects.Group

    private popupShowUpAnimation: ShowUpAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeOutAnimation: FadeOutAnimation

    private myInfoBlock: Phaser.GameObjects.Container
    private tweenMyInfoBlock: Phaser.Tweens.Tween

    private opponentInfoBlock: Phaser.GameObjects.Container
    private tweenOpponentInfoBlock: Phaser.Tweens.Tween

    private icon: Phaser.GameObjects.Image
    private tweenIcon: Phaser.Tweens.Tween

    private iconCrown: Phaser.GameObjects.Image
    private tweenIconCrown: Phaser.Tweens.Tween

    private playWithFriendsButton: PlayWithFriendsButton
    private playButton: PlayButton
    private homeButton: HomeButton
    private shareButton: ShareButton

    public buttonClose: Button

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.createPopup()

        this.createPopupContent()
    }

    private createPopup(): void {
        this.popup = new Popup(this.scene, 0, 0, 290, 290, {
            forceHeightTop: 54,
        })

        this.add(this.popup)
    }

    private createPopupContent(): void {
        this.createTitle()
        this.createContentBackground()
        this.createMyInfoBlock()
        this.createOpponentInfoBlock()
        this.createIcon()
        this.createIconCrown()
        this.createButtons()

        this.popup.add([this.title])

        this.contents = this.scene.make.group({})

        this.contents.addMultiple([
            this.homeButton,
            this.playWithFriendsButton,
            this.playButton,
            this.shareButton,
        ])
    }

    public updateButtons(): void {
        try {
            const isExistConnectedPlayer = this.checkExistConnectedPlayerId()

            if (isExistConnectedPlayer) {
                this.playWithFriendsButton.setVisible(true)
                this.playButton.setVisible(false)
            } else {
                this.playWithFriendsButton.setVisible(false)
                this.playButton.setVisible(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    private createTitle(): void {
        this.title = this.scene.add.container()

        this.titleFrame = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_WAITING_OPPONENT,
        })

        this.titleFrame.setWorldSize(238, 25)

        Phaser.Display.Align.In.Center(this.titleFrame, this.title, 0, 10)

        this.buttonClose = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)

        this.buttonClose.setName('Close')

        Phaser.Display.Align.In.RightCenter(this.buttonClose, this.title, 155, -12)

        this.title.add([this.titleFrame, this.buttonClose])

        this.popup.add(this.title)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup, 0, -2)
    }

    private createContentBackground(): void {
        const background = this.scene.make.image({
            key: KEY,
            frame: FRAME.POPUP_CONTENT_BACKGROUND,
        })

        background.setWorldSize(263, 140)

        this.popup.add(background)

        Phaser.Display.Align.In.Center(background, this.popup, 0, -30)
    }

    private createButtons(): void {
        this.createButtonHome()
        this.createButtonPlayWithFriend()
        this.createButtonPlay()
        this.createButtonShare()
    }

    private createButtonHome(): void {
        this.homeButton = new HomeButton(this.scene)

        this.homeButton.onClick = this.clickHome.bind(this)

        this.popup.add(this.homeButton)

        Phaser.Display.Align.In.Center(this.homeButton, this.popup, -100, 80)
    }

    private clickHome(): void {
        this.scene.scene.switch(SceneKeys.DASHBOARD_SCENE)
    }

    private createButtonPlayWithFriend(): void {
        this.playWithFriendsButton = new PlayWithFriendsButton(this.scene)

        this.playWithFriendsButton.onClick = this.clickPlayWithFriends

        this.playWithFriendsButton.setVisible(false)

        this.popup.add(this.playWithFriendsButton)

        Phaser.Display.Align.In.Center(this.playWithFriendsButton, this.popup, 0, 80)
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

        Phaser.Display.Align.In.Center(this.playButton, this.popup, 0, 80)
    }

    private clickPlay = (): void => {
        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(async () => {
            await this.scene.storage.dispatch(startSingleModeGame())
            Emitter.emit(GAME_EVENT.REPLAY)
        })
    }

    private createButtonShare(): void {
        this.shareButton = new ShareButton(this.scene)

        this.shareButton.onClick = this.clickShare

        this.popup.add(this.shareButton)

        Phaser.Display.Align.In.Center(this.shareButton, this.popup, 100, 80)
    }

    private clickShare = (): void => {
        const state = this.scene.storage.getState()
        const gamePlayMode = getGameplayMode(state)

        if (gamePlayMode === MATCH_MODE_TOURNAMENTS) {
            this.scene.storage.dispatch(shareScore())
            return
        }

        this.scene.storage.dispatch(shareGameResult())
    }

    private createMyInfoBlock(): void {
        this.myInfoBlock = this.scene.add.container()

        this.avatarMe = new AvatarFrame(this.scene, {
            key: KEY,
            frame: FRAME.AVATAR_BORDER_BIG,
            background: FRAME.AVATAR_BACKGROUND,
            width: 87,
            height: 87,
            borderWidth: 8,
        })

        this.myInfoBlock.add(this.avatarMe)

        Phaser.Display.Align.In.Center(this.avatarMe, this.myInfoBlock, 0, 0)

        const bgScore = this.scene.make.image({
            key: KEY,
            frame: FRAME.SCORE_PANEL_DARK,
        })

        bgScore.setWorldSize(95, 26)

        this.myInfoBlock.add(bgScore)

        Phaser.Display.Align.In.BottomCenter(bgScore, this.avatarMe, 0, 10)

        this.textScoreMe = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(42),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.myInfoBlock.add(this.textScoreMe)

        Phaser.Display.Align.In.Center(this.textScoreMe, bgScore)

        this.popup.add(this.myInfoBlock)

        Phaser.Display.Align.In.Center(this.myInfoBlock, this.popup, -72, -38)

        this.myInfoBlock.setAlpha(0)

        this.tweenMyInfoBlock = this.scene.tweens.add({
            targets: this.myInfoBlock,
            paused: true,
            duration: 200,
            delay: 400,
            scale: {
                from: 1.5,
                to: 1,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: Phaser.Math.Easing.Bounce.Out,
        })
    }

    private createOpponentInfoBlock(): void {
        this.opponentInfoBlock = this.scene.add.container()

        this.avatarOpponent = new AvatarFrame(this.scene, {
            key: KEY,
            frame: FRAME.AVATAR_BORDER_BIG,
            background: FRAME.AVATAR_BACKGROUND,
            width: 87,
            height: 87,
            borderWidth: 8,
        })

        this.opponentInfoBlock.add(this.avatarOpponent)

        Phaser.Display.Align.In.Center(this.avatarOpponent, this.opponentInfoBlock, 0, 0)

        const bgScore = this.scene.make.image({
            key: KEY,
            frame: FRAME.SCORE_PANEL_DARK,
        })

        bgScore.setWorldSize(95, 26)

        this.opponentInfoBlock.add(bgScore)

        Phaser.Display.Align.In.BottomCenter(bgScore, this.avatarOpponent, 0, 10)

        this.textScoreOpponent = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(42),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.opponentInfoBlock.add(this.textScoreOpponent)

        Phaser.Display.Align.In.Center(this.textScoreOpponent, bgScore)

        this.popup.add(this.opponentInfoBlock)

        Phaser.Display.Align.In.Center(this.opponentInfoBlock, this.popup, 72, -38)

        this.opponentInfoBlock.setAlpha(0)

        this.tweenOpponentInfoBlock = this.scene.tweens.add({
            targets: this.opponentInfoBlock,
            paused: true,
            duration: 200,
            delay: 500,
            scale: {
                from: 1.5,
                to: 1,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: Phaser.Math.Easing.Bounce.Out,
        })
    }

    private createIcon(): void {
        this.icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_VS,
        })

        this.icon.setWorldSize(86, 16.5)

        const scale = this.icon.scale

        this.popup.add(this.icon)

        Phaser.Display.Align.In.Center(this.icon, this.popup, 0, -30)

        this.icon.setAlpha(0)

        this.tweenIcon = this.scene.tweens.add({
            targets: this.icon,
            paused: true,
            duration: 200,
            delay: 300,
            scale: {
                from: 1.5,
                to: scale,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: 'Power1',
        })
    }

    private createIconCrown(): void {
        this.iconCrown = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_CROWN_BIG,
        })

        this.iconCrown.setWorldSize(50, 46)

        this.iconCrown.setVisible(false)

        const scale = this.iconCrown.scale

        this.popup.add(this.iconCrown)

        this.iconCrown.setScale(0)

        this.tweenIconCrown = this.scene.tweens.add({
            targets: this.iconCrown,
            paused: true,
            duration: 200,
            delay: 300,
            scale: {
                from: 1.5,
                to: scale,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: 'Power1',
        })
    }

    public runCloseAnimation(): void {
        console.log('CLose popup result')

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

    private handleShareBestScore = (): void => {
        this.scene.storage.dispatch(shareBestScore())
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

    public updateInfo(): void {
        const scale = this.scene.world.getPixelRatio()
        const state = this.scene.storage.getState()
        const dataStats = getGameplayStats(state)
        const { playerId } = this.scene.player.getPlayer()
        const { playerId: opponentId } = getChallengeMatchOpponentInfo(state)
        //@ts-ignore
        const isPlayerFinish = getIsPlayerFinishChallengeMatch(state, { playerId })
        //@ts-ignore
        const isOpponentFinish = getIsOpponentFinishChallengeMatch(state, { opponentId })

        const { score: playerScore = 0 } = dataStats[playerId] || {}
        const { score: opponentScore = 0 } = dataStats[opponentId] || {}

        this.textScoreMe.setText(String(playerScore))

        this.textScoreOpponent.setText(String(opponentScore))

        if (!isPlayerFinish || !isOpponentFinish) {
            this.titleFrame.setFrame(FRAME.TEXT_WAITING_OPPONENT)
            this.titleFrame.setWorldSize(
                this.titleFrame.width / scale,
                this.titleFrame.width / scale
            )
            this.scene.audio.playSound(SOUND_EFFECT.WAIT_OPPONENT)

            return
        }

        if (playerScore === opponentScore) {
            this.titleFrame.setFrame(FRAME.TEXT_DRAW)
            this.titleFrame.setWorldSize(
                this.titleFrame.width / scale,
                this.titleFrame.width / scale
            )

            this.scene.audio.playSound(SOUND_EFFECT.DRAW)

            return
        }

        if (playerScore > opponentScore) {
            this.titleFrame.setFrame(FRAME.TEXT_WIN)
            this.titleFrame.setWorldSize(
                this.titleFrame.width / scale,
                this.titleFrame.width / scale
            )
            this.iconCrown.setVisible(true)

            Phaser.Display.Align.In.Center(this.iconCrown, this.avatarMe, -110, -80)

            this.scene.audio.playSound(SOUND_EFFECT.WIN)

            return
        }

        if (playerScore < opponentScore) {
            this.titleFrame.setFrame(FRAME.TEXT_LOSE)
            this.titleFrame.setWorldSize(
                this.titleFrame.width / scale,
                this.titleFrame.width / scale
            )
            this.iconCrown.setVisible(true)

            Phaser.Display.Align.In.Center(this.iconCrown, this.avatarOpponent, 35, -80)

            this.scene.audio.playSound(SOUND_EFFECT.LOSE)

            return
        }
    }

    public loadAvatars() {
        const state = this.scene.storage.getState()
        const { photo: playerPhoto, playerId } = this.scene.player.getPlayer()
        const { playerId: opponentId, photo: opponentPhoto } = getChallengeMatchOpponentInfo(state)

        this.avatarMe.loadPhoto(playerId, playerPhoto, 5)
        this.avatarOpponent.loadPhoto(opponentId, opponentPhoto, 5)
    }

    public runAnim() {
        this.icon.setVisible(true)
        this.myInfoBlock.setVisible(true)
        this.opponentInfoBlock.setVisible(true)
        this.iconCrown.setScale(0)

        this.tweenIconCrown.play()
        this.tweenIcon.play()
        this.tweenMyInfoBlock.play()
        this.tweenOpponentInfoBlock.play()
    }

    private checkExistConnectedPlayerId(): boolean {
        const players = this.scene.player.getConnectedPlayerIds(20, 0)
        const playersExcludeMe = players.filter((id) => {
            return id !== this.scene.player.getPlayerId()
        })

        console.log('players === ', playersExcludeMe, listPlayerIds)

        if (playersExcludeMe.length <= listPlayerIds.length) return false

        return true
    }
}

export default PopupResult
