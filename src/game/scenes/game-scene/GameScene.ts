import { AnalyticsEvents } from '@/constants/Analytics'
import { Events } from '@/game/constants'
import DEPTH_OBJECTS from '@/game/constants/depth'
import IMAGES from '@/game/constants/resources/images'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import { ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import TutorialManager from '@/game/gameplay/components/TutorialManager'
import GAME_EVENT from '@/game/gameplay/events/game'
import LeaderBoardScreen from '@/game/screens/LeaderBoardScreen'
import {
    requestFinishGame,
    resetRescued,
    showMiniJourney,
    useRescue,
} from '@/modules/match/actions/gameplay'
import { updateSingleMatchMove } from '@/modules/match/actions/match'
import { clearMatchDataStats, updateMatchCurrentStats } from '@/modules/match/actions/stats'
import {
    MATCH_MODE_CHALLENGE_FRIENDS,
    MATCH_MODE_MATCHING_GROUP,
    MATCH_MODE_SINGLE,
    MATCH_MODE_TOURNAMENTS,
} from '@/modules/match/constants/GameModes'
import {
    getGameplayMode,
    getGameplayRescued,
    getGameplayShowMiniJourney,
} from '@/modules/match/selectors/gameplay'
import {
    getChallengeMatchOpponentInfo,
    getIsOpponentFinishChallengeMatch,
    getIsPlayerFinishChallengeMatch,
    getSingleMatchData,
    getSingleMatchId,
} from '@/modules/match/selectors/match'
import { getGameplayCurrentStats } from '@/modules/match/selectors/stats'
import { requestTournament } from '@/modules/tournament/actions/tournament'
import { getCurrentGameMode } from '@/redux/selectors/context'
import Emitter from '@/utils/emitter'
import { sendException, sendExceptionWithScope } from '@/utils/Sentry'
import BaseScene from '../BaseScene'
import BestScoreGlareEffect from './common/BestScoreGlareEffect'
import LevelManager from './common/LevelManager'
import {
    CrossPiece,
    LinePiece,
    LPiece,
    PlusPiece,
    SquarePiece,
    TrapezoidPiece,
    TrianglePiece,
} from './common/Piece'
import TPiece from './common/Piece/TPiece'
import UPiece from './common/Piece/UPiece'
import { isGameOver } from './common/Piece/utils/board'
import {
    CROSS_PIECE_2,
    CROSS_PIECE_3,
    CROSS_PIECE_4,
    CROSS_PIECE_5,
    LINE_2_TYPE,
    LINE_3_TYPE,
    LINE_4_TYPE,
    LINE_5_TYPE,
    L_1_TYPE,
    L_3_TYPE,
    L_TYPE,
    PLUS_PIECE,
    SQUARE_1_TYPE,
    SQUARE_2_TYPE,
    SQUARE_3_TYPE,
    TRAPEZOID_TYPE,
    TRIANGLE_TYPE,
    T_PIECE,
    U_PIECE,
} from './constant/piece'
import EffectManager from './effects/EffectManager'
import LayoutManager from './layouts/LayoutManager'
import GameOverScreen from './screens/GameOverScreen'
import MiniJourneyScreen from './screens/MiniJourneyScreen'
import NextTargetScoreScreen from './screens/NextTargetScoreScreen'
import NoSpaceLeftScreen from './screens/NoSpaceLeftScreen'
import RescueScreen from './screens/RescueScreen'
import ScoreReachedScreen from './screens/ScoreReachedScreen'
import SettingScreen from './screens/SettingScreen'
import TargetScoreScreen from './screens/TargetScoreScreen'
import YourScoreScreen from './screens/YourScoreScreen'

const { Match, Network, Tutorial, Board, Ads } = GameCore.Configs

const { FRAME } = SPRITES.GAMEPLAY_32

class GameScene extends BaseScene {
    private lastTimeInputEnabled = 0
    public usedRescue = false

    // public bestScoreEffect: BestScoreEffect
    public bestScoreGlareEffect: BestScoreGlareEffect
    public bestScore = 0
    public isBestScoreScreenShowed: boolean
    public isGameOver: boolean
    private isShowedNextTargetScreen: boolean
    private piecesByFen: any
    private isGameError: boolean

    public gamePlayMode: string
    public isNextTarget = false

    // Manager
    public layoutManager: LayoutManager
    public tutorialManager: TutorialManager
    public effectManager: EffectManager
    public levelManager: LevelManager

    public preload(): void {
        this.events.on(Phaser.Scenes.Events.WAKE, this.run)
        this.events.on(Phaser.Scenes.Events.CREATE, this.run)
    }

    private run = (): void => {
        try {
            this.initManager()

            const state = this.storage.getState()
            const stateShowMiniJourney = getGameplayShowMiniJourney(state)

            if (stateShowMiniJourney === null) {
                this.storage.dispatch(showMiniJourney(false))
            }

            this.checkAndAddShortcut()

            this.ads.showBannerAdAsync().catch(sendException)

            if (this.tutorialManager.isValidForTutorial() || Tutorial.ForceUseTutorial) {
                this.handleStartTutorial()

                this.layoutManager.objects.main.praise.reset()

                this.player.incUserGuideDisplays()

                return
            }

            const mode = getGameplayMode(state)

            if (
                [
                    MATCH_MODE_MATCHING_GROUP,
                    MATCH_MODE_CHALLENGE_FRIENDS,
                    MATCH_MODE_TOURNAMENTS,
                ].indexOf(mode) >= 0
            ) {
                const playerId = this.player.getPlayerId()
                const { playerId: opponentId } = getChallengeMatchOpponentInfo(state)

                // @ts-ignore
                const isPlayerFinished = getIsPlayerFinishChallengeMatch(state, {
                    playerId,
                })

                // @ts-ignore
                const isOpponentFinish = getIsOpponentFinishChallengeMatch(state, { opponentId })

                if (isPlayerFinished && isOpponentFinish) {
                    this.screen.open(ScreenKeys.GAME_OVER_SCREEN)
                    return
                }
            }

            this.startGame()
        } catch (ex) {
            //
        }
    }

    public create = (): void => {
        super.create()

        this.createBackground(IMAGES.BACKGROUND.KEY)

        const playerScore = this.player.getBestScore()

        this.bestScore = playerScore

        this.createManager()

        this.createScreens()

        // this.createBestScoreEffect()

        this.createBestScoreGlareEffect()

        this.createInput()

        this.listenEvents()

        this.input.setTopOnly(true)

        this.preLoadAds()
    }

    private preLoadAds() {
        this.ads.preloadInterstitialAdAsync().catch((ex) => console.log(ex))
        this.ads.preloadRewardedVideoAsync().catch((ex) => console.log(ex))
    }

    private createBestScoreGlareEffect(): void {
        this.bestScoreGlareEffect = new BestScoreGlareEffect(this)

        this.bestScoreGlareEffect.setDepth(DEPTH_OBJECTS.ON_TOP)

        Phaser.Display.Align.In.Center(this.bestScoreGlareEffect, this.gameZone)
    }

    private createManager(): void {
        // ? create before all manager
        this.layoutManager = new LayoutManager(this)

        this.tutorialManager = new TutorialManager(this)
        this.effectManager = new EffectManager(this)
        this.levelManager = new LevelManager()
    }

    private initManager(): void {
        // ! don't change order
        // ? init after all manager
        this.layoutManager.init()

        this.tutorialManager.init()
        this.effectManager.init()
    }

    private createInput(): void {
        if (this.isGameOver) return

        const { header } = this.layoutManager.objects

        header.buttonSetting.onClick = this.handlePauseGame
    }

    private createScreens(): void {
        this.createSettingScreen()
        this.createRescueScreen()
        this.createGameOverScreen()
        this.createYourScoreScreen()
        this.createScoreReachedScreen()
        this.createNextTargetScoreScreen()
        this.createNoSpaceLeftScreen()
        this.createTargetScoreScreen()
        this.createLeaderboardScreen()
        this.createMiniJourneyScreen()
    }

    private createLeaderboardScreen(): void {
        this.screen.add(ScreenKeys.LEADER_BOARD_SCREEN, LeaderBoardScreen)
    }

    private createMiniJourneyScreen(): void {
        this.screen.add(ScreenKeys.MINI_JOURNEY_SCREEN, MiniJourneyScreen)
    }

    private createTargetScoreScreen(): void {
        this.screen.add(ScreenKeys.TARGET_SCORE_SCREEN, TargetScoreScreen)
    }

    private createNoSpaceLeftScreen(): void {
        this.screen.add(ScreenKeys.NO_SPACE_LEFT_SCREEN, NoSpaceLeftScreen)
    }

    private createNextTargetScoreScreen() {
        this.screen.add(ScreenKeys.NEXT_TARGET_SCORE_SCREEN, NextTargetScoreScreen)
    }

    private createScoreReachedScreen() {
        this.screen.add(ScreenKeys.SCORE_REACHED_SCREEN, ScoreReachedScreen)
    }

    private createYourScoreScreen() {
        this.screen.add(ScreenKeys.YOUR_SCORE_SCREEN, YourScoreScreen)
    }

    private createSettingScreen(): void {
        this.screen.add(ScreenKeys.SETTINGS_SCREEN, SettingScreen)
    }

    private closeSettingScreen = (): void => {
        const { screen } = this
        screen.close(ScreenKeys.SETTINGS_SCREEN)
    }

    private closeGameOverScreen = (): void => {
        const { screen } = this
        screen.close(ScreenKeys.GAME_OVER_SCREEN)
    }

    public handlePauseGame = (): void => {
        if (this.isGameOver || this.checkReachTargetScore()) return

        const { screen } = this
        screen.open(ScreenKeys.SETTINGS_SCREEN)
    }

    public startGame(): void {
        try {
            const { header, footer } = this.layoutManager.objects

            this.isGameOver = false

            this.tutorialManager.skipTutorial()

            this.closeSettingScreen()

            this.closeGameOverScreen()

            this.handleUsedRescue()

            this.restartGame()

            header.setVisible(true)

            if (this.world.isLandscape()) {
                footer.buttonSetting.setVisible(true)
            }

            header.progressBar.reset()

            this.handleGameModeUI()

            this.updateCurrentBestScore()

            this.updateLevelManager()

            this.updateProgressBar()

            header.buttonSetting.setDisabled(true)

            this.time.delayedCall(300, () => {
                header.buttonSetting.setDisabled(false)
            })

            this.openTargetScoreScreen()

            this.handleGameModeChange()
        } catch (error) {
            if (!this.isGameError) {
                this.isGameError = true
                this.replay()
            }

            sendExceptionWithScope(new Error('Start game scene'), {
                error,
                scene: 'GameScene',
            })
        }
    }

    private handleGameModeChange() {
        const mapStateChange = [
            {
                selector: getGameplayMode,
                callback: (gameMode: string) => {
                    if (gameMode === this.gamePlayMode) return

                    this.handleGameModeUI()
                },
            },
        ]

        this.handleStateChange(mapStateChange)
    }

    private handleGameModeUI() {
        const state = this.storage.getState()
        this.gamePlayMode = getGameplayMode(state)

        if (!this.gamePlayMode || this.gamePlayMode === MATCH_MODE_SINGLE) {
            this.handleStartGameSingleMode()
        } else if (
            [
                MATCH_MODE_MATCHING_GROUP,
                MATCH_MODE_CHALLENGE_FRIENDS,
                MATCH_MODE_TOURNAMENTS,
            ].indexOf(this.gamePlayMode) >= 0
        ) {
            this.handleStartGameFriendMode()
        } else {
            this.handleStartGameSingleMode()
        }
    }

    public startGameAfterTargetScoreScreenClose(): void {
        const { main, footer } = this.layoutManager.objects
        const state = this.storage.getState()
        const gamePlayMode = getGameplayMode(state)
        const { level, score, levelName } = this.getLevelLogInfo()
        this.analytics.levelStart(level, score, levelName)

        if (this.levelManager.getCurrentIndex() > 0) {
            main.board.handleTweenStartMission()
        }

        if (
            [
                MATCH_MODE_MATCHING_GROUP,
                MATCH_MODE_CHALLENGE_FRIENDS,
                MATCH_MODE_TOURNAMENTS,
            ].indexOf(gamePlayMode) >= 0
        ) {
            footer.pieces.showNewPieces()
            return
        }

        if (this.piecesByFen) {
            footer.pieces.showAvailablePieces(this.piecesByFen)
            return
        }

        footer.pieces.showNewPieces()
    }

    private openTargetScoreScreen(): void {
        this.disableInput()
        this.time.delayedCall(500, () => {
            this.enableInput()

            this.screen.open(ScreenKeys.TARGET_SCORE_SCREEN, {
                duration: 1500,
            })
        })
        // this.time.delayedCall(2000, () => {
        //     this.main.board.handleTweenStartMission()
        // })
    }

    private handleUsedRescue(): void {
        if (!this.usedRescue) return

        this.storage.dispatch(useRescue())
    }

    private handleStartTutorial() {
        // const { player } = window.game

        // if (player.getPlayerIsNew()) {
        //     player.setLogged()
        // }

        const { header, footer } = this.layoutManager.objects

        this.analytics.event(AnalyticsEvents.TUTORIAL_BEGIN)

        this.tutorialManager.start()

        header.setVisible(false)
        footer.buttonSetting.setVisible(false)
    }

    private handleStartGameSingleMode(): void {
        const { main, footer, header } = this.layoutManager.objects
        let state = this.storage.getState()
        const matchSingleData = getSingleMatchData(state)?.data || {}
        let score = getSingleMatchData(state)?.score || 0

        if (!matchSingleData) return

        const { fen } = matchSingleData

        let boardByFen = null
        this.piecesByFen = null

        if (fen) {
            const board = main.board.getBoardByFen(fen)

            boardByFen = this.handleDynamicFenSize(board)
            this.piecesByFen = footer.pieces.getPiecesByFen(fen)

            if (this.isFenGameOver(boardByFen, this.piecesByFen)) {
                boardByFen = null
                this.piecesByFen = null

                this.storage.dispatch(clearMatchDataStats())

                state = this.storage.getState()
                score = 0

                this.resetRescuedGame()
            }
        }

        main.board.clearBoard()

        if (boardByFen) {
            main.board.startGame(boardByFen)
        }

        footer.pieces.clearPieces()

        // if (piecesByFen) {
        //     this.footer.pieces.showAvailablePieces(piecesByFen)
        // } else {
        //     this.footer.pieces.showNewPieces()
        // }

        // Header
        header.showItemSingleMode()
        header.mainScoreBlock.setScore(score)
        header.mainScoreBlock.setScoreText(score)

        // Main
        main.praise.reset()
    }

    private handleStartGameFriendMode(): void {
        const { header, main, footer } = this.layoutManager.objects
        // Header
        header.showItemPlayWithFriendsMode()
        header.myScoreBlock.updateInfo()
        header.opponentScoreBlock.updateInfo()

        // Main
        main.praise.reset()
        main.board.clearBoard()

        // Footer
        footer.pieces.clearPieces()
        // this.footer.pieces.showNewPieces()
    }

    private listenEvents() {
        Emitter.on(GAME_EVENT.START_GAME, () => {
            this.startGame()
        })
        Emitter.on(GAME_EVENT.RESCUE, this.rescued)
        Emitter.on(GAME_EVENT.REPLAY, this.replay)
        Emitter.on(GAME_EVENT.GAME_OVER, this.handleGameOver.bind(this))
        Emitter.on(Events.HANDLE_STATE_CHANGE, this.handleStateChange.bind(this))
    }

    private handleShowInterstitialAd = async (postSessionScore = true): Promise<void> => {
        const { globalScene, lang } = this.game

        try {
            this.audio.muteAll()
            this.audio.pauseMusic()

            if (!this.ads.canbeShowInterstitialAd()) return

            globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                message: lang.Text.LOADING_AD,
                duration: Network.Timeout,
                loading: true,
            })

            await this.ads.showInterstitialAdAsync()

            this.analytics.showInterstitialAd(this.getSceneName())
        } catch (ex) {
            return
        } finally {
            globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)

            if (postSessionScore) {
                this.postSessionScore()
            }

            this.audio.unmuteAll()
            this.audio.playMusic()

            this.ads.preloadInterstitialAdAsync().catch(sendException)
        }
    }

    public postSessionScore(): void {
        const state = this.storage.getState()
        const { score = 0 } = getGameplayCurrentStats(state)

        this.storage.dispatch(requestTournament(score))
    }

    private getFen() {
        const { main, footer } = this.layoutManager.objects
        const fenBoard = main.board.getFenByBoard()
        const fenPieces = footer.pieces.getFenByPieces()

        return `${fenBoard} ${fenPieces}`
    }

    private createRescueScreen() {
        this.screen.add(ScreenKeys.RESCUE_SCREEN, RescueScreen)
    }

    private createGameOverScreen() {
        this.screen.add(ScreenKeys.GAME_OVER_SCREEN, GameOverScreen)
    }

    private updateCurrentBestScore(): void {
        const { header } = this.layoutManager.objects
        const playerBestScore = this.player.getBestScore() || 0

        const state = this.storage.getState()
        const { score = 0, bestScore: currentBestScore = 0 } = getGameplayCurrentStats(state)

        let bestScore = playerBestScore > currentBestScore ? playerBestScore : currentBestScore

        bestScore = bestScore > score ? bestScore : score

        this.player.setBestScore(bestScore)

        header.bestScoreBlock.setScoreText(bestScore)
    }

    private updateLevelManager(): void {
        const score = this.getCurrentScoreByMode()
        this.levelManager.updateCurrentLevelByScore(score)
    }

    private updateProgressBar(): void {
        const { header } = this.layoutManager.objects
        const score = this.getCurrentScoreByMode()
        const targetScore = this.levelManager.updateCurrentLevelByScore(score)

        header.progressBar.setTargetScore(targetScore)
        header.progressBar.setPercent(score / targetScore)
    }

    private rescued = (): void => {
        try {
            const { main } = this.layoutManager.objects
            const { level, score, levelName } = this.getLevelLogInfo()
            this.analytics.levelRescue(level, score, levelName)

            main.board.rescue()

            this.nextLevel()

            this.usedRescue = true
        } catch (ex) {
            //
        }
    }

    private replay = (): void => {
        this.restartGame()
        this.startGame()

        // this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
        //     this.input.off(Phaser.Input.Events.POINTER_DOWN)
        // })
    }

    public setIsGameOver(isGameOver: boolean): void {
        this.isGameOver = isGameOver
    }

    public handleGameOver() {
        this.isGameOver = true
        const { level, score, levelName } = this.getLevelLogInfo()
        this.analytics.levelFail(level, score, levelName)

        this.screen.open(ScreenKeys.GAME_OVER_SCREEN)
    }

    public handleRequestFinishGame() {
        this.isGameOver = true

        const state = this.storage.getState()
        const gameRescuedCount = getGameplayRescued(state)

        if (gameRescuedCount < Match.MaxRescueCount) {
            this.ads.preloadRewardedVideoAsync().catch((ex) => console.log(ex))
        }

        this.screen.open(ScreenKeys.NO_SPACE_LEFT_SCREEN, {
            duration: 3000,
            onClose: () => {
                this.enableInput()

                if (gameRescuedCount < Match.MaxRescueCount && Ads.Enabled) {
                    this.screen.open(ScreenKeys.RESCUE_SCREEN)
                    this.isGameOver = false

                    return
                }

                this.usedRescue = false

                this.endGame()
            },
        })
    }

    private checkAnimPlaying() {
        const list = this.tweens.getAllTweens()

        if (!list || list.length === 0) return false

        return true
    }

    public disableInput() {
        const { footer } = this.layoutManager.objects
        this.input.enabled = false
        footer.pieces.allPieces.forEach((p) => p.cancelDrag())
    }

    public enableInput() {
        this.input.enabled = true
    }

    public restartGame() {
        const { header, main } = this.layoutManager.objects

        this.usedRescue = false

        header.mainScoreBlock.addScore?.stop().remove()
        header.mainScoreBlock.setScore(0)
        header.mainScoreBlock.setScoreText(0)

        header.myScoreBlock.setScore(0)
        header.myScoreBlock.setScoreText(0)

        header.progressBar.hideProgressBar()
        // this.header.progressBar.hideMilestone()
        // this.header.progressBar.resetListMilestone()
        header.progressBar.setPercent(0)

        this.levelManager.restart()

        main.praise.listScore = []
    }

    public async endGame(): Promise<void> {
        await this.handleShowInterstitialAd(false).catch(sendException)

        this.storage.dispatch(requestFinishGame())

        this.resetRescuedGame()
    }

    public handleUpdateScore(score: number) {
        if (this.tutorialManager.isRunning()) return

        const totalScore = this.getCurrentScoreByMode() + score

        this.storage.dispatch(updateMatchCurrentStats({ score: totalScore }))

        this.updateMatchData()
    }

    public handleAddScoreAnim(score: number) {
        const { header } = this.layoutManager.objects
        const state = this.storage.getState()
        const gamePlayMode = getGameplayMode(state)

        if (this.tutorialManager.isRunning()) {
            header.mainScoreBlock.animAddScore(score)
            return
        }

        if (!gamePlayMode || gamePlayMode === MATCH_MODE_SINGLE) {
            header.mainScoreBlock.animAddScore(score)
        } else if (
            [
                MATCH_MODE_MATCHING_GROUP,
                MATCH_MODE_CHALLENGE_FRIENDS,
                MATCH_MODE_TOURNAMENTS,
            ].indexOf(gamePlayMode) >= 0
        ) {
            header.myScoreBlock.animAddScore(score)
        } else {
            header.mainScoreBlock.animAddScore(score)
        }
    }

    public getBestScore(): number {
        const state = this.storage.getState()
        const gamePlayCurrentStats = getGameplayCurrentStats(state)
        const { bestScore } = gamePlayCurrentStats

        return bestScore
    }

    public bestScoreReached(): void {
        if (this.isBestScoreScreenShowed || this.isGameOver) return

        const bestScore = this.getBestScore()
        const score = this.getCurrentScoreByMode()

        if (!bestScore || bestScore >= score) return

        this.player.setBestScore(score)

        this.isBestScoreScreenShowed = true

        this.audio.playSound(SOUND_EFFECT.CONGRATULATION)

        this.bestScoreGlareEffect.playEffect()
    }

    public updateProgressTargetScore(score: number): void {
        const { header } = this.layoutManager.objects
        const targetScore = header.progressBar.getTargetScore()
        const percent = score / targetScore

        header.progressBar.setPercent(percent)
    }

    public checkReachTargetScore() {
        const { header } = this.layoutManager.objects
        const currentScore = this.getCurrentScoreByMode()
        const targetScore = header.progressBar.getTargetScore()
        return currentScore >= targetScore
    }

    private handleCloseBannerAds = (): void => {
        this.ads.hideBannerAdAsync().catch((error) => {
            console.warn(error)
        })
    }

    public handleNextTargetScore(): void {
        if (this.isGameOver) return

        const reachTargetScore = this.checkReachTargetScore()

        if (!reachTargetScore || this.isShowedNextTargetScreen) return

        this.isShowedNextTargetScreen = true

        this.disableInput()

        const { level, score, levelName } = this.getLevelLogInfo()
        this.analytics.levelComplete(level, score, levelName)

        this.screen.open(ScreenKeys.SCORE_REACHED_SCREEN, {
            duration: 4000,
            onClose: async () => {
                this.isShowedNextTargetScreen = false
                await this.handleShowInterstitialAd(false).catch(sendException)
                this.showNextTargetScreen()
            },
        })
    }

    public getCurrentScoreByMode(): number {
        let score = 0
        const state = this.storage.getState()
        const gamePlayMode = getGameplayMode(state)
        const { header } = this.layoutManager.objects

        if (!gamePlayMode || gamePlayMode === MATCH_MODE_SINGLE) {
            score = header.mainScoreBlock.score
        } else if (
            [
                MATCH_MODE_MATCHING_GROUP,
                MATCH_MODE_CHALLENGE_FRIENDS,
                MATCH_MODE_TOURNAMENTS,
            ].indexOf(gamePlayMode) >= 0
        ) {
            score = header.myScoreBlock.score
        } else {
            score = header.mainScoreBlock.score
        }

        return score
    }

    private showNextTargetScreen(): void {
        const score = this.getCurrentScoreByMode()
        const targetScore = this.levelManager.updateCurrentLevelByScore(score)

        console.log('wwwwwwwwwwww ', score, targetScore)

        this.screen.open(ScreenKeys.NEXT_TARGET_SCORE_SCREEN)
    }

    public updateMatchData() {
        if (this.tutorialManager.isRunning()) return

        const fen = this.getFen()
        const state = this.storage.getState()
        const matchData = getSingleMatchData(state).data || {}
        const gamePlayMode = getGameplayMode(state)
        const rescued = getGameplayRescued(state)

        if (gamePlayMode && gamePlayMode !== MATCH_MODE_SINGLE) return

        const singleMatchId = getSingleMatchId(state)
        const { score = 0 } = getGameplayCurrentStats(state)

        this.storage.dispatch(
            updateSingleMatchMove(singleMatchId, {
                score,
                rescued,
                data: { ...matchData, fen },
                updateAt: Date.now(),
            })
        )
    }

    public nextLevel(): void {
        const { header } = this.layoutManager.objects
        const score = this.getCurrentScoreByMode()
        const targetScore = this.levelManager.updateCurrentLevelByScore(score)

        console.log('wwwwwwwwwwww ', score, targetScore)

        this.isNextTarget = true

        header.progressBar.hideProgressBar()
        header.progressBar.setTargetScore(targetScore)
        header.progressBar.setPercent(score / targetScore)
        const { level, levelName } = this.getLevelLogInfo()
        this.analytics.levelStart(level, score, levelName)
    }

    update(time: number) {
        // Auto enable input
        if (this.input.enabled || this.checkAnimPlaying()) {
            this.lastTimeInputEnabled = time
            return
        }

        if (time - this.lastTimeInputEnabled >= 3000) {
            this.enableInput()

            this.lastTimeInputEnabled = time
        }
    }

    isFenGameOver(board: any, pieces: any) {
        // 1. init pieces
        const newPieces = []
        for (let i = 0; i < pieces.length; i++) {
            const { type, direction, isReverse } = pieces[i]
            switch (type) {
                case L_TYPE:
                case L_1_TYPE:
                case L_3_TYPE: {
                    newPieces.push({
                        data: LPiece.getData(type, direction, isReverse),
                    })
                    break
                }
                case LINE_2_TYPE:
                case LINE_3_TYPE:
                case LINE_4_TYPE:
                case LINE_5_TYPE: {
                    newPieces.push({
                        data: LinePiece.getData(type, direction),
                    })
                    break
                }
                case SQUARE_1_TYPE:
                case SQUARE_2_TYPE:
                case SQUARE_3_TYPE: {
                    newPieces.push({
                        data: SquarePiece.getData(type),
                    })
                    break
                }
                case TRIANGLE_TYPE: {
                    newPieces.push({
                        data: TrianglePiece.getData(direction),
                    })
                    break
                }
                case T_PIECE: {
                    newPieces.push({
                        data: TPiece.getData(direction),
                    })
                    break
                }
                case U_PIECE: {
                    newPieces.push({
                        data: UPiece.getData(direction),
                    })
                    break
                }
                case CROSS_PIECE_2:
                case CROSS_PIECE_3:
                case CROSS_PIECE_4:
                case CROSS_PIECE_5: {
                    newPieces.push({
                        data: CrossPiece.getData(type, direction),
                    })
                    break
                }
                case TRAPEZOID_TYPE: {
                    newPieces.push({
                        data: TrapezoidPiece.getData(direction),
                    })
                    break
                }
                case PLUS_PIECE: {
                    newPieces.push({
                        data: PlusPiece.getData(),
                    })
                    break
                }
                default: {
                    break
                }
            }
        }

        // 2. check is game over
        return isGameOver(board, newPieces)
    }

    public handleDynamicFenSize(board: any) {
        let boardRows = 0
        let boardCols = 0

        boardRows = board.length

        if (boardRows) {
            boardCols = board[0].length
        }

        if (boardRows === 0 || boardCols === 0) {
            return board
        }

        const result = [...board]

        if (boardRows > Board.rows) {
            result.splice(Board.rows, boardRows - Board.rows)
        } else if (boardCols < Board.rows) {
            for (let i = 0; i < Board.rows - boardRows; i++) {
                result.push(
                    new Array(boardRows).fill({
                        value: 0,
                        frame: FRAME.GEM_TRANSPARENT,
                    })
                )
            }
        }

        if (boardCols > Board.cols) {
            result.forEach((item) => {
                item.splice(Board.cols, boardCols - Board.cols)
            })
        } else if (boardCols < Board.cols) {
            result.forEach((item) => {
                for (let i = 0; i < Board.cols - boardCols; i++) {
                    item.push({
                        value: 0,
                        frame: FRAME.GEM_TRANSPARENT,
                    })
                }
            })
        }

        return result
    }

    public checkAndAddShortcut(): void {
        const player = this.game.player.getPlayer()
        if (player.isUserNew) return

        const state = this.storage.getState()
        const gameMode = getCurrentGameMode(state)

        // ? not call when mode is tournament (fix PENDING REQUEST)
        if (gameMode == MATCH_MODE_TOURNAMENTS) return

        this.facebook.attemptToAddShortcut()
    }

    private getLevelName() {
        const level = this.levelManager.getCurrentIndex() + 1
        const levelWithPadding = GameCore.Utils.Number.padStart(level, 4, '0')
        return `target_${levelWithPadding}`
    }

    private getLevelLogInfo() {
        const level = this.levelManager.getCurrentIndex() + 1
        const score = this.getCurrentScoreByMode()
        const levelName = this.getLevelName()
        return { level, score, levelName }
    }

    private resetRescuedGame(): void {
        this.storage.dispatch(resetRescued())
    }
}

export default GameScene

if (import.meta.hot) {
    import.meta.hot.accept(GameCore.LiveUpdate.Scene(SceneKeys.GAME_SCENE))
}
