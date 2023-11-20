// Use for declare global
export {}

declare global {
    const GameCore: GameCore

    interface Window {
        GameCore

        blankCanvas: Phaser.Textures.CanvasTexture
        game: Phaser.Game
        Sentry: typeof import('@sentry/browser')
        rollbar: typeof import('rollbar')
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function
        __SNOWPACK_ENV__: Object

        __fbGameReady: boolean
        __fbInstantInitiated: boolean
        __analyticsInitiated: boolean
        __fbInstantLoadingTimer: NodeJS.Timer
        SpinePlugin: SpinePlugin
    }

    function gtag(event: string, action: string | Object, params?: Object): void
}
