import BaseScene from '../BaseScene'
import { SceneKeys } from '@/game/constants/scenes'
import { ScreenKeys } from '@/game/constants/screens'
import {
    completeJourneyDailyChallengeMode,
    updateJourneyMatchMove,
    updateMatchDataJourney,
    updateMatchJourneyLevel,
    updateMatchJourneyScore,
} from '@/modules/match/actions/match'

import {
    getJourneyChallengeMode,
    getJourneyMatchData,
    getJourneyMatchId,
    getJourneyMatchScore,
} from '@/modules/match/selectors/match'
import { getGameplayCurrentStats } from '@/modules/match/selectors/stats'
import { getGameplayShowMiniJourney } from '@/modules/match/selectors/gameplay'
import {
    CROSS_PIECE_2_TYPE,
    CROSS_PIECE_3_TYPE,
    CROSS_PIECE_4_TYPE,
    CROSS_PIECE_5_TYPE,
    LINE_2_TYPE,
    LINE_3_TYPE,
    LINE_4_TYPE,
    LINE_5_TYPE,
    L_1_TYPE,
    L_3_TYPE,
    L_TYPE,
    PLUS_PIECE_TYPE,
    SQUARE_1_TYPE,
    SQUARE_2_TYPE,
    SQUARE_3_TYPE,
    TRAPEZOID_TYPE,
    TRIANGLE_TYPE,
    T_PIECE_TYPE,
    U_PIECE_TYPE,
} from './constant/piece'
import {
    CrossPiece,
    LinePiece,
    LPiece,
    PlusPiece,
    SquarePiece,
    TrapezoidPiece,
    TrianglePiece,
} from './common/Piece'
import { isGameOver } from './common/Piece/utils/board'
import SPRITES from '@/game/constants/resources/sprites'
import TPiece from './common/Piece/TPiece'
import UPiece from './common/Piece/UPiece'
import IMAGES from '@/game/constants/resources/images'
import LevelManager from './manager/LevelManager'
import MapManager from './manager/MapManager'
import TargetMissionManager from './manager/TargetMissionManager'
import { isArray } from 'lodash'
import { TARGET_COLLECT, TARGET_SCORE } from './constant/target'
import CollectionCompletedScreen from './screens/CollectionCompletedScreen'
import MissionScoreCompleteScreen from './screens/MissionScoreCompleteScreen'
import MissionCollectionCompleteScreen from './screens/MissionCollectionCompleteScreen'
import NoSpaceLeftScreen from './screens/NoSpaceLeftScreen'
import MissionFailScreen from './screens/MissionFailScreen'
import SettingsScreen from './screens/SettingScreen'
import { sendException, sendExceptionWithScope } from '@/utils/Sentry'
import InvalidTileMap from '@/exceptions/InvalidTileMap'
import LoadResourceFail from '@/exceptions/LoadResourceFail'
import CollectionItemsScreen from './screens/CollectionItemsScreen'
import GAME_LEVELS from '@/game/gameplay/constants/GameLevels'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import LeaderBoardScreen from '@/game/screens/LeaderBoardScreen'
import { showMiniJourney } from '@/modules/match/actions/gameplay'
import TutorialManager from './manager/TutorialManager'
import DailyChallengeModeScreen from './screens/DailyChallengeModeScreen'
import { requestMyScoreChallengeData } from '@/modules/daily-challenge/actions/dailyChallenge'
import MiniJourneyScreen from './screens/MiniJourneyScreen'
import TargetScoreScreen from './screens/TargetScoreScreen'
import { AnalyticsEvents } from '@/constants/Analytics'
import { getLevelConfigDailyChallengeMode } from '@/game/gameplay/constants/DailyChallengeLevels'
import ClaimHeartScreen from '@/game/screens/ClaimHeartScreen'
import EffectManager from './effects/EffectManager'
import StartOverScreen from '@/game/screens/StartOverScreen'
import { decreaseLife } from '@/modules/lives/actions/lives'
import LayoutManager from './layouts/LayoutManager'
import { getDailyChallengeTimePlay } from '@/modules/daily-challenge/selectors/dailyChallenge'

