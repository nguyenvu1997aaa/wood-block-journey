import DEPTH_OBJECTS from '@/game/constants/depth'
import { SceneKeys } from '@/game/constants/scenes'
import { ScreenKeys } from '@/game/constants/screens'
import ClaimHeartScreen from '@/game/screens/ClaimHeartScreen'
import {
    showMiniJourney,
    startJourneyModeGame,
    startMultiModeGame,
    startSingleModeGame,
} from '@/modules/match/actions/gameplay'
import { MATCH_MODE_SINGLE } from '@/modules/match/constants/GameModes'
import { getGameplayShowMiniJourney } from '@/modules/match/selectors/gameplay'
import { getCurrentGameMode } from '@/redux/selectors/context'
import BaseScene from '../BaseScene'
import LayoutManager from './layouts/LayoutManager'
import DailyChallengeScreen from './screens/DailyChallengeScreen'
import MiniJourneyScreen from './screens/MiniJourneyScreen'
import SettingsScreen from './screens/SettingsScreen'
import IMAGES from '@/game/constants/resources/images'
import LeaderBoardScreen from '@/game/screens/LeaderBoardScreen'

class DashboardScene extends BaseScene {
    // Manager
    public layoutManager: LayoutManager

    private run = (): void => {
        this.initManager()

        this.checkAndAddShortcut()

        const { main } = this.layoutManager.objects

        main.dailyChallengeButton.checkSuggestDailyMode()
    }

    private onCreate = (): void => {
        const state = this.storage.getState()
        const stateShowMiniJourney = getGameplayShowMiniJourney(state)

        if (stateShowMiniJourney === null) {
            this.storage.dispatch(showMiniJourney(false))
        } else if (stateShowMiniJourney === false) {
            this.showMiniJourneyScreen()
        }

        this.run()
    }

    private onResume = (): void => {
        this.run()
    }

    private onWake = (): void => {
        this.run()

        const state = this.storage.getState()
        const stateShowMiniJourney = getGameplayShowMiniJourney(state)

        if (stateShowMiniJourney) return

        this.showMiniJourneyScreen()
    }

    private showDailyChallengeScreen(): void {
        this.storage.dispatch(showMiniJourney(true))
        this.screen.open(ScreenKeys.DAILY_CHALLENGE_SCREEN)
    }

    private checkAndAddShortcut(): void {
        const state = this.storage.getState()
        const gameMode = getCurrentGameMode(state)

        // ? only call call createShortcut when in single mode (no more popup showing)
        if (gameMode !== MATCH_MODE_SINGLE) return

        this.facebook.attemptToAddShortcut()
    }

    public preload(): void {
        this.events.on('wake', this.onWake)
        this.events.on('resume', this.onResume)
        this.events.on('create', this.onCreate)
    }

    public create() {
        super.create()

        this.createBackground(IMAGES.BACKGROUND.KEY)

        // this.createBg()

        this.createManager()

        this.createScreens()

        this.listenEvents()
    }

    private createBg(): void {
        const bg = this.make.image({
            key: IMAGES.BACKGROUND.KEY,
        })

        const bg2 = this.make.image({
            key: IMAGES.BACKGROUND.KEY,
        })

        bg2.setFlipY(true)

        Phaser.Display.Align.In.Center(bg, this.gameZone)
        Phaser.Display.Align.In.Center(bg2, this.gameZone)
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

    private listenEvents(): void {
        const { main } = this.layoutManager.objects

        main.setDepth(DEPTH_OBJECTS.LOGO)

        main.playSingleButton.onClick = this.clickPlaySolo
        main.journeyButton.onClick = this.clickLevelScene
        // main.leaderBoardButton.onClick = this.clickLeaderBoard
        main.dailyChallengeButton.onClick = this.showDailyChallengeScreen.bind(this)
        main.settingButton.onClick = this.clickSetting
    }

    private createScreens(): void {
        this.createSettingsScreen()
        this.createLeaderBoardScreen()
        this.createDailyChallengeScreen()
        this.createMiniJourneyScreen()
        this.createClaimHeartScreen()
    }

    private createSettingsScreen(): void {
        this.screen.add(ScreenKeys.SETTINGS_SCREEN, SettingsScreen)
    }

    private createLeaderBoardScreen(): void {
        this.screen.add(ScreenKeys.LEADER_BOARD_SCREEN, LeaderBoardScreen)
    }

    private createDailyChallengeScreen(): void {
        this.screen.add(ScreenKeys.DAILY_CHALLENGE_SCREEN, DailyChallengeScreen)
    }

    private createMiniJourneyScreen(): void {
        this.screen.add(ScreenKeys.MINI_JOURNEY_SCREEN, MiniJourneyScreen)
    }

    private createClaimHeartScreen(): void {
        this.screen.add(ScreenKeys.CLAIM_HEART_SCREEN, ClaimHeartScreen)
    }

    private clickPlayWithFriend = (): void => {
        this.storage.dispatch(startMultiModeGame())
    }

    private clickPlaySolo = (): void => {
        this.storage.dispatch(startSingleModeGame())
    }

    private clickJourney = (): void => {
        console.log('Click journey')
        this.storage.dispatch(startJourneyModeGame())
    }

    private clickLevelScene = (): void => {
        console.log('Click Level Scene')
        this.scene.switch(SceneKeys.LEVEL_SCENE)
    }

    private clickLeaderBoard = (): void => {
        this.screen.open(ScreenKeys.LEADER_BOARD_SCREEN)
    }

    private clickJourney1 = (): void => {
        console.log('Click journey 1')
        this.scene.switch(SceneKeys.LEVEL_SCENE)
    }

    private clickSetting = (): void => {
        this.screen.open(ScreenKeys.SETTINGS_SCREEN)
    }

    private showMiniJourneyScreen(): void {
        this.storage.dispatch(showMiniJourney(true))
        this.screen.open(ScreenKeys.MINI_JOURNEY_SCREEN)
    }
}

export default DashboardScene

if (import.meta.hot) {
    import.meta.hot.accept(GameCore.LiveUpdate.Scene(SceneKeys.DASHBOARD_SCENE))
}
