declare interface IAdInstance {
    loadAsync(): Promise<void>
    showAsync(): Promise<void>
    canBeShown(): boolean
}
