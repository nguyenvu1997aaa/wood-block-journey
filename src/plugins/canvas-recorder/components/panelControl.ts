import { ButtonApi, FolderApi, InputBindingApi, ListApi, Pane, TpChangeEvent } from 'tweakpane'
import * as TweakpaneImagePlugin from 'tweakpane-image-plugin'
import CanvasRecorderPlugin from '..'

const { Utils } = GameCore

type Options = GameCore.Plugins.CanvasRecorder.Options
type RecorderInfo = GameCore.Plugins.CanvasRecorder.RecorderInfo

class PanelControl {
    private options: Options
    private recorder: CanvasRecorderPlugin

    private pane: Pane
    private optionsFolder: FolderApi
    private controlFolder: FolderApi
    private previewFolder: FolderApi
    private infoFolder: FolderApi

    private qualityInput: InputBindingApi<unknown, null>
    private previewImage: InputBindingApi<unknown, null>
    private printScreenButton: ButtonApi
    private startRecordButton: ButtonApi
    private stopRecordButton: ButtonApi
    private previewRecordButton: ButtonApi
    private downloadZipButton: ButtonApi

    private recorderMonitor: RecorderInfo

    private cachedImages: string[]
    private previewImages: Blob[]
    private previewImageIndex: number
    private previewTimer: number

    constructor(recorder: CanvasRecorderPlugin, options: Options) {
        this.options = options
        this.recorder = recorder

        this.createPanel()
        this.createOptionsFolder()
        this.createControlFolder()
        this.createPreviewFolder()
        this.createInfoFolder()

        this.addControlHotKey()
    }

    private createPanel() {
        this.pane = new Pane({
            title: 'Canvas Recorder',
            expanded: true,
        })

        this.pane.registerPlugin(TweakpaneImagePlugin)

        const { parentElement } = this.pane.element
        if (!parentElement) return
        parentElement.style.width = '280px'
    }

    private createOptionsFolder() {
        this.optionsFolder = this.pane.addFolder({
            title: 'Options',
            expanded: true,
        })

        this.addImageTypePanel()
        this.addSyncFpsPanel()
        this.addFpsPanel()
        this.addQualityPanel()
    }

    private createControlFolder() {
        this.controlFolder = this.pane.addFolder({
            title: 'Control',
            expanded: true,
        })

        this.addPrintScreenButton()
        this.controlFolder.addSeparator()

        this.addStartRecordButton()
        this.addStopRecordButton()
    }

    private createPreviewFolder() {
        this.previewFolder = this.pane.addFolder({
            title: 'Preview',
            expanded: false,
        })

        this.addPreviewAnimation()
        this.addPreviewRecordButton()
        this.addDownloadZipButton()
    }

    private createInfoFolder() {
        this.infoFolder = this.pane.addFolder({
            title: 'Info',
            expanded: true,
        })

        this.recorderMonitor = {
            videoElapsedTime: '00:00:00',
            realTimeElapsedTime: '00:00:00',
        }

        this.addVideoElapsedTimeMonitor()
        this.addRealTimeElapsedTimeMonitor()
    }

    public blockInputPanel(): void {
        this.printScreenButton.disabled = true
        this.startRecordButton.disabled = true
        this.stopRecordButton.disabled = true
        this.previewRecordButton.disabled = true
        this.downloadZipButton.disabled = true
    }

    public unblockInputPanel(): void {
        this.printScreenButton.disabled = false
        this.startRecordButton.disabled = false
        this.stopRecordButton.disabled = false
        this.previewRecordButton.disabled = false
        this.downloadZipButton.disabled = false
    }

    public updateRecordInfo(videoElapsedTime: string, realTimeElapsedTime: string): void {
        this.recorderMonitor.videoElapsedTime = videoElapsedTime
        this.recorderMonitor.realTimeElapsedTime = realTimeElapsedTime
    }

    private addImageTypePanel() {
        const imageTypeList = this.optionsFolder.addBlade({
            view: 'list',
            label: 'Image Type',
            options: {
                webp: 'webp',
                png: 'png',
                jpeg: 'jpeg',
            },
            value: this.options.type,
        }) as ListApi<string>

        imageTypeList.on('change', (ev: TpChangeEvent<string>) => {
            this.options.type = ev.value as Options['type']
            this.qualityInput.disabled = ev.value === 'png'
        })
    }

    private addSyncFpsPanel() {
        this.optionsFolder.addInput(this.options, 'syncFps', {
            label: 'Sync Frames',
        })
    }

    private addFpsPanel() {
        this.optionsFolder.addInput(this.options, 'recordFps', {
            min: 5,
            max: 60,
            step: 1,
            label: 'Record FPS',
        })
    }

    private addQualityPanel() {
        this.qualityInput = this.optionsFolder.addInput(this.options, 'quality', {
            min: 0,
            max: 1,
            step: 0.05,
            label: 'Quality',
        })
    }

    private addPrintScreenButton() {
        this.printScreenButton = this.controlFolder.addButton({
            title: 'Screenshot Canvas (or press S)',
        })

        this.printScreenButton.on('click', this.snapshotFrame)
    }

