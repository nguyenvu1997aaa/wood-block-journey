import DEPTH_OBJECTS from '@/game/constants/depth'
import FONTS from '@/game/constants/resources/fonts'

interface IPerformance extends Performance {
    memory: {
        usedJSHeapSize: number
        totalJSHeapSize: number
        jsHeapSizeLimit: number
    }
}

class MemoryMeter extends Phaser.GameObjects.Container {
    public performance: IPerformance

    public memory = 0

    private maxMemoryLimit: number
    private maxPercentThreshold: number

    private normalColor = 0x34c85a
    private warningColor = 0xffdd57
    private alarmColor = 0xf14668

    private memoryString = 'Memory: %1MB / %2MB'
    private memoryText: Phaser.GameObjects.BitmapText

    private lastUpdate: number

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0)

        this.performance = window.performance as IPerformance

        this.createMemory()
        this.setDepth(DEPTH_OBJECTS.DEBUG)
        this.scene.add.existing(this)

        if (!this.isSupport()) {
            this.memoryText.setText('Memory: not supported!')
            return
        }

        const { jsHeapSizeLimit } = this.performance.memory
        this.maxPercentThreshold = 90
        this.setMaxMemory(jsHeapSizeLimit / 1048576)

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update)
    }

    public update = (time: number): void => {
        // ? Reduce the number of updates
        if (time - this.lastUpdate < 1000) return

        this.lastUpdate = time

        const { usedJSHeapSize } = this.performance.memory

        const maxMemoryLimit = this.maxMemoryLimit * 1048576
        const currentMemoryUsed = Math.round(usedJSHeapSize / 1048576)

        this.setMemory(currentMemoryUsed)

        this.memoryText.setTint(this.normalColor)

        // Check if we have exceeded relative memory limit for client
        if (usedJSHeapSize > (this.maxPercentThreshold / 100) * maxMemoryLimit) {
            // Memory usage exceeded ' + this.maxPercentThreshold + '% of maximum: ' + jsHeapSizeLimit

            this.memoryText.setTint(this.warningColor)
        }

        // Check if we have exceeded absolute memory limit
        if (usedJSHeapSize > maxMemoryLimit) {
            // overage = usedJSHeapSize - this.maxMemoryLimit
            // Exceeded memory maximum limit by 'overage' bytes

            this.memoryText.setTint(this.alarmColor)
        }
    }

    private isSupport(): boolean {
        return this.performance && !!this.performance?.memory
    }

    public setMaxMemory(memory: number): void {
        this.maxMemoryLimit = Math.round(memory)
    }

    public setMemory(memory: number): void {
        this.memory = memory

        const text = Phaser.Utils.String.Format(this.memoryString, [memory, this.maxMemoryLimit])

        this.memoryText.setText(text)
    }

    private createMemory(): void {
        this.memoryText = this.scene.make.bitmapText({
            size: this.scene.fontSize(14),
            text: this.memoryString,
            font: FONTS.PRIMARY.KEY,
            depth: 2000,
        })

        this.memoryText.setName('Memory Meter')

        this.add(this.memoryText)

        this.setMemory(0)
    }
}

export default MemoryMeter
