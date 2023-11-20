import { SampleOpponent } from '@/constants/SampleOpponent'
import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth, ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import ConfettiSmallFallDown from '@/game/effects/ConfettiSmallFallDown'
import GAME_EVENT from '@/game/gameplay/events/game'
import { startSingleModeGame } from '@/modules/match/actions/gameplay'
import {
    MATCH_MODE_CHALLENGE_FRIENDS,
    MATCH_MODE_MATCHING_GROUP,
    MATCH_MODE_SINGLE,
    MATCH_MODE_TOURNAMENTS,
} from '@/modules/match/constants/GameModes'
import { getGameplayMode } from '@/modules/match/selectors/gameplay'
import { getChallengeMatchId, getChallengeMatchOpponentInfo } from '@/modules/match/selectors/match'
import { getGameplayCurrentStats, getGameplayStats } from '@/modules/match/selectors/stats'
import Emitter from '@/utils/emitter'
import GameScene from '..'
import PopupResult from './game-over-screen/popup/PopupResult'
import PopupYourScore from './game-over-screen/popup/PopupYourScore'

const { LeadersBoard } = GameCore.Configs
const { KEY, FRAME } = SPRITES.DEFAULT

class GameOverScreen extends GameCore.Screen {
    private bestScore: number
    private currentScore: number
    private confettiLeftEffect: ConfettiSmallFallDown
    private confettiRightEffect: ConfettiSmallFallDown
    private queueScreens: string[] = []
    private popupYourScore: PopupYourScore
    private popupResult: PopupResult
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    constructor(scene: GameScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.createConfettiSmallAnimation()
        this.createPopups()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)
    }

    public open = (): void => {
        super.open()

        this.popupYourScore.setVisible(false)
        this.popupResult.setVisible(false)

        this.runFadeInMaskAnimation(100, 300)

        this.initScore()

        this.updateScore()

        this.showPopupYourScore()

        this.scene.audio.playSound(SOUND_EFFECT.GAME_OVER_SCENE)
    }

    private showQueueScreens(): void {
        const screenName = this.queueScreens.pop()

        if (!screenName) return

        switch (screenName) {
            case ScreenKeys.RESULT_SCREEN:
                this.showPopupResult()

                break
        }
    }
    private showPopupBestScore(): void {
        return
        const state = this.scene.storage.getState()
        const gamePlayCurrentStats = getGameplayCurrentStats(state)
        const { score } = gamePlayCurrentStats

        if (!score) return

        if (score <= this.bestScore) return

        this.scene.screen.open(ScreenKeys.BEST_SCORE_SCREEN, { bestScore: score })
    }

    private showPopupYourScore(): void {
        // const state = this.scene.storage.getState()
        // const gamePlayCurrentStats = getGameplayCurrentStats(state)
        // const { score } = gamePlayCurrentStats
        // if (score > this.bestScore) return
        this.popupYourScore.setVisible(true)
        this.popupYourScore.runOpenAnimation()
        this.popupYourScore.updateButtons()
        this.popupYourScore.updateScore()
    }

    private showPopupResult(): void {
        this.popupResult.setVisible(true)
        this.popupResult.runOpenAnimation()
        this.popupResult.updateInfo()
        this.popupResult.loadAvatars()
        this.popupResult.updateButtons()
        this.popupResult.runAnim()
    }

    private updateQueueScreens(): void {
        this.updateQueueResultScreen()
    }

    private updateQueueResultScreen(): void {
        // this.queueScreens.push(ScreenKeys.RESULT_SCREEN)
        // return

        const state = this.scene.storage.getState()
        const gameplayMode = getGameplayMode(state)

        if (
            [
                MATCH_MODE_CHALLENGE_FRIENDS,
                MATCH_MODE_MATCHING_GROUP,
                MATCH_MODE_TOURNAMENTS,
            ].indexOf(gameplayMode) === -1
        )
            return

        const matchId = getChallengeMatchId(state)

        if (!matchId) return

        const opponentInfo = getChallengeMatchOpponentInfo(state)
        const { playerId: opponentId } = opponentInfo

        // Only show result scene when play with a real opponent
        if (gameplayMode === MATCH_MODE_MATCHING_GROUP && opponentId === SampleOpponent.playerId)
            return

        this.queueScreens.push(ScreenKeys.RESULT_SCREEN)
    }

    private createPopups(): void {
        this.createPopupYourScore()
        this.createPopupResult()
    }

    private createPopupYourScore(): void {
        this.popupYourScore = new PopupYourScore(this.scene)

        this.popupYourScore.setVisible(false)

        this.popupYourScore.buttonClose.onClick = this.onPopupClose

        this.add(this.popupYourScore)

        Phaser.Display.Align.In.Center(this.popupYourScore, this, 0, 0)
    }

    private onPopupClose = () => {
        this.popupYourScore?.runCloseAnimation()

        this.popupResult?.runCloseAnimation()

        this.runFadeOutMaskAnimation(0, 200)

        this.scene.time.delayedCall(300, () => {
            this.close()

            this.scene.screen.open(ScreenKeys.MINI_JOURNEY_SCREEN, {
                onClose: () => {
                    this.scene.storage.dispatch(startSingleModeGame())

                    Emitter.emit(GAME_EVENT.START_GAME)
                },
            })
        })
    }

    private createPopupResult(): void {
        this.popupResult = new PopupResult(this.scene)

        this.popupResult.setVisible(false)

        this.popupResult.buttonClose.onClick = this.onPopupClose

        this.add(this.popupResult)

        Phaser.Display.Align.In.Center(this.popupResult, this, 0, -61)
    }

    private createConfettiSmallAnimation(): void {
        this.confettiLeftEffect = new ConfettiSmallFallDown(this.scene, {
            speedX: {
                min: -20,
                max: 100,
            },
            rotate: { start: -360 * 3, end: 0 },
        })

        this.confettiRightEffect = new ConfettiSmallFallDown(this.scene, {
            speedX: {
                min: 20,
                max: -100,
            },
            rotate: { start: 0, end: 360 * 3 },
        })

        this.confettiLeftEffect.setDepth(DEPTH_OBJECTS.ON_TOP)
        this.confettiRightEffect.setDepth(DEPTH_OBJECTS.ON_TOP)
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

        this.bestScore = bestScore

        if (score === undefined || bestScore === undefined) {
            const gamePlayStats = getGameplayStats(state)
            const playerStats = gamePlayStats[this.scene.player.getPlayerId()]

            score = playerStats?.score || 0
            bestScore = this.scene.player.getBestScore()
        }

        this.bestScore = (bestScore || 0) < this.bestScore ? this.bestScore : bestScore || 0
        this.currentScore = score
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

export default GameOverScreen
