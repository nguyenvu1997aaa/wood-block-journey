class Inspector {
    private phaserInspector: unknown

    public async init(game: Phaser.Game, folder: unknown, autoUpdate: boolean): Promise<void> {
        const PhaserInspector = (await import('./libs/PhaserInspector')).default
        this.phaserInspector = new PhaserInspector(game, folder, autoUpdate)
    }

    public setEnable(enable = true) {
        if (this.phaserInspector) {
            // @ts-expect-error - pass
            this.phaserInspector.setEnable(enable)
        }
    }
}

export default Inspector
