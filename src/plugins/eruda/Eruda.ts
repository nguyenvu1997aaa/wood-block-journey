import eruda from 'eruda'

class Eruda extends Phaser.Plugins.BasePlugin implements IEruda {
    private eruda: unknown

    private isEnable: boolean
    private container: HTMLElement

    public async configure(config: IErudaConfig): Promise<void> {
        this.eruda = eruda

        this.container = document.createElement('div')
        this.container.id = 'eruda-console'
        document.body.appendChild(this.container)

        this.isEnable = true

        eruda.init({ ...config, container: this.container })

        this.addToggleButton()
    }

    public hide(): void {
        this.setEnable(false)
    }

    public show(): void {
        this.setEnable(true)
    }

    public toggleEnable(): void {
        this.setEnable(!this.isEnable)
    }

    public setEnable(enable: boolean) {
        this.isEnable = enable
        this.container.style.display = enable ? 'block' : 'none'
    }

    public destroy(): void {
        // @ts-expect-error - pass
        this.eruda.destroy()
    }

    public position(pos?: IPosition): void {
        // @ts-expect-error - pass
        this.eruda.position(pos)
    }

    private addToggleButton() {
        const toggleButton = document.createElement('div')
        toggleButton.style.position = 'absolute'
        toggleButton.style.bottom = '0'
        toggleButton.style.right = '0'
        toggleButton.style.width = '50px'
        toggleButton.style.height = '50px'
        toggleButton.style.zIndex = '100'

        toggleButton.addEventListener('click', this.toggleEnable.bind(this))

        document.body.appendChild(toggleButton)
    }
}

export default Eruda
