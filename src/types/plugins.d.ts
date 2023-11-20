interface IModules {
    storage: IStorage

    ads: IAdsManager
    auth: IAuthManager
    audio: IAudioManager
    world: IWorldManager
    player: IPlayerManager
    profile: IProfileManager
    analytics: IAnalyticsManager
    lang: ILanguageManager
    visibility: IVisibilityChangeHandler

    eruda: Eruda
    rollbar: RollbarPlugin
    debugger: Debugger
    statistics: Statistics
    particleEditor: ParticleEditor
    profiler: IProfilerPlugin
    performance: IAdaptivePerformance
    canvasRecorder: GameCore.Plugins.CanvasRecorder
}

declare namespace Phaser {
    interface Scene extends Phaser.Scene, IModules {
        screen: IScreenManager
        textStyler: ITextStyler
        frameCapture: IFrameCapture
    }

    interface Game extends Phaser.Game, IModules {
        globalScene: Phaser.Scene
    }
}
