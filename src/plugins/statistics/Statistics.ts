import StatsMain from './StatsMain'
class Statistics extends Phaser.Plugins.BasePlugin implements IStatistics {
    private statsMain: StatsMain
    private isEnable: boolean
    public async configure(config: IStatisticsConfig): Promise<void> {
        console.log(config)
        this.isEnable = true
        this.statsMain = new StatsMain(config)
        this.addToggleButton()
    }

    public getStats(): StatsMain {
        return this.statsMain.getStats()
    }

    public setAlphaInStats(alpha: number): void {
        return this.statsMain.setAlphaInStats(alpha)
    }

    public hide(): void {
        this.setEnable(false)
    }

    public show(): void {
        this.setEnable(true)
    }

    public toggleEnable() {
        this.setEnable(!this.isEnable)
    }

    public setEnable(enable = true) {
        this.isEnable = enable
        this.statsMain.setEnable(enable)
    }

    private addToggleButton() {
        const toggleButton = document.createElement('div')
        toggleButton.style.position = 'absolute'
        toggleButton.style.top = '0'
        toggleButton.style.left = '0'
        toggleButton.style.width = '50px'
        toggleButton.style.height = '50px'
        toggleButton.style.zIndex = '100'

        toggleButton.addEventListener('click', this.toggleEnable.bind(this))

        document.body.appendChild(toggleButton)
    }
}

export default Statistics