const { Board, Network } = GameCore.Configs

const { FRAME } = SPRITES.GAMEPLAY_32

class JourneyScene extends BaseScene {
    private lastTimeInputEnabled = 0

    // Manager
    public layoutManager: LayoutManager
    public tutorialManager: TutorialManager
    public levelManager: LevelManager
    public mapManager: MapManager
    public targetMissionManager: TargetMissionManager
    public effectManager: EffectManager

    public isGameOver: boolean
    public isLevelComplete: boolean

    private restartCurrentLevel = 0
    private startGameAt: number

    public preload(): void {
        this.events.on(Phaser.Scenes.Events.WAKE, this.run)
        this.events.on(Phaser.Scenes.Events.CREATE, this.run)
    }

    private run = (): void => {
        this.initManager()

        const state = this.storage.getState()
        const stateShowMiniJourney = getGameplayShowMiniJourney(state)

        if (stateShowMiniJourney !== true) {
            this.storage.dispatch(showMiniJourney(true))
        }

        this.updateCurrentBestScore()

        this.preloadNextLevel()

        this.startGame()

        this.analytics.levelStart(this.levelManager.getLevel(), undefined, this.getLevelName())
    }

    public create = (): void => {
        super.create()

        this.createBackground(IMAGES.BACKGROUND.KEY)

        this.createManager()

        this.createScreens()

        this.createInput()

        this.input.setTopOnly(true)

        this.preLoadAds()
    }

    private preLoadAds() {
        this.ads.preloadInterstitialAdAsync().catch((ex) => console.log(ex))
        this.ads.preloadRewardedVideoAsync().catch((ex) => console.log(ex))
    }

    private createManager(): void {
        // ? create before all manager
        this.layoutManager = new LayoutManager(this)
        this.tutorialManager = new TutorialManager(this)
        this.levelManager = new LevelManager(this)
        this.mapManager = new MapManager(this)
        this.effectManager = new EffectManager(this)
        this.targetMissionManager = new TargetMissionManager()
    }

    private initManager(): void {
        // ! don't change order
        // ? init after all manager
        this.layoutManager.init()

        // this.tutorialManager.init()
        this.effectManager.init()
    }

    private createInput(): void {
        if (this.isGameOver) return

        const { header } = this.layoutManager.objects

        header.buttonSetting.onClick = this.handlePauseGame
    }

    private createScreens(): void {
        this.createMissionScoreCompleteScreen()
        this.createMissionCollectionCompleteScreen()
        this.createCollectionCompletedScreen()
        this.createNoSpaceLeftScreen()
        this.createMissionFailScreen()
        this.createSettingScreen()
        this.createCollectionItemsScreen()
        this.createLeaderboardScreen()
        this.createDailyChallengeModeScreen()
        this.createMiniJourneyScreen()
        this.createTargetScoreScreen()
        this.createClaimHeartScreen()
        this.createStartOverScreen()
    }

    private createLeaderboardScreen(): void {
        this.screen.add(ScreenKeys.LEADER_BOARD_SCREEN, LeaderBoardScreen)
    }

    private createCollectionCompletedScreen(): void {
        this.screen.add(ScreenKeys.COLLISION_COMPLETED_SCREEN, CollectionCompletedScreen)
    }

    private createMissionScoreCompleteScreen(): void {
        this.screen.add(ScreenKeys.MISSION_SCORE_COMPLETE_SCREEN, MissionScoreCompleteScreen)
    }

    private createMissionCollectionCompleteScreen(): void {
        this.screen.add(
            ScreenKeys.MISSION_COLLECTION_COMPLETE_SCREEN,
            MissionCollectionCompleteScreen
        )
    }

    private createDailyChallengeModeScreen(): void {
        this.screen.add(ScreenKeys.DAILY_CHALLENGE_SCREEN, DailyChallengeModeScreen)
    }

    private createMissionFailScreen(): void {
        this.screen.add(ScreenKeys.MISSION_FAIL_SCREEN, MissionFailScreen)
    }

