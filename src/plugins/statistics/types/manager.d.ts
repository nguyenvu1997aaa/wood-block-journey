interface IStatisticsConfig {
    DisplayMode: number
    FPS: boolean
    MS: boolean
    MB: boolean
    Opacity: number
}

interface IStatistics {
    configure(config: IStatisticsConfig): Promise<void>
    getStats(): any
    setAlphaInStats(alpha: number): void
}

declare class Statistics extends Phaser.Plugins.BasePlugin implements IStatistics {
    configure(config: IStatisticsConfig): Promise<void>
    getStats(): any
    setAlphaInStats(alpha: number): void
}
