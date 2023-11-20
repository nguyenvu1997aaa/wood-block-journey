interface IWorldPayload {
    autoResize: boolean
    portraitRatio: number
    portraitWidth: number
    portraitHeight: number

    landscapeRatio: number
    landscapeWidth: number
    landscapeHeight: number
    disableLandscape: boolean
    fullSizeOnLandscape: boolean
}

type WorldSize = {
    width: number
    height: number
}

type WorldEventPayload = {
    layout?: string
    width?: number
    height?: number
}

interface IWorldEvent extends Phaser.Events.EventEmitter {
    emit: (event: string, payload?: WorldEventPayload) => boolean
}

interface IWorldManager {
    events: IWorldEvent
    configure(payload: IWorldPayload): void
    resize(forcePixelRatio?: number): void
    getZoomRatio(): number
    getWorldSize(): WorldSize
    /**
     * Not use this function to get real device DPR. This function use to calculate buffer canvas size (pixel ratio in game).
     *
     * Normally, this function only uses with system plugins, try to avoid using it in game logic.
     *
     * Please use `GameCore.Utils.Image.getImageScale()` to get current texture scale size.
     */
    getPixelRatio(): number
    getPhysicPixels(pixels: number, dpr: number): number
    getScreenRatio(): number
    getScreenWidth(): number
    getScreenHeight(): number
    isLandscape(): boolean
}
