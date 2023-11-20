interface IScreens {
    [key: string]: GameCore.Screen
}

interface IScreenEvent extends Phaser.Events.EventEmitter {
    emit: (event: string, screen: GameCore.Screen) => boolean
}

interface IScreenManager {
    events: IScreenEvent
    get(key: string): GameCore.Screen | null
    add(
        key: string,
        screen: typeof GameCore.Screen,
        width?: number,
        height?: number
    ): GameCore.Screen
    open(key: string, data?: TObject): boolean
    close(key: string): boolean
    bringToTop(key: string): void
}
