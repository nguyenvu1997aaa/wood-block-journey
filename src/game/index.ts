import FBInstantExtra from '@/FBInstantExtra'
import GameObjectExtra from '@/GameObjectExtra'
import AdsManager from '@/plugins/ads'
import AnalyticsManager from '@/plugins/analytics'
import AudioManager from '@/plugins/audio'
import AuthManager from '@/plugins/auth'
import FrameCapture from '@/plugins/frame-capture'
import PlayerManager from '@/plugins/player'
import ProfileManager from '@/plugins/profile'
import ProfilerPlugin from '@/plugins/profiler'
import RollbarPlugin from '@/plugins/rollbar'
import ScreenManager from '@/plugins/screen'
import Storage from '@/plugins/storage'
import TextStyler from '@/plugins/text-styler'
import WorldManager from '@/plugins/world'
import StateInitiator from '@/StatInitiator'
import { SceneKeys } from './constants/scenes'
import BootScene from './scenes/BootScene'
import GameScene from './scenes/game-scene'
import GlobalScene from './scenes/global-scene'
import LoadScene from './scenes/LoadScene'
import DashboardScene from './scenes/dashboard-scene'
import JourneyScene from './scenes/journey-scene'
import LevelScene from './scenes/level-scene'
import CanvasRecorderPlugin from '@/plugins/canvas-recorder'

// ! Don't sort import
import LanguageManager from './language/LanguageManager'
import VisibilityChangeHandler from '@/plugins/visibility-change'
import GameAdInstance from '@/ads/GameAdInstance'
import FBProgressLoading from '@/FBProgressLoading'
import AdaptivePerformance from '@/plugins/performance'

import 'spinePlugin'

class MagicGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config)
    }

    public async boot(): Promise<void> {
        super.boot()

        // * Add extra method for some functions
        this.addExtraGameObjectMethods()

        // * Add extra functions for phaser fbinstant plugin
        this.addExtraFBInstantFunctions()

        this.addPlugins()

        // * Dev plugins
        await this.addDevPlugins()

        await this.initAdsAsync()

        this.addScenes()

        // * Dev scenes
        this.addDevScenes()

        this.initWorld()
        this.initStorage()
        this.initLanguage()

        this.initVisibilityChangeHandler()

        this.initUtils()

        // * Init plugins
        this.initRollbar()
        this.initConsole()
        this.initDebugger()
        this.initStatistics()
        this.initParticleEditor()
        this.initProfilerPlugin()
        this.initAdaptivePerformance()
        this.initCanvasRecorderPlugin()
    }

    public start(): void {
        super.start()
    }

    public updateFps(fps = 60) {
        if (this.getFps() === fps) return

        this.setFps(fps)
    }

    private getFps(): number {
        if (!this.scene.game) return 5

        return this.scene.game.loop && this.scene.game.loop.raf ? this.scene.game.loop.raf.fps : 5
    }

    private setFps(fps: number): void {
        if (!this.scene.game) return
        if (
            this.scene.game.loop &&
            this.scene.game.loop.raf &&
            typeof this.scene.game.loop.raf.updateFps === 'function'
        ) {
            this.scene.game.loop.raf.updateFps(fps)
        }
    }

    private addExtraGameObjectMethods() {
        const extra = new GameObjectExtra(this)

        extra.addKillRevive()
        extra.addKillReviveGroup()
        extra.addDrawDebugBox()
        extra.addSetWorldSize()
        extra.addSetWorldSizeForContainer()
        extra.addGetWorldPosition()
        extra.addHighQuality()
        extra.addSetLineHeightForBitmapText()
    }

    private addExtraFBInstantFunctions() {
        const extra = new FBInstantExtra(this.facebook)

        // Override methods
        this.facebook.getLocale = extra.getLocale
        this.facebook.shareAsync = extra.shareAsync
        this.facebook.inviteAsync = extra.inviteAsync
        this.facebook.switchAsync = extra.switchAsync
        this.facebook.chooseAsync = extra.chooseAsync
        this.facebook.createAsync = extra.createAsync
        this.facebook.sendMessage = extra.sendMessage
        this.facebook.getContextID = extra.getContextID
        this.facebook.getPlayerToken = extra.getPlayerToken
        this.facebook.matchPlayerAsync = extra.matchPlayerAsync
        this.facebook.getContextPlayers = extra.getContextPlayers
        this.facebook.setLoadingProgress = extra.setLoadingProgress
        this.facebook.attemptToAddShortcut = extra.attemptToAddShortcut
        this.facebook.attemptToSubscribeBot = extra.attemptToSubscribeBot
        this.facebook.postSessionScoreAsync = extra.postSessionScoreAsync
        this.facebook.getRewardedVideoAsync = extra.getRewardedVideoAsync
        this.facebook.sendNotificationAsync = extra.sendNotificationAsync
        this.facebook.getInterstitialAdAsync = extra.getInterstitialAdAsync

        // Inject tournament
        extra.injectTournament()

        this.facebook.progressLoading = new FBProgressLoading(this)
    }

    private addPlugins(): void {
        // Global plugins
        this.plugins.install('Storage', Storage, true, 'storage')
        this.plugins.install('Rollbar', RollbarPlugin, true, 'rollbar')

        this.plugins.install('AdsManager', AdsManager, true, 'ads')
        this.plugins.install('AuthManager', AuthManager, true, 'auth')
        this.plugins.install('AudioManager', AudioManager, true, 'audio')
        this.plugins.install('WorldManager', WorldManager, true, 'world')
        this.plugins.install('PlayerManager', PlayerManager, true, 'player')
        this.plugins.install('LanguageManager', LanguageManager, true, 'lang')
        this.plugins.install('ProfileManager', ProfileManager, true, 'profile')
        this.plugins.install('AnalyticsManager', AnalyticsManager, true, 'analytics')
        this.plugins.install('AdaptivePerformance', AdaptivePerformance, true, 'performance')
        this.plugins.install('VisibilityChangeHandler', VisibilityChangeHandler, true, 'visibility')

        // Scene plugins
        this.plugins.installScenePlugin('textStyler', TextStyler, 'textStyler')
        this.plugins.installScenePlugin('ScreenManager', ScreenManager, 'screen')
        this.plugins.installScenePlugin('FrameCapture', FrameCapture, 'frameCapture')
        this.plugins.installScenePlugin('SpinePlugin', SpinePlugin, 'spine')

        if (window.SpinePlugin) {
            this.plugins.installScenePlugin('SpinePlugin', SpinePlugin, 'spine')
        }

        // * Inject plugins into Phaser.Game
        // ? and some action of redux, from window.game
        // ? use for some modules, plugins, from this.game

        this.storage = this.plugins.get('Storage') as Storage
        this.rollbar = this.plugins.get('Rollbar') as RollbarPlugin

        this.ads = this.plugins.get('AdsManager') as AdsManager
        this.auth = this.plugins.get('AuthManager') as AuthManager
        this.audio = this.plugins.get('AudioManager') as AudioManager
        this.world = this.plugins.get('WorldManager') as WorldManager
        this.player = this.plugins.get('PlayerManager') as PlayerManager
        this.lang = this.plugins.get('LanguageManager') as LanguageManager
        this.profile = this.plugins.get('ProfileManager') as ProfileManager
        this.analytics = this.plugins.get('AnalyticsManager') as AnalyticsManager
        this.performance = this.plugins.get('AdaptivePerformance') as AdaptivePerformance
        this.visibility = this.plugins.get('VisibilityChangeHandler') as VisibilityChangeHandler
    }

    private async addDevPlugins(): Promise<void> {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const Eruda = (await import('@/plugins/eruda')).default
        const Debugger = (await import('@/plugins/debugger')).default
        const Statistics = (await import('@/plugins/statistics')).default
        const ProfilerPlugin = (await import('@/plugins/profiler')).default
        const ParticleEditor = (await import('@/plugins/particle-editor')).default
        const CanvasRecorderPlugin = (await import('@/plugins/canvas-recorder')).default

        this.plugins.install('Console', Eruda, true, 'console')
        this.plugins.install('Debugger', Debugger, true, 'debugger')
        this.plugins.install('Statistics', Statistics, true, 'statistics')
        this.plugins.install('Profiler', ProfilerPlugin, true, 'profiler')
        this.plugins.install('ParticleEditor', ParticleEditor, true, 'particle-editor')
        this.plugins.install('CanvasRecorder', CanvasRecorderPlugin, true, 'canvasRecorder')

        this.eruda = this.plugins.get('Console') as Eruda
        this.debugger = this.plugins.get('Debugger') as Debugger
        this.statistics = this.plugins.get('Statistics') as Statistics
        this.profiler = this.plugins.get('Profiler') as ProfilerPlugin
        this.particleEditor = this.plugins.get('ParticleEditor') as ParticleEditor
        this.canvasRecorder = this.plugins.get('CanvasRecorder') as CanvasRecorderPlugin
    }

    private addScenes(): void {
        this.scene.add(SceneKeys.BOOT_SCENE, BootScene, true)
        this.scene.add(SceneKeys.LOAD_SCENE, LoadScene, false)
        this.scene.add(SceneKeys.GAME_SCENE, GameScene, false)
        this.scene.add(SceneKeys.LEVEL_SCENE, LevelScene, false)
        this.scene.add(SceneKeys.JOURNEY_SCENE, JourneyScene, false)
        this.scene.add(SceneKeys.DASHBOARD_SCENE, DashboardScene, false)

        this.scene.add(SceneKeys.GLOBAL_SCENE, GlobalScene, false)
    }

    private async addDevScenes() {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const TestScene = (await import('./scenes/TestScene')).default
        const AnimationsScene = (await import('./scenes/animations-scene')).default

        this.scene.add(SceneKeys.TEST_SCENE, TestScene, false)
        this.scene.add(SceneKeys.ANIMATIONS_SCENE, AnimationsScene, false)
    }

    private async initAdsAsync(): Promise<void> {
        const { Ads } = GameCore.Configs

        GameAdInstance.setGame(this)

        let adInstance = GameAdInstance

        if (Ads.Mockup.Enable) {
            const MockAdInstance = (await import('../ads/MockAdInstance')).default
            adInstance = MockAdInstance
        }

        const correctInterstitialAdOptions = { ...Ads.InterstitialAdOptions }

        this.ads.configure(adInstance, {
            enabled: Ads.Enabled,
            calculateSafeAreaBottom: Ads.CalculateSafeAreaBottom,
            enableRewardVideoResetInterstitial: Ads.EnableRewardVideoResetInterstitial,
            interstitialAdOptions: correctInterstitialAdOptions,
            rewardAdOptions: Ads.RewardAdOptions,
            bannerAdOptions: Ads.BannerAdOptions,
        })
    }

    private initWorld() {
        const { Game } = GameCore.Configs
        const {
            AutoResize,
            PortraitRatio,
            PortraitWidth,
            PortraitHeight,
            LandscapeRatio,
            LandscapeWidth,
            LandscapeHeight,
            DisableLandscape,
            FullSizeOnLandscape,
        } = Game

        // ? Default world size base on texture size
        const autoResize = AutoResize
        const disableLandscape = DisableLandscape
        const fullSizeOnLandscape = FullSizeOnLandscape

        const portraitRatio = PortraitRatio
        const portraitWidth = PortraitWidth
        const portraitHeight = PortraitHeight

        const landscapeRatio = LandscapeRatio
        const landscapeWidth = LandscapeWidth
        const landscapeHeight = LandscapeHeight

        console.info('🚀 > portraitRatio', portraitRatio)
        console.info('🚀 > landscapeRatio', landscapeRatio)

        this.world.configure({
            autoResize,
            portraitRatio,
            portraitWidth,
            portraitHeight,
            landscapeRatio,
            landscapeWidth,
            landscapeHeight,
            disableLandscape,
            fullSizeOnLandscape,
        })

        this.world.resize(Game.ForcePixelRatio)
    }

    private initStorage(): void {
        const initiator = new StateInitiator(this)
        this.storage.setInitiator(initiator)
    }

    private initLanguage(): void {
        // const locale = 'pt'
        const locale = this.facebook.getLocale()
        this.lang.configure({
            locale,
            upperCaseText: false,
        })
    }

    private initVisibilityChangeHandler(): void {
        this.visibility.configure()
    }

    private initUtils(): void {
        this.handlePauseAudio()
        // this.removeUnusedPipelines()
    }

    private initConsole(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const { ShowConsole } = GameCore.Configs.Debugger
        if (!ShowConsole) return

        this.eruda.configure({
            tool: ['console', 'info'],
            defaults: {
                theme: 'Dark',
            },
        })
    }

    private initDebugger(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const { ShowInspector, ShowMonitoring } = GameCore.Configs.Debugger

        if (!ShowInspector && !ShowMonitoring) return

        this.debugger.configure(GameCore.Configs.Debugger)
    }

    private initStatistics(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const { Enable } = GameCore.Configs.Statistics
        if (!Enable) return

        this.statistics.configure(GameCore.Configs.Statistics)
    }

    private initParticleEditor(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const { Enable } = GameCore.Configs.ParticleEditor
        if (!Enable) return

        this.particleEditor.configure(GameCore.Configs.ParticleEditor)
    }

    private initProfilerPlugin(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const { Enable } = GameCore.Configs.ProfilerPlugin
        if (!Enable) return

        this.profiler.configure()
    }

    private initAdaptivePerformance(): void {
        const { Enable, ...Options } = GameCore.Configs.Performance
        if (!Enable) return

        const pixelRatio = this.world.getPixelRatio()
        this.performance.configure({ pixelRatio, ...Options })

        // Call this method to start adaptive performance
        // ? Maybe we can call this method when game is ready
        this.performance.active()
    }

    private initCanvasRecorderPlugin(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const { CanvasRecorder } = GameCore.Configs
        if (!CanvasRecorder.Enable) return

        const { Type, Quality, RecordFps, SyncFps } = CanvasRecorder.Options
        this.canvasRecorder.configure({
            type: Type,
            quality: Quality,
            syncFps: SyncFps,
            recordFps: RecordFps,
        })

        const canvas = document.querySelector('canvas')
        if (!canvas) return console.error('Canvas not found')

        this.canvasRecorder.setCanvas(canvas)

        // ! Test mode
        // this.canvasRecorder.runTestCanvas()
        // return

        const options = this.canvasRecorder.getOptions()

        const originWaitNextFrame = this.canvasRecorder.waitNextFrame

        this.canvasRecorder.waitNextFrame = async () => {
            if (options.syncFps) {
                this.loop.sleep()
                return new Promise((resolve) => {
                    this.events.once(Phaser.Core.Events.POST_RENDER, resolve)
                    this.loop.lastTime = 1000 / options.recordFps
                    this.loop.step()
                })
            } else {
                this.loop.wake()
                return await originWaitNextFrame.call(this.canvasRecorder)
            }
        }
    }

    private initRollbar(): void {
        const { Enable } = GameCore.Configs.Rollbar

        console.warn({ isRollbarEnabled: Enable })

        if (!Enable) return

        this.rollbar.setup()
    }

    private handlePauseAudio() {
        this.sound.pauseOnBlur = false

        this.visibility.addEventVisible(() => {
            this.audio.playMusic()
            this.audio.resumeAllSounds()
        })
        this.visibility.addEventHidden(() => {
            this.audio.pauseMusic()
            this.audio.pauseAllSounds()
        })
    }

    private removeUnusedPipelines() {
        const renderer = this.renderer
        if (!(renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer)) {
            return
        }

        const { pipelines: manager } = renderer
        const pipelines = Phaser.Renderer.WebGL.Pipelines

        if (!pipelines) return

        // ? This pipelines list, it creates more than 1 draw count
        const list = [
            pipelines.ROPE_PIPELINE,
            pipelines.LIGHT_PIPELINE,
            pipelines.POSTFX_PIPELINE,
            pipelines.POINTLIGHT_PIPELINE,
            pipelines.BITMAPMASK_PIPELINE,
        ]

        list.forEach((pipelineName) => {
            manager.get(pipelineName)?.destroy()
            manager.remove(pipelineName)
        })
    }
}

export default MagicGame
