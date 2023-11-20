import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import Popup from '@/game/components/Popup'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import {
    clearLeaderboardData,
    requestLeaderboardData,
} from '@/modules/leader-boards/actions/leaderboards'
import { getPlayerEntryAsync } from '@/modules/leader-boards/api/leaderboards'
import {
    LEADERBOARD_TYPE_FRIEND,
    LEADERBOARD_TYPE_GLOBAL,
} from '@/modules/leader-boards/constants/LeaderboardsTypes'
import {
    getLeaderboardLeaders,
    getLeaderboardRequesting,
} from '@/modules/leader-boards/selectors/leaderboards'
import { sendException } from '@/utils/Sentry'
import FooterBar from './leader-board-screen/footer'
import Board from './leader-board-screen/main/Board'

const { LeadersBoard } = GameCore.Configs
const { KEY, FRAME } = SPRITES.DEFAULT

type TData = {
    bestScore: number
}

class LeaderBoardScreen extends GameCore.Screen {
    private popup: Popup

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    private board: Board
    private footerBar: FooterBar
    private isRequesting: boolean
    private isSwitchable: boolean
    private tabId: string
    private offset: number
    private isStateChanged: boolean

    constructor(scene: Phaser.Scene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.setVisible(false)

        this.createPopup()

        this.createTitle()

        this.createBoard()

        this.createFooterBar()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)

        if (this.scene.world.isLandscape()) {
            this.popup.setScale(this.popup.scale - 0.15)
        }
    }

    public open = (data: TData): void => {
        super.open(data)

        this.setVisible(true)

        this.selectWorldTab()

        this.runOpenAnimation()

        this.board.showLoading(true)

        const mapStateChange = [
            {
                selector: getLeaderboardRequesting,
                callback: (isRequesting: boolean) => {
                    this.isRequesting = isRequesting
                    this.board.showLoading(isRequesting)

                    if (isRequesting === false) {
                        if (!this.scene) return
                        if (!this.visible || !this.scene.scene.isActive) return

                        const state = this.scene.game.storage.getState()
                        const leaders = getLeaderboardLeaders(state)

                        this.isSwitchable = true

                        if (!leaders || Object.keys(leaders).length === 0) {
                            this.board.showMessage(true, this.scene.lang.Text.LEADERBOARD_EMPTY)
                        } else {
                            this.board.leaders.updateData(leaders, this.tabId)
                        }

                        this.updatePlayerEntryAsync().catch(sendException)
                    }
                },
            },
        ]

        this.handleStateChange(mapStateChange)
    }

    private handleStateChange(mapStateToCallback: SceneStateChange[]): void {
        if (this.isStateChanged) return

        mapStateToCallback.forEach((payload) => {
            const { selector, callback } = payload
            this.scene.storage.watch(selector, callback)
        })

        this.isStateChanged = true
    }

    private createPopup(): void {
        this.popup = new Popup(this.scene, 0, -5, 340, 510, {
            forceHeightTop: 60,
        })
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone, 0, -2)
    }

    private createTitle() {
        const titleContainer = this.scene.add.container()
        const imageScale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_LEADER_BOARD,
        })

        const { width, height } = text

        text.setWorldSize(width / imageScale, height / imageScale)

        const buttonClose = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)

        buttonClose.setName('Close')

        buttonClose.onClick = this.clickClose

        titleContainer.add([text, buttonClose])

        Phaser.Display.Align.In.Center(text, titleContainer, 0, 9)

        Phaser.Display.Align.In.Center(buttonClose, titleContainer, 160, -15)

        this.popup.add(titleContainer)

        Phaser.Display.Align.In.TopCenter(titleContainer, this.popup)
    }

    private createBoard(): void {
        this.board = new Board(this.scene)

        this.popup.add(this.board)

        Phaser.Display.Align.In.Center(this.board, this.popup, 0, -25)
    }

    private createFooterBar(): void {
        this.footerBar = new FooterBar(this.scene)

        this.popup.add(this.footerBar)

        Phaser.Display.Align.In.Center(this.footerBar, this.popup, 0, 178)
    }

    private handleSelectFriendTab = (): void => {
        if (this.isRequesting) return
        if (!this.isSwitchable) return

        this.selectFriendTab()
    }

    private handleSelectWorldTab = (): void => {
        if (this.isRequesting) return
        if (!this.isSwitchable) return

        this.selectWorldTab()
    }

    public selectFriendTab(): void {
        this.tabId = LEADERBOARD_TYPE_FRIEND
        this.offset = 0

        this.board.showLoading(true)
        this.board.leaders.removeLeaders()

        this.scene.storage.dispatch(clearLeaderboardData())
        this.scene.storage.dispatch(
            requestLeaderboardData(
                LeadersBoard.LeaderboardId,
                LEADERBOARD_TYPE_FRIEND,
                LeadersBoard.Limit,
                this.offset
            )
        )
    }

    public selectWorldTab(): void {
        this.tabId = LEADERBOARD_TYPE_GLOBAL
        this.offset = 0

        this.board.showLoading(true)
        this.board.leaders.removeLeaders()

        this.footerBar.myScoreBlock.setVisible(false)

        this.scene.storage.dispatch(clearLeaderboardData())
        this.scene.storage.dispatch(
            requestLeaderboardData(
                LeadersBoard.LeaderboardId,
                LEADERBOARD_TYPE_GLOBAL,
                LeadersBoard.Limit,
                this.offset
            )
        )
    }

    private clickClose = () => {
        this.runCloseAnimation()
    }

    private runCloseAnimation(): void {
        if (this.popupFadeOutAnimation?.tween?.isPlaying()) return

        // this.scene.audio.playSound(SOUND_EFFECT.POPUP_OFF, { volume: 0.6 })

        this.runPopupExitsAnimation(50, 200)
        this.runFadeOutMaskAnimation(0, 200)
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
                    this.board.showLoading(false)
                    this.close()
                },
            })
        }

        this.popupFadeOutAnimation?.play()
    }

    private runOpenAnimation(): void {
        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runFadeInMaskAnimation(100, 300)
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

    private async updatePlayerEntryAsync() {
        const playerId = this.scene.player.getPlayerId()
        const player = this.scene.player.getPlayer()
        let playerEntry = null
        try {
            playerEntry = (await getPlayerEntryAsync(playerId)) as GameSDK.LeaderboardEntry
        } catch (error) {
            playerEntry = null
        }

        let myInfo = {
            playerId: playerId,
            name: player.name,
            photo: player.photo,
            score: `${player.data.score || 0}`,
            rank: -1,
        }
        if (playerEntry) {
            myInfo = {
                playerId: playerId,
                name: player.name,
                photo: player.photo,
                score: `${playerEntry.getScore()}`,
                rank: playerEntry.getRank(),
            }
        }
        this.footerBar.updateMyScoreBlock({
            playerId: myInfo.playerId,
            rank: myInfo.rank,
            photo: myInfo.photo,
            name: myInfo.name,
            score: myInfo.score,
            backgroundFrame: FRAME.LEADERBOARD_BG_ITEM,
            isHighlight: true,
        })
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

export default LeaderBoardScreen
