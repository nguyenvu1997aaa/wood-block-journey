import * as SPECTOR from 'spectorjs'
import type { FolderApi, ListApi } from 'tweakpane'

class SpectorJS {
    private spector: typeof SPECTOR.Spector

    public init(folder: FolderApi): void {
        // ? Fix import lib between webpack and snowpack
        const Spector = SPECTOR.default ? SPECTOR.default.Spector : SPECTOR.Spector

        this.spector = new Spector()

        this.show(folder)
        this.spector.spyCanvas()
    }

    private show(folder: FolderApi): void {
        this.spector.displayUI()
        this.showTweakpane(folder)
    }

    private showTweakpane(folder: FolderApi): void {
        this.hide()
        const listCanvas = Array.from(document.getElementsByTagName('canvas'))
        const canvasList = folder.addBlade({
            view: 'list',
            label: 'canvas',
            options: listCanvas.map((el, i) => {
                return {
                    text: `${el.id} ${el.width} x ${el.height}`,
                    value: i,
                }
            }),
            value: 0,
        }) as ListApi<number>
        const buttonCapture = folder.addButton({
            title: 'Start Capture',
        })
        buttonCapture.on('click', () => {
            this.startCapture(listCanvas[canvasList.value])
        })
    }

    private hide(): void {
        const style = document.createElement('style')
        style.innerText = `
      .captureMenuComponent {
        display: none !important
      }

      .captureMenuLogComponent {
        display: none !important
      }
    `
        document.head.appendChild(style)
    }

    public getFps(): number {
        return this.spector.getFps()
    }

    public captureNextFrame(
        obj: HTMLCanvasElement | RenderingContext,
        quickCapture: boolean
    ): void {
        return this.spector.captureNextFrame(obj, quickCapture)
    }

    public startCapture(
        obj: HTMLCanvasElement | RenderingContext,
        commandCount?: number,
        quickCapture?: boolean
    ): void {
        return this.spector.startCapture(obj, commandCount, quickCapture)
    }

    public stopCapture(): void {
        return this.spector.stopCapture()
    }

    public setMarker(marker: string): void {
        return this.spector.setMarker(marker)
    }

    public clearMarker(): void {
        return this.spector.clearMarker()
    }

    public getSPECTOR(): typeof SPECTOR.Spector {
        return this.spector
    }
}

export default SpectorJS
