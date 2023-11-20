class ScreenEvent extends Phaser.Events.EventEmitter {
    public emit(event: string, screen: GameCore.Screen): boolean {
        return super.emit(event, screen)
    }
}

export default ScreenEvent
