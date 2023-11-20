import { FONT_FAMILY } from './constants/font'
import logImage from './utils/console.image.js'

class FrameCapture extends Phaser.Plugins.ScenePlugin implements IFrameCapture {
    private width!: number
    private height!: number
    private renderOptions!: IWideFrameRenderOptions

    private canvas!: Phaser.Textures.CanvasTexture

    public preload(images: IImages): void {
        const resource = Object.keys(images)

        if (resource.length < 1) return

        resource.forEach((key) => {
            this.scene.load.image(key, images[key])
        })

        this.scene.load.start()
    }

    public async capture(payload: IWideFramePayload): Promise<string> {
        const { width, height, renderOptions } = payload

        this.width = width
        this.height = height
        this.renderOptions = renderOptions

        this.createCanvas()

        try {
            await this.loadImages()
        } catch (error) {
            //
        }

        this.drawObjects()

        return this.snapshotFrame()
    }

    private createCanvas(): void {
        if (!this.canvas) {
            this.canvas = this.game.textures.createCanvas('FrameCaptureCanvas')
        }

        this.canvas.clear()
        this.canvas.setSize(this.width, this.height)
    }

    private loadImages(): Promise<void> {
        return new Promise((resolve, rejects) => {
            for (const id in this.renderOptions) {
                const { name, image } = this.renderOptions[id] as IRenderOptionImage
                if (!image) continue

                const texture = this.scene.textures.get(name)
                if (texture.key === name) continue

                this.scene.load.image(name, image)
            }

            this.scene.load.on(Phaser.Loader.Events.COMPLETE, resolve)
            this.scene.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, () => {
                const error = new Error('Load image failed')
                rejects(error)
            })

            this.scene.load.start()
        })
    }

    private drawObjects(): void {
        for (const key in this.renderOptions) {
            const option = this.renderOptions[key]

            switch (option.type) {
                case 'text':
                    this.drawText(option)
                    break

                case 'image':
                    this.drawImage(option)
                    break
            }
        }
    }

    private drawText(option: IRenderOptionText): void {
        const { context } = this.canvas
        const { x, y, font, text, fillStyle, lineWidth, textAlign } = option

        context.font = `${font} ${FONT_FAMILY}`
        context.fillStyle = fillStyle || '#ffffff'

        if (lineWidth) {
            context.lineWidth = lineWidth
        }

        if (textAlign) {
            context.textAlign = textAlign
        }

        context.fillText(text, x, y)
    }

    private drawImage(option: IRenderOptionImage): void {
        const { context } = this.canvas
        const { x, y, name, frame, width, height, fallbackWithImage } = option

        let texture = this.scene.textures.get(name)
        let source = texture.getSourceImage(frame) as HTMLImageElement

        if (texture.key === '__MISSING' && fallbackWithImage) {
            texture = this.scene.textures.get(fallbackWithImage)
            source = texture.getSourceImage() as HTMLImageElement
        }

        context.drawImage(source, x, y, width, height)
    }

    private snapshotFrame() {
        const imageBase64 = this.canvas.getCanvas().toDataURL('image/jpeg', 0.85)

        if (GameCore.Utils.Valid.isDebugger()) {
            logImage(imageBase64)
        }

        return imageBase64
    }
}

export default FrameCapture