    private createNoSpaceLeftScreen(): void {
        this.screen.add(ScreenKeys.NO_SPACE_LEFT_SCREEN, NoSpaceLeftScreen)
    }

    private createSettingScreen(): void {
        this.screen.add(ScreenKeys.SETTINGS_SCREEN, SettingsScreen)
    }

    private createCollectionItemsScreen(): void {
        this.screen.add(ScreenKeys.COLLECTION_ITEMS_SCREEN, CollectionItemsScreen)
    }

    private createMiniJourneyScreen(): void {
        this.screen.add(ScreenKeys.MINI_JOURNEY_SCREEN, MiniJourneyScreen)
    }

    private createTargetScoreScreen(): void {
        this.screen.add(ScreenKeys.TARGET_SCORE_SCREEN, TargetScoreScreen)
    }

    private createClaimHeartScreen(): void {
        this.screen.add(ScreenKeys.CLAIM_HEART_SCREEN, ClaimHeartScreen)
    }

    private createStartOverScreen(): void {
        this.screen.add(ScreenKeys.START_OVER_SCREEN, StartOverScreen)
    }

    private onConfirm = (): void => {
        FBInstant.player.setDataAsync({ level: 1 })

        this.storage.dispatch(updateMatchJourneyLevel(1))

        this.levelManager.setLevel(1)

        this.screen.close(ScreenKeys.START_OVER_SCREEN)
        this.screen.close(ScreenKeys.MISSION_COLLECTION_COMPLETE_SCREEN)

        this.handleRestartLevel()
    }

    public handleClickStartOver = (): void => {
        this.screen.open(ScreenKeys.START_OVER_SCREEN, { onConfirm: this.onConfirm })
    }

    private updateCurrentBestScore(): void {
        const { header } = this.layoutManager.objects
        const playerBestScore = this.player.getBestScore()

        const state = this.storage.getState()
        const { bestScore: currentBestScore = 0 } = getGameplayCurrentStats(state)

        const bestScore = playerBestScore > currentBestScore ? playerBestScore : currentBestScore

        header.bestScoreBlock.setScoreText(bestScore)
    }

    public openLevelScreen() {
        this.screen.open(ScreenKeys.LEVEL_SCREEN)
    }

    public handleNextLevel() {
        const levelConfig = this.levelManager.getNextLevelConfig()

        if (!levelConfig) {
            this.levelManager.increaseLevel()

            const currentLevel = this.levelManager.getLevel()

            FBInstant.player.setDataAsync({ level: currentLevel })

            return
        }

        const { key } = levelConfig

        if (this.cache.tilemap.exists(key)) {
            this.handleLoadMapComplete()
            return
        }

        this.preloadNextLevel()

        this.load.off(Phaser.Loader.Events.COMPLETE)
        this.load.once(Phaser.Loader.Events.COMPLETE, this.handleLoadMapComplete.bind(this))
    }

    public handleSwitchJourney() {
        const levelConfig = this.levelManager.getLevelConfig()

        if (!levelConfig) return

        const { key } = levelConfig

        if (this.cache.tilemap.exists(key)) {
            this.handleSwitchMode()
            return
        }

        this.preloadCurrentLevel()

        this.load.off(Phaser.Loader.Events.COMPLETE)
        this.load.once(Phaser.Loader.Events.COMPLETE, this.handleLoadMapComplete.bind(this))
    }

    private handleSwitchMode(): void {
        const currentLevel = this.levelManager.getLevel()

        this.storage.dispatch(
            updateMatchDataJourney({
                data: '',
                level: currentLevel,
                listPieceMap: [],
            })
        )

        FBInstant.player.setDataAsync({ level: currentLevel })

        this.mapManager.reloadMap()

        this.clearFen()
    }

    private handleLoadMapComplete(): void {
        this.levelManager.increaseLevel()

        const currentLevel = this.levelManager.getLevel()

        FBInstant.player.setDataAsync({ level: currentLevel })

        this.mapManager.reloadMap()
    }

