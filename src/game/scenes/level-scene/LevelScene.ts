import IMAGES from '@/game/constants/resources/images'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import { ScreenKeys } from '@/game/constants/screens'
import GAME_LEVELS from '@/game/gameplay/constants/GameLevels'
import ClaimHeartScreen from '@/game/screens/ClaimHeartScreen'
import LeaderBoardScreen from '@/game/screens/LeaderBoardScreen'
import StartOverScreen from '@/game/screens/StartOverScreen'
import { getLives } from '@/modules/lives/selectors/lives'
import { startJourneyModeGame } from '@/modules/match/actions/gameplay'
import {
    completeJourneyDailyChallengeMode,
    loadLevel,
    updateMatchJourneyLevel,
} from '@/modules/match/actions/match'
import { getJourneyMatchLevel } from '@/modules/match/selectors/match'
import { inviteWithBestScore } from '@/redux/actions/invite'
import { sendException } from '@/utils/Sentry'
import BaseScene from '../BaseScene'
import LayoutManager from './layouts/LayoutManager'

const { Network } = GameCore.Configs
const { KEY, FRAME } = SPRITES.DEFAULT

class LevelScene extends BaseScene {
    // Manager
    public layoutManager: LayoutManager

    public preload(): void {
        this.events.on(Phaser.Scenes.Events.WAKE, this.run)
        this.events.on(Phaser.Scenes.Events.CREATE, this.run)
    }

    private run = async (): Promise<void> => {
        this.initManager()

        await this.checkReceiveLevelFromFb()

        const { header } = this.layoutManager.objects

        header.updateTextLives()

        this.loadLevelConfig()
    }

    private startGame(): void {
        const { footer, main } = this.layoutManager.objects

        main.updateData()
        this.checkFinishAllLevel()
        footer.updateTextButtonPlay()

        main.scroller.setVisible(true)
    }

    public create = (): void => {
        super.create()

        this.createBackground(IMAGES.BACKGROUND.KEY)

        this.createManager()

        this.createLeaderBoardScreen()

        this.createClaimHeartScreen()

        this.createStartOverScreen()

        this.listenEvents()
    }

    private createManager(): void {
        // ? create before all manager
        this.layoutManager = new LayoutManager(this)
    }

    private initManager(): void {
        // ! don't change order
        // ? init after all manager
        this.layoutManager.init()
    }

    private createClaimHeartScreen(): void {
        this.screen.add(ScreenKeys.CLAIM_HEART_SCREEN, ClaimHeartScreen)
    }

    private createStartOverScreen(): void {
        this.screen.add(ScreenKeys.START_OVER_SCREEN, StartOverScreen)
    }

    public listenEvents() {
        const { footer } = this.layoutManager.objects

        footer.buttonHome.onClick = this.clickButtonHome.bind(this)
        footer.buttonPlay.onClick = this.handlePlay.bind(this)
        // footer.leaderBoardButton.onClick = this.clickLeaderBoard.bind(this)
        footer.buttonStartOver.onClick = this.handleClickStartOver
    }

    // Event Buttons
    private clickButtonHome = (): void => {
        this.scene.switch(SceneKeys.DASHBOARD_SCENE)
    }

    public async handlePlay(): Promise<void> {
        const state = this.storage.getState()
        const playerLives = getLives(state)

        if (playerLives < 1) {
            this.screen.open(ScreenKeys.CLAIM_HEART_SCREEN)
            return
        }

        // this.storage.dispatch(decreaseLife())

        const level = getJourneyMatchLevel(state)

        this.storage.dispatch(completeJourneyDailyChallengeMode())

        this.analytics.levelStart(level, undefined, this.getLevelName(level))

        this.storage.dispatch(startJourneyModeGame())
    }

    private onConfirm = (): void => {
        const { main } = this.layoutManager.objects

        FBInstant.player.setDataAsync({ level: 1 })

        this.storage.dispatch(updateMatchJourneyLevel(1))
        main.resetScroller()
        this.loadLevelConfig()
        main.updateData()
    }

    private handleClickStartOver = (): void => {
        this.screen.open(ScreenKeys.START_OVER_SCREEN, { onConfirm: this.onConfirm })
    }

    private async checkReceiveLevelFromFb(): Promise<void> {
        try {
            const state = this.storage.getState()
            const level = getJourneyMatchLevel(state)

            if (level) return

            this.showLoadingScreen()

            await this.storage.dispatch(loadLevel())
        } catch (error) {
            sendException(error)
        }
    }

    private showLoadingScreen(): void {
        const { globalScene, lang } = this.game

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: `${lang.Text.LOADING_LEVEL}...`,
            duration: Network.Timeout,
            loading: true,
        })
    }

    private hideLoadingScreen(): void {
        const { globalScene } = this.game

        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }

    private checkFinishAllLevel = () => {
        const { footer } = this.layoutManager.objects

        const state = this.storage.getState()
        const level = getJourneyMatchLevel(state)

        console.log(level, GAME_LEVELS.length)

        if (level >= GAME_LEVELS.length) {
            footer.buttonPlay.setVisible(false)
            footer.buttonStartOver.setVisible(true)
            return
        }
        footer.buttonPlay.setVisible(true)
        footer.buttonStartOver.setVisible(false)
    }

    public loadLevelConfig(): void {
        try {
            const state = this.storage.getState()
            let level = getJourneyMatchLevel(state)

            if (level === 0) level = 1

            let levelData = GAME_LEVELS[level]

            if (!levelData) {
                levelData = GAME_LEVELS[GAME_LEVELS.length - 1]
            }

            const { key, mapJson } = levelData

            if (this.cache.tilemap.exists(key)) {
                this.handleLoadCurrentMapComplete()
                return
            }

            this.load.tilemapTiledJSON(key, mapJson)
            this.load.start()

            this.load.off(Phaser.Loader.Events.COMPLETE)
            this.load.once(
                Phaser.Loader.Events.COMPLETE,
                this.handleLoadCurrentMapComplete.bind(this)
            )
        } catch (error) {
            sendException(error)
        }
    }

    private handleLoadCurrentMapComplete(): void {
        this.hideLoadingScreen()
        this.startGame()
    }

    private handleInviteFriends(): void {
        this.storage.dispatch(inviteWithBestScore())
    }

    private createLeaderBoardScreen(): void {
        this.screen.add(ScreenKeys.LEADER_BOARD_SCREEN, LeaderBoardScreen)
    }

    private clickLeaderBoard = (): void => {
        this.screen.open(ScreenKeys.LEADER_BOARD_SCREEN)
    }

    private getLevelName(level: number): string {
        const levelWithPadding = GameCore.Utils.Number.padStart(level, 4, '0')
        return `journey_${levelWithPadding}`
    }
}

export default LevelScene

import.meta.hot?.accept(GameCore.LiveUpdate.Scene(SceneKeys.LEVEL_SCENE))