    private addStartRecordButton() {
        this.startRecordButton = this.controlFolder.addButton({
            title: 'Record Canvas (or press Z)',
        })

        this.startRecordButton.on('click', this.startCapture)
    }

    private addStopRecordButton() {
        this.stopRecordButton = this.controlFolder.addButton({
            title: 'Stop Record (or press X)',
            disabled: true,
        })

        this.stopRecordButton.on('click', this.stopCapture)
    }

    private addPreviewAnimation() {
        const params = {
            url: '',
        }

        this.previewImage = this.previewFolder.addInput(params, 'url', {
            label: 'Frames\n0/0',
            view: 'input-image',
            imageFit: 'contain',
            extensions: ['.webp', '.png', '.jpeg'],
        })

        const { element } = this.previewImage
        element.querySelector('.tp-imgv_input')?.remove()

        let block = element.querySelector('.tp-lblv_v') as HTMLDivElement
        if (block) {
            block.style.width = '100%'
            block.style.height = '250px'
        }

        block = element.querySelector('.tp-lblv_l') as HTMLDivElement
        if (block) {
            block.style.flex = 'none'
        }

        block = element.querySelector('.tp-imgv') as HTMLDivElement
        if (block) {
            block.style.width = '75%'
            block.style.height = '100%'
        }
    }

    private addPreviewRecordButton() {
        this.previewRecordButton = this.previewFolder.addButton({
            title: 'Review Record (or press C)',
        })

        this.previewRecordButton.on('click', this.previewRecord)
    }

    private addDownloadZipButton() {
        this.downloadZipButton = this.previewFolder.addButton({
            title: 'Download Zip (or press D)',
        })

        this.downloadZipButton.on('click', this.downloadImages)
    }

    private addVideoElapsedTimeMonitor() {
        this.infoFolder.addMonitor(this.recorderMonitor, 'videoElapsedTime', {
            label: 'Elapsed Time',
        })
    }

    private addRealTimeElapsedTimeMonitor() {
        this.infoFolder.addMonitor(this.recorderMonitor, 'realTimeElapsedTime', {
            label: 'Real Time Elapsed Time',
        })
    }

    private addControlHotKey(): void {
        window.addEventListener('keydown', (ev: KeyboardEvent) => {
            switch (ev.key) {
                case 's':
                    {
                        if (this.printScreenButton.disabled) return
                        this.snapshotFrame()
                    }
                    break
                case 'd':
                    {
                        if (this.downloadZipButton.disabled) return
                        this.downloadImages()
                    }
                    break
                case 'z':
                    {
                        if (this.startRecordButton.disabled) return
                        this.startCapture()
                    }
                    break
                case 'x':
                    {
                        if (this.stopRecordButton.disabled) return
                        this.stopCapture()
                    }
                    break
                case 'c':
                    {
                        if (this.previewRecordButton.disabled) return
                        this.previewRecord()
                    }
                    break
            }
        })
    }

    private snapshotFrame = async (): Promise<void> => {
        await this.recorder.snapshotFrameAsync()

        this.printScreenButton.disabled = false
        this.startRecordButton.disabled = false
    }

    private startCapture = async (): Promise<void> => {
        this.previewFolder.expanded = false

        await this.recorder.startCaptureAsync()

        this.cachedImages = []

        this.stopRecordButton.disabled = false
    }

    private stopCapture = async (): Promise<void> => {
        await this.recorder.stopCaptureAsync()

        this.previewFolder.expanded = true
        this.stopRecordButton.disabled = true

        this.previewRecord()
    }

    private downloadImages = async (): Promise<void> => {
        await this.recorder.downloadImagesAsync()

        this.printScreenButton.disabled = false
        this.startRecordButton.disabled = false
        this.previewRecordButton.disabled = false

        this.downloadZipButton.disabled = true
    }

    private previewRecord = (): void => {
        this.previewImages = this.recorder.getRecordImages()

        if (this.previewImages.length === 0) return

        this.previewImageIndex = -1

        this.requestPreviewFrame()

        this.previewRecordButton.disabled = false
    }

    private requestPreviewFrame = async () => {
        clearTimeout(this.previewTimer)
        const { recordFps } = this.options

        this.previewImageIndex++
        if (this.previewImageIndex >= this.previewImages.length) {
            this.previewImageIndex = -1
            return
        }

        this.previewImage.label = `Frames\n${this.previewImageIndex + 1}/${
            this.previewImages.length
        }`

        const image = this.previewImages[this.previewImageIndex]
        await this.processImage(this.previewImageIndex, image)

        this.previewTimer = setTimeout(
            this.requestPreviewFrame,
            1000 / recordFps
        ) as unknown as number
    }

    private processImage = async (idx: number, blob: Blob): Promise<void> => {
        const img = this.previewImage.element.querySelector('img')
        if (!img) return

        if (this.cachedImages[idx]) {
            img.src = this.cachedImages[idx]
            return
        }

        const image = await Utils.Image.blobToHtmlImage(blob, false)
        img.src = image.src

        this.cachedImages[idx] = image.src
    }
}

export default PanelControl