    public handlePauseGame = (): void => {
        if (this.isGameOver || this.isLevelComplete) return

        const { screen } = this
        screen.open(ScreenKeys.SETTINGS_SCREEN)
    }

    private handleGuideIfLevel1(): void {
        const state = this.storage.getState()
        const challengeMode = getJourneyChallengeMode(state)

        if (challengeMode) return

        const level = this.levelManager.getLevel()

        if (level !== 1) return

        this.tutorialManager.start()
    }

    public startGame(): void {
        try {
            const { header, main, footer } = this.layoutManager.objects

            header.mainScoreBlock.addScore?.stop().remove()
            header.mainScoreBlock.setScore(0)
            header.mainScoreBlock.setScoreText(0)

            header.progressBar.hideProgressBar()
            header.progressBar.setPercent(0)

            this.isGameOver = false

            this.isLevelComplete = false

            this.mapManager.reloadMap()

            this.tutorialManager?.reset()

            main.board.clearBoard()

            footer.pieces.clearPieces()

            this.loadTargetByMap()

            header.start()

            this.loadBoardAndPieces()

            this.loadTargetAmountByFen()

            this.loadTextHeader()

            this.restartCurrentLevel = 0

            this.openMissionScreen()
        } catch (error) {
            console.log('Error ', error)

            // Restart level
            this.handleRestartLevel()

            sendExceptionWithScope(error, {
                scene: 'Journey scene',
            })
        }
    }

    public startGameAfterCollectionItemsScreenClose(): void {
        const { footer } = this.layoutManager.objects

        this.startGameAt = new Date().getTime()

        const state = this.storage.getState()
        const challengeMode = getJourneyChallengeMode(state)
        const matchJourneyData = getJourneyMatchData(state)?.data || {}
        const { fen } = matchJourneyData

        if (fen && !challengeMode) {
            this.loadPiecesByFen(fen)
            return
        }

        footer.pieces.start()

        this.handleGuideIfLevel1()
    }

    private openMissionScreen(): void {
        const targetType = this.targetMissionManager.getTargetType()

        switch (targetType) {
            case TARGET_COLLECT:
                this.openCollectionItemsScreen()
                break

            case TARGET_SCORE:
                this.openTargetScoreScreen()
                break
        }
    }

    private openCollectionItemsScreen(): void {
        const { header } = this.layoutManager.objects

        const jsonTarget = header.collectItems.getJsonTarget()

        header.collectItems.hideListCollectItems()

        this.disableInput()

        this.time.delayedCall(500, () => {
            this.enableInput()

            this.screen.open(ScreenKeys.COLLECTION_ITEMS_SCREEN, {
                jsonTarget,
                duration: 1500,
            })
        })
    }

    private openTargetScoreScreen(): void {
        this.disableInput()

        const { header } = this.layoutManager.objects

        header.collectItems.reset()

        this.time.delayedCall(500, () => {
            this.enableInput()

            this.screen.open(ScreenKeys.TARGET_SCORE_SCREEN, {
                duration: 1500,
            })
        })
    }

    public showCollectItems(): void {
        const { header } = this.layoutManager.objects

        header.collectItems.showListCollectItems()
    }

    private loadBoardAndPieces(): void {
        const { main, footer } = this.layoutManager.objects
        const state = this.storage.getState()
        const challengeMode = getJourneyChallengeMode(state)
        const matchJourneyData = getJourneyMatchData(state)?.data || {}
        const { fen } = matchJourneyData

        let boardByFen = null
        let piecesByFen = null

        if (fen && !challengeMode) {
            const board = main.board.getBoardByFen(fen)

            boardByFen = this.handleDynamicFenSize(board)
            piecesByFen = footer.pieces.getPiecesByFen(fen)

            if (this.isFenGameOver(boardByFen, piecesByFen)) {
                this.clearFen()
                this.loadBoardByMap()
                this.loadPiecesByMap()
                // this.footer.pieces.start()

                return
            }

            this.loadBoardByFen(fen)
            // this.loadPiecesByFen(fen)

            return
        }

        this.loadBoardByMap()
        this.loadPiecesByMap()
        // this.footer.pieces.start()
    }

