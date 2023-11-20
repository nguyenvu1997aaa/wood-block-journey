// Use for declare global
export {}

declare global {
    interface Window {
        GameSDK: typeof GameSDK
        YaGames: typeof YandexGames
        FBInstant: typeof FBInstant
        yaContextCb: Function[]
        Ya: any
    }
}
