import { TpEvent } from '@tweakpane/core'
import { FolderApi, Pane, TabPageApi } from 'tweakpane'
import Inspector from './inspector/Inspector'
import SpectorJS from './spector-js/SpectorJS'

class Debugger extends Phaser.Plugins.BasePlugin implements IDebugger {
    private pane: Pane
    private element: HTMLElement

    private configFolder: FolderApi
    private defaultRoot: TabPageApi

    private spectorJs: SpectorJS
    private spectorJsFolder: FolderApi

    private inspector: Inspector
    private inspectorRoot: TabPageApi

    private isEnable: boolean

    public async configure(config?: DeepPartial<IDebuggerConfig>): Promise<void> {
        const {
            ShowInspector = true,
            ShowMonitoring = true,
            Expanded = false,
            AutoRefresh = true,
            InspectorAutoUpdate = true,
            Opacity = 0.8,
        } = config || {}

        this.isEnable = true

        this.pane = new Pane({
            title: 'Debugger',
            expanded: Expanded,
        })

        this.pane
            .addButton({
                title: 'Hide Panel',
            })
            .on('click', this.hide.bind(this))

        this.addToggleButton()

        this.element = this.pane.element

        this.initConfigDebugger(Opacity)

        const tab = this.pane.addTab({
            pages: [{ title: 'Default' }, { title: 'Inspector' }],
        })

        this.defaultRoot = tab.pages[0]
        this.inspectorRoot = tab.pages[1]

        if (ShowMonitoring) {
            await this.createSpectorJs()
        }

        if (ShowInspector && !this.isOnMobile()) {
            await this.createInspector(InspectorAutoUpdate)
        }

        if (AutoRefresh) {
            this.update()
        }

        if (this.isOnMobile()) {
            this.pane.expanded = false
        }
    }

    private initConfigDebugger(opacity: number) {
        this.configFolder = this.pane.addFolder({
            title: 'Debugger config',
            expanded: false,
        })

        const config = {
            opacity: opacity,
            x: -8,
            y: -8,
            width: 256,
        }

        if (this.element.parentElement) {
            this.element.parentElement.style.top = `${-config.y}px`
            this.element.parentElement.style.right = `${-config.x}px`
        }

        this.element.style.opacity = `${config.opacity}`

        this.configFolder
            .addInput(config, 'opacity', { min: 0, max: 1, step: 0.1 })
            .on('change', (ev: { value: number }) => {
                this.element.style.opacity = `${ev.value}`
            })

        this.configFolder
            .addInput(config, 'x', { step: 1 })
            .on('change', (ev: { value: number }) => {
                if (!this.element.parentElement) return
                this.element.parentElement.style.right = `${-ev.value}px`
            })

        this.configFolder
            .addInput(config, 'y', { step: 1 })
            .on('change', (ev: { value: number }) => {
                if (!this.element.parentElement) return
                this.element.parentElement.style.top = `${-ev.value}px`
            })

        this.configFolder
            .addInput(config, 'width', { min: 200, max: 500, step: 1 })
            .on('change', (ev: { value: number }) => {
                if (!this.element.parentElement) return
                this.element.parentElement.style.width = `${ev.value}px`
            })

        this.element.onwheel = ((e: WheelEvent) => {
            const { deltaY } = e
            if (config.y <= -8 && deltaY < 0) return
            if (
                config.y >= this.element.clientHeight - document.body.clientHeight - 8 &&
                deltaY > 0
            )
                return

            config.y += deltaY / 2
        }).bind(this)
    }

    private async createSpectorJs(): Promise<void> {
        this.spectorJsFolder = this.defaultRoot.addFolder({
            title: 'SpectorJs',
            expanded: true,
        })

        this.spectorJs = new SpectorJS()
        this.spectorJs.init(this.spectorJsFolder)
    }

    private async createInspector(autoUpdate: boolean): Promise<void> {
        const Inspector = (await import('./inspector/index')).default
        this.inspector = new Inspector()
        this.inspector.init(this.game, this.inspectorRoot, autoUpdate)
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
        this.pane.hidden = !enable
        this.inspector?.setEnable(enable)
    }

    private update() {
        this.pane.refresh()

        requestAnimationFrame(this.update.bind(this))
    }

    private isOnMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    }

    public getFolder(): TabPageApi {
        return this.defaultRoot
    }

    public debug(obj: Record<string, (ev: TpEvent) => void>, name?: string): FolderApi {
        const objFolder = this.defaultRoot.addFolder({ title: name || 'Object' })

        for (const [key, property] of Object.entries(obj)) {
            if (
                typeof property == 'number' ||
                typeof property == 'boolean' ||
                typeof property == 'string'
            ) {
                objFolder.addInput(obj, key)
            } else if (typeof property == 'function') {
                objFolder.addButton({ title: key }).on('click', obj[key])
            }
        }

        return objFolder
    }

    private addToggleButton() {
        const toggleButton = document.createElement('div')
        toggleButton.style.position = 'absolute'
        toggleButton.style.top = '0'
        toggleButton.style.right = '0'
        toggleButton.style.width = '50px'
        toggleButton.style.height = '50px'
        toggleButton.style.zIndex = '100'

        toggleButton.addEventListener('click', this.toggleEnable.bind(this))

        document.body.appendChild(toggleButton)
    }
}

export default Debugger
