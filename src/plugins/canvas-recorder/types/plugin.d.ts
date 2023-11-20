module 'tweakpane-image-plugin'

namespace GameCore {
    namespace Plugins {
        interface CanvasRecorder {
            configure(options: Partial<CanvasRecorder.Options>): void
            waitNextFrame(): Promise<void>
            startCaptureAsync(): Promise<void>
            stopCaptureAsync(): Promise<void>
            snapshotFrameAsync(): Promise<void>
            getOptions(): CanvasRecorder.Options
            isCapturing(): boolean
            setCanvas(canvas: HTMLCanvasElement): void
            runTestCanvas(): void
        }

        namespace CanvasRecorder {
            type ImageType = 'webp' | 'png' | 'jpeg'
            type Options = {
                type: ImageType
                quality: number
                recordFps: number
                syncFps: boolean
            }

            type RecorderInfo = {
                videoElapsedTime: string
                realTimeElapsedTime: string
            }
        }
    }
}