    private loadBoardByFen(fen: string): void {
        const { main } = this.layoutManager.objects

        const fenBoard = main.board.getBoardByFen(fen)

        main.board.startGame(fenBoard, fen)
    }

    private loadBoardByMap(): void {
        const { main } = this.layoutManager.objects
        const map = this.mapManager.getTileMap()
        const { layers } = map
        const layerLength = layers.length

        for (let i = 0; i < layerLength; i++) {
            const { data } = layers[i]

            for (let row = 0; row < data.length; row++) {
                const rowItem = data[row]

                for (let col = 0; col < rowItem.length; col++) {
                    const colItem = rowItem[col]

                    if (colItem.index < 0) continue

                    let frame = main.board.getFrameByMapItemIndex(colItem.index - 1)

                    if (!frame || frame === FRAME.GEM_TRANSPARENT) {
                        frame = main.board.getFrameByMapItemIndex(1)

                        sendExceptionWithScope(new Error('MapByBoardError'), {
                            index: colItem.index,
                            level: this.levelManager.getLevel(),
                            row,
                            col,
                        })
                    }

                    main.board.setFrameBoardByIndex(row, col, frame)
                }
            }
        }

        main.board.fadeIn()
    }

    private loadPiecesByFen(fen: string): void {
        const { footer } = this.layoutManager.objects

        const fenPieces = footer.pieces.getPiecesByFen(fen)

        footer.pieces.showAvailablePieces(fenPieces)

        this.loadListPieceMapByFen()
    }

    private loadListPieceMapByFen(): void {
        const { footer } = this.layoutManager.objects

        const state = this.storage.getState()
        const { listPieceMap } = getJourneyMatchData(state)

        if (!listPieceMap || listPieceMap.length === 0) return

        footer.pieces.setListPieceMap(listPieceMap)
    }

    private loadPiecesByMap(): void {
        const { footer } = this.layoutManager.objects
        footer.pieces.buildPiecesByMap()

        const map = this.mapManager.getTileMap()
        const objects = map.getObjectLayer('spawnOrder')

        console.log('objects === ', objects)

        if (!objects) return

        const { objects: objectItems } = objects

        for (let i = 0; i < objectItems.length; i++) {
            const item = objectItems[i]
            const { type, properties } = item
            let dataPiece = footer.pieces.getPieceDataByType(type)

            if (properties) {
                dataPiece = {
                    ...dataPiece,
                    properties,
                }
            }

            if (!dataPiece) continue

            footer.pieces.addItemPieceMap(dataPiece)
        }
    }

    private loadTargetByMap(): void {
        const map = this.mapManager.getTileMap()
        const { properties } = map

        if (!properties || !isArray(properties) || properties.length < 2) {
            throw new InvalidTileMap()
        }

        console.log('properties === ', properties)

        const { value } = properties[0]
        const { value: type } = properties[1]

        this.targetMissionManager.setTargetValue(value)
        this.targetMissionManager.setTargetType(type)
    }

    private loadTargetAmountByFen(): void {
        const { header } = this.layoutManager.objects
        header.collectItems.resetTextAmount()

        const state = this.storage.getState()
        const challengeMode = getJourneyChallengeMode(state)

        if (challengeMode) return

        const matchJourneyData = getJourneyMatchData(state)?.data || {}

        const { jsonAmount } = matchJourneyData

        if (!jsonAmount || Object.keys(jsonAmount).length === 0) {
            return
        }

        header.collectItems.updateJsonAmountByFen(jsonAmount)
    }

    private loadTextHeader(): void {
        const { header } = this.layoutManager.objects
        const state = this.storage.getState()
        const challengeMode = getJourneyChallengeMode(state)

        if (challengeMode) {
            header.bestScoreBlock.showTextDay()
            header.bestScoreBlock.setDayText(this.getTextDay())

            return
        }

        const level = this.levelManager.getLevel()

        header.bestScoreBlock.showTextScore()
        header.bestScoreBlock.setScoreText(level)
    }

