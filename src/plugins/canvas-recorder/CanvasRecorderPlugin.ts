import { InputWithSizeMeta, downloadZip } from 'client-zip'
import PanelControl from './components/panelControl'
import defaultOptions from './constants/options'
import drawDemoTransitionOnCanvas from './demo/drawDemoTransitionOnCanvas'

const { Utils } = GameCore

type Options = GameCore.Plugins.CanvasRecorder.Options

class CanvasRecorderPlugin
    extends Phaser.Plugins.BasePlugin
    implements GameCore.Plugins.CanvasRecorder
{
    private options: Options
    private panelControl: PanelControl

    private canvas: HTMLCanvasElement

    private capturing: boolean

    private requestCount = 0
    private requestFinishCount = 0

    private lastCaptureTime = 0
    private realStartTime = 0
    private countVideoTime = 0

    private imageList: InputWithSizeMeta[]

    public init(): void {
        this.imageList = []
        this.options = { ...defaultOptions }
    }

    public configure(options: Partial<Options>): void {
        this.options = { ...this.options, ...options }
        this.panelControl = new PanelControl(this, this.options)
    }

    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas
    }

    public runTestCanvas(): void {
        const canvas = this.createCanvas(200, 300)
        canvas.style.position = 'absolute'

        document.body.appendChild(canvas)

        drawDemoTransitionOnCanvas(canvas)

        this.setCanvas(canvas)
    }

    public getOptions(): Options {
        return this.options
    }

    public isCapturing(): boolean {
        return this.capturing
    }

    private initCaptureState(): void {
        this.imageList = []
        this.capturing = false

        this.requestCount = 0
        this.requestFinishCount = 0

        this.countVideoTime = 0
        this.realStartTime = performance.now()
    }

    private setStateInputPanel(enable: boolean): void {
        if (!enable) {
            this.panelControl.blockInputPanel()
        } else {
            this.panelControl.unblockInputPanel()
        }
    }

    public async startCaptureAsync(): Promise<void> {
        if (this.isCapturing()) return

        if (!this.canvas) {
            console.warn('Canvas is not set')
            return
        }

        this.initCaptureState()
        this.setStateInputPanel(false)

        console.info('options', this.options)

        this.capturing = true

        this.processCapture()
    }

    private processCapture = async () => {
        if (!this.isCapturing()) return

        const now = performance.now()

        await this.waitNextFrame()
        if (!this.isCapturing()) return

        await this.handleCapture()

        this.lastCaptureTime = performance.now()
        const deltaTime = now - this.lastCaptureTime

        if (!this.options.syncFps) {
            const frameTime = 1000 / this.options.recordFps
            if (frameTime > deltaTime) {
                await Utils.Time.sleepAsync(frameTime - deltaTime)
            }
        }

        this.countVideoTime += deltaTime
        this.updateRecordInfo()

        this.processCapture()
    }

    public async waitNextFrame(): Promise<void> {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                resolve()
            })
        })
    }

    private handleCapture = async () => {
        try {
            this.requestCount++

            const imageData = await this.snapshotCanvas()

            if (!imageData) {
                throw new Error('Image data is null')
            }

            this.addImageDataToList(this.requestCount, imageData)

            this.requestFinishCount++
        } catch (error) {
            console.error('handleCapture', error)
            await this.stopCaptureAsync()
        }
    }

    private updateRecordInfo() {
        const videoElapsedTime = this.formatDateHMS(this.countVideoTime)
        const realTimeElapsedTime = this.formatDateHMS(performance.now() - this.realStartTime)

        this.panelControl.updateRecordInfo(videoElapsedTime, realTimeElapsedTime)
    }

    private snapshotCanvas(): Promise<Blob | null> {
        return new Promise((resolve) => {
            this.canvas.toBlob(
                (blob) => {
                    resolve(blob)
                },
                `image/${this.options.type}`,
                this.options.quality
            )
        })
    }

    private addImageDataToList = (idx: number, image: Blob) => {
        const name = this.getPaddingName(idx)

        this.imageList.push({
            name: `${name}.${this.options.type}`,
            input: image,
        })
    }

    public async stopCaptureAsync(): Promise<void> {
        this.capturing = false

        return new Promise((resolve) => {
            const waitAllRequestFinish = setInterval(async () => {
                if (this.requestCount !== this.requestFinishCount) return

                clearInterval(waitAllRequestFinish)

                this.setStateInputPanel(true)

                resolve()
            }, 500)
        })
    }

    public async snapshotFrameAsync() {
        try {
            if (this.isCapturing()) return

            this.setStateInputPanel(false)

            if (!this.canvas) {
                console.warn('Canvas is not set')
                return
            }

            await this.waitNextFrame()

            const imageData = await this.snapshotCanvas()

            if (!imageData) {
                throw new Error('Image data is null')
            }

            this.downloadImage(imageData)
        } catch (error) {
            console.error('snapshotFrame', error)
        }
    }

    private downloadImage(image: Blob) {
        const link = document.createElement('a')

        const filename = `screenshot-${this.getDateFilename()}`
        link.download = filename

        link.href = URL.createObjectURL(image)

        const MIME_TYPE = `image/${this.options.type}`
        link.dataset.downloadurl = [MIME_TYPE, link.download, link.href].join(':')

        link.click()
        link.remove()
    }

    public async downloadImagesAsync() {
        try {
            if (this.isCapturing()) return
            this.setStateInputPanel(false)

            const link = document.createElement('a')

            const filename = `images-${this.getDateFilename()}`
            link.download = filename

            const blob = await downloadZip(this.imageList).blob()
            link.href = URL.createObjectURL(blob)

            link.click()
            link.remove()
        } catch (error) {
            console.error('downloadZipImages', error)
        }
    }

    public getRecordImages(): Blob[] {
        return this.imageList.map((image) => image.input as Blob)
    }

    private createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        return canvas
    }

    private getPaddingName(number: number): string {
        const numberLength = number.toString().length
        const targetLength = 5

        let padding = ''
        for (let index = 0; index < targetLength - numberLength; index++) {
            padding += '0'
        }

        return padding + number.toString()
    }

    private getDateFilename(): string {
        const date = new Date()
        return `${date.toLocaleTimeString()}-${date.toLocaleDateString()}`
    }

    private formatDateHMS(ms: number, showHour = false): string {
        const dateISO = new Date(ms).toISOString()

        if (showHour) {
            return dateISO.slice(11, -5)
        }

        return dateISO.slice(14, -5)
    }
}

export default CanvasRecorderPlugin
