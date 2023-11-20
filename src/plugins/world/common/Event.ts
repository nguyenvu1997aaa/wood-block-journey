class WorldEvent extends Phaser.Events.EventEmitter {
    public emit(event: string): boolean {
        return super.emit(event)
    }
}

export default WorldEvent