    private getTextDay(): string {
        const today = new Date()
        const dd = '0' + today.getDate()
        const mm = '0' + (today.getMonth() + 1)
        const yy = String(today.getFullYear()).slice(-2)

        return mm.slice(-2) + '/' + dd.slice(-2) + '/' + yy
    }

    private getFen() {
        const { main, footer } = this.layoutManager.objects
        const fenBoard = main.board.getFenByBoard()
        const fenPieces = footer.pieces.getFenByPieces()

        return `${fenBoard} ${fenPieces}`
    }

    private handleRestartLevel(): void {
        if (this.restartCurrentLevel > 0) return

        const { globalScene } = this.game

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: this.lang.Text.RESTARTING_MAP,
            duration: Network.Timeout,
            loading: true,
        })

        this.restartCurrentLevel++
        this.preloadCurrentLevel()

        this.load.off(Phaser.Loader.Events.COMPLETE)
        this.load.once(Phaser.Loader.Events.COMPLETE, this.handleLoadCurrentMapComplete.bind(this))

        this.load.off(Phaser.Loader.Events.FILE_LOAD_ERROR)
        this.load.once(
            Phaser.Loader.Events.FILE_LOAD_ERROR,
            this.handleLoadCurrentMapError.bind(this)
        )
    }

    public handleGameOver() {
        this.isGameOver = true

        this.screen.open(ScreenKeys.GAME_OVER_SCREEN)
    }

    public handleRequestFinishGame() {
        this.isGameOver = true

        this.clearFen()

        const state = this.storage.getState()
        const challengeMode = getJourneyChallengeMode(state)

        if (challengeMode) {
            const level = getLevelConfigDailyChallengeMode()
            const levelWithPadding = GameCore.Utils.Number.padStart(level, 4, '0')

            this.analytics.event(AnalyticsEvents.DAILY_CHALLENGE_FAIL, {
                level,
                levelName: `daily_challenge_${levelWithPadding}`,
            })
        } else {
            this.storage.dispatch(decreaseLife())
            this.analytics.levelFail(this.levelManager.getLevel(), undefined, this.getLevelName())
        }

        this.screen.open(ScreenKeys.NO_SPACE_LEFT_SCREEN, {
            duration: 3000,
            onClose: () => {
                this.handleShowInterstitialAd().catch(sendException)
                this.screen.open(ScreenKeys.MISSION_FAIL_SCREEN)
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
        footer.pieces.allPieces.forEach((p) => p.piece.cancelDrag())
    }

    public enableInput() {
        this.input.enabled = true
    }

    public handleUpdateScore(score: number) {
        console.log('handleUpdateScore')
        const { header } = this.layoutManager.objects

        const totalScore = header.mainScoreBlock.score + score

        this.storage.dispatch(updateMatchJourneyScore(totalScore))
    }

    public handleAddScoreAnim(score: number) {
        const { header } = this.layoutManager.objects
        header.mainScoreBlock.animAddScore(score)
    }

    public updateProgressTargetScore(score: number) {
        const { header } = this.layoutManager.objects
        const targetScore = header.progressBar.getTargetScore()
        header.progressBar.setPercent(score / targetScore)
    }

    public handleCompleteScoreMission() {
        if (this.isGameOver || this.targetMissionManager.getTargetType() !== TARGET_SCORE) return

        const { header } = this.layoutManager.objects

        const score = header.mainScoreBlock.score
        const currentLevel = parseInt(this.targetMissionManager.getTargetValue())

        if (score < currentLevel) return // Score not reached

        const state = this.storage.getState()
        const challengeMode = getJourneyChallengeMode(state)

        if (challengeMode) {
            const level = getLevelConfigDailyChallengeMode()
            const levelWithPadding = GameCore.Utils.Number.padStart(level, 4, '0')

            this.handleSwitchJourney()
            this.analytics.event(AnalyticsEvents.DAILY_CHALLENGE_END, {
                level,
                levelName: `daily_challenge_${levelWithPadding}`,
            })
        } else {
            this.handleNextLevel()
            this.analytics.levelComplete(currentLevel, undefined, this.getLevelName())
        }

        this.isGameOver = true
        this.screen.open(ScreenKeys.COLLISION_COMPLETED_SCREEN, {
            duration: 3000,
            onClose: async () => {
                this.isLevelComplete = false
                await this.handleShowInterstitialAd().catch(sendException)
                this.showPopupCompleteScreenAfterCollectionCompleted()
            },
        })
    }

    private canUpdateFenMatch(): boolean {
        const state = this.storage.getState()
        const challengeMode = getJourneyChallengeMode(state)

        if (this.isGameOver || this.isLevelComplete || challengeMode) return false

        return true
    }

    public updateMatchData() {
        if (!this.canUpdateFenMatch()) return

        const { header, footer } = this.layoutManager.objects
        const fen = this.getFen()
        const state = this.storage.getState()
        const matchData = getJourneyMatchData(state).data || {}
        const journeyMatchId = getJourneyMatchId(state)
        const score = getJourneyMatchScore(state) || 0
        const level = this.levelManager.getLevel()
        const jsonAmount = header.collectItems.getJsonAmount()
        const listPieceMap = footer.pieces.getListPieceMap()

        this.storage.dispatch(
            updateJourneyMatchMove(journeyMatchId, {
                score,
                data: { ...matchData, fen, jsonAmount: { ...jsonAmount } },
                level,
                updateAt: Date.now(),
                listPieceMap: [...listPieceMap],
            })
        )
    }

    public clearFen(): void {
        const state = this.storage.getState()
        const journeyMatchId = getJourneyMatchId(state)
        const score = 0
        const level = this.levelManager.getLevel()

        this.storage.dispatch(
            updateJourneyMatchMove(journeyMatchId, {
                score,
                data: { fen: '', jsonAmount: {} },
                level,
                listPieceMap: [],
                updateAt: Date.now(),
            })
        )
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
                case T_PIECE_TYPE: {
                    newPieces.push({
                        data: TPiece.getData(direction),
                    })
                    break
                }
                case U_PIECE_TYPE: {
                    newPieces.push({
                        data: UPiece.getData(direction),
                    })
                    break
                }
                case CROSS_PIECE_2_TYPE:
                case CROSS_PIECE_3_TYPE:
                case CROSS_PIECE_4_TYPE:
                case CROSS_PIECE_5_TYPE: {
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
                case PLUS_PIECE_TYPE: {
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

    public handleCollectionItemsComplete(): void {
        if (this.targetMissionManager.getTargetType() === TARGET_SCORE) return
        const { header } = this.layoutManager.objects

        if (!header.collectItems.checkCompleteMission()) return

        this.clearFen()

        this.audio.playSound(SOUND_EFFECT.TARGET_REACHED)

        const currentLevel = this.levelManager.getLevel()

        const state = this.storage.getState()
        const { challengeMode: isChallengeMode } = getJourneyMatchData(state)

        if (isChallengeMode) {
            const level = getLevelConfigDailyChallengeMode()
            const levelWithPadding = GameCore.Utils.Number.padStart(level, 4, '0')

            this.handleSwitchJourney()
            this.analytics.event(AnalyticsEvents.DAILY_CHALLENGE_END, {
                level,
                levelName: `daily_challenge_${levelWithPadding}`,
            })
        } else {
            this.handleNextLevel()
            this.analytics.levelComplete(currentLevel, undefined, this.getLevelName())
        }

        if (currentLevel > GAME_LEVELS.length - 1) {
            this.time.delayedCall(2000, () => {
                const { globalScene } = this.game
                globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                    message: this.lang.Text.UPDATING_NEW_LEVELS,
                    duration: 1000,
                })
                this.time.delayedCall(1000, () => {
                    this.scene.switch(SceneKeys.LEVEL_SCENE)
                })
            })
        }

        this.screen.open(ScreenKeys.COLLISION_COMPLETED_SCREEN, {
            duration: 3000,
            onClose: async () => {
                this.isLevelComplete = false
                await this.handleShowInterstitialAd().catch(sendException)
                this.showPopupCompleteScreenAfterCollectionCompleted()
            },
        })
    }

    private async showPopupCompleteScreenAfterCollectionCompleted(): Promise<void> {
        const state = this.storage.getState()
        const challengeMode = getJourneyChallengeMode(state)

        if (challengeMode) {
            const time = new Date().getTime() - this.startGameAt

            const currentTime = getDailyChallengeTimePlay(state)

            if (currentTime > time || currentTime == 0) {
                this.storage.dispatch(requestMyScoreChallengeData({ time, limit: 100, offset: 0 }))
                this.storage.dispatch(completeJourneyDailyChallengeMode())
            }

            this.screen.open(ScreenKeys.DAILY_CHALLENGE_SCREEN)

            return
        }

        if (this.targetMissionManager.getTargetType() === TARGET_SCORE) {
            this.screen.open(ScreenKeys.MISSION_SCORE_COMPLETE_SCREEN)
            return
        }

        this.screen.open(ScreenKeys.MISSION_COLLECTION_COMPLETE_SCREEN)
    }

    public setLevelCompleted(isLevelComplete: boolean): void {
        if (this.targetMissionManager.getTargetType() === TARGET_SCORE) return

        this.isLevelComplete = isLevelComplete
    }

    public handleRetryLevel(): void {
        const state = this.storage.getState()
        const { challengeMode } = getJourneyMatchData(state)

        if (challengeMode) {
            const level = getLevelConfigDailyChallengeMode()
            const levelWithPadding = GameCore.Utils.Number.padStart(level, 4, '0')

            this.analytics.event(AnalyticsEvents.DAILY_CHALLENGE_BEGIN, {
                level,
                levelName: `daily_challenge_${levelWithPadding}`,
            })
        } else {
            this.analytics.levelStart(this.levelManager.getLevel(), undefined, this.getLevelName())
        }

        const { header } = this.layoutManager.objects
        header.progressBar.reset()

        this.clearFen()
        this.startGame()
    }

    private preloadNextLevel() {
        const { levelManager } = this

        const levelConfig = levelManager.getNextLevelConfig()

        if (!levelConfig) return

        const { key, mapJson } = levelConfig

        // ? map for tester
        if (key === 'level-from-json') return

        if (this.cache.tilemap.exists(key)) return

        this.load.tilemapTiledJSON(key, mapJson)
        this.load.start()
    }

    private preloadCurrentLevel(): void {
        const { levelManager } = this

        const levelConfig = levelManager.getLevelConfig()

        if (!levelConfig) return

        const { key, mapJson } = levelConfig

        if (this.cache.tilemap.exists(key)) {
            this.handleLoadCurrentMapComplete()
            return
        }

        this.load.tilemapTiledJSON(key, mapJson)
        this.load.start()
    }

    private handleLoadCurrentMapComplete(): void {
        const { globalScene } = this.game

        this.mapManager.reloadMap()
        this.clearFen()
        this.startGame()

        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }

    private handleLoadCurrentMapError(file: TObject): void {
        const { globalScene } = this.game
        const error = new LoadResourceFail('Load resources at LoadScene failed.')

        sendExceptionWithScope(error, { file: file?.url })

        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }

    public getLevelName(): string {
        const level = this.levelManager.getLevel()
        const levelWithPadding = GameCore.Utils.Number.padStart(level, 4, '0')
        return `journey_${levelWithPadding}`
    }

    private handleShowInterstitialAd = async (): Promise<void> => {
        try {
            this.audio.pauseMusic()

            if (!this.ads.canbeShowInterstitialAd()) return

            await this.ads.showInterstitialAdAsync()

            this.analytics.showInterstitialAd(this.getSceneName())
        } catch (ex) {
            return
        } finally {
            this.audio.playMusic()

            this.ads.preloadInterstitialAdAsync().catch(sendException)
        }
    }
}

export default JourneyScene

import.meta.hot?.accept(GameCore.LiveUpdate.Scene(SceneKeys.JOURNEY_SCENE))
