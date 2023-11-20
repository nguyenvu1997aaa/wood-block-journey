interface IImages {
    [key: string]: string
}

interface IRenderOptionText {
    type: 'text'
    x: number
    y: number
    font: string
    text: string
    fillStyle?: string
    lineWidth?: number
    textAlign?: CanvasTextAlign
    depth?: number
}

interface IRenderOptionImage {
    name: string
    type: 'image'
    x: number
    y: number
    image: string
    width: number
    height: number
    radius?: number
    depth?: number
    frame?: string
    fallbackWithImage?: string
}

interface IWideFrameRenderOptions {
    [key: string]: IRenderOptionText | IRenderOptionImage
}

interface IWideFramePayload {
    width: number
    height: number
    renderOptions: IWideFrameRenderOptions
}

interface IFrameCapture {
    preload(images: IImagesResource): void
    capture(payload: IWideFramePayload): Promise<string>
}
