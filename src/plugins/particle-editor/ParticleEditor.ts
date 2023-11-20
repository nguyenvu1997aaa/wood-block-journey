import SPRITES from '@/game/constants/resources/sprites'
import { FolderApi, ListApi, Pane, TabPageApi } from 'tweakpane'
import EditorFolder from './editor-folder/EditorFolder'
import DEPTH_OBJECTS from '@/game/constants/depth'

type ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
class ParticleEditor extends Phaser.Plugins.BasePlugin implements IParticleEditor {
    private pane: Pane
    private element: HTMLElement

    private configFolder: FolderApi

    private pickEmitterTab: TabPageApi
    private selectParticle: ListApi<string>
    private index = 0

    private editorFolderMap: Map<string, EditorFolder>

    private editorFolder: EditorFolder

    public async configure(config?: DeepPartial<IDebuggerConfig>): Promise<void> {
        const { Expanded = false, AutoRefresh = true, Opacity = 0.8 } = config || {}

        this.pane = new Pane({
            title: 'Particle Editor',
            expanded: Expanded,
        })

        this.element = this.pane.element

        this.initConfig(Opacity)

        this.createPickEmitter()

        if (AutoRefresh) {
            this.update()
        }

        if (this.isOnMobile()) {
            this.pane.expanded = false
        }
    }

    private initConfig(opacity: number) {
        this.configFolder = this.pane.addFolder({
            title: 'Config',
            expanded: false,
        })

        const config = {
            opacity: opacity,
            x: -8,
            y: -8,
            width: 300,
            hide: this.hide.bind(this),
        }

        if (this.element.parentElement) {
            this.element.parentElement.style.top = `${-config.y}px`
            this.element.parentElement.style.left = `${-config.x}px`
            this.element.parentElement.style.width = `${config.width}px`
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
                this.element.parentElement.style.left = `${-ev.value}px`
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

        this.configFolder
            .addButton({
                title: 'Hide Panel',
            })
            .on('click', config.hide)

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

    private createPickEmitter(): void {
        const tab = this.pane.addTab({
            pages: [{ title: 'Pick emitter' }],
        })

        this.pickEmitterTab = tab.pages[0]

        this.createListParticle()
        this.createSampleParticleEmitterButton()
    }

    private update() {
        this.pane.refresh()

        requestAnimationFrame(this.update.bind(this))
    }

    private isOnMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    }

    private createListParticle() {
        this.editorFolderMap = new Map<string, EditorFolder>()

        this.selectParticle = this.pickEmitterTab.addBlade({
            view: 'list',
            label: 'List',
            options: [],
            value: '',
        }) as ListApi<string>

        this.selectParticle.on('change', (ev) => {
            const editorFolder = this.editorFolderMap.get(ev.value)

            if (editorFolder) {
                this.editorFolder.hide()
                this.editorFolder = editorFolder

                editorFolder.show()
            }
        })
    }

    private createSampleParticleEmitterButton() {
        const creationFolder = this.pickEmitterTab.addFolder({
            title: 'Creation folder',
        })

        const button = creationFolder.addButton({
            title: 'Create sample emitter',
        })

        button.on('click', this.addSampleEmitter)

        this.createImportParticle(creationFolder)
    }

    private addSampleEmitter = () => {
        const { globalScene } = window.game
        const { width, height } = globalScene.gameZone

        const config = {
            angle: { min: 140, max: 400 },
            gravityY: -100,
            speedX: 50,
            speedY: 50,
            lifespan: { min: 750, max: 1000 },
            alpha: { min: 0.5, max: 0.8 },
            scale: { start: 1, end: 0.6, ease: 'Linear' },
            frame: [SPRITES.EFFECTS.FRAME.FX_STAR_WHITE],
            x: width / 2,
            y: height / 2,
        }

        const particleEmitter = this.createParticleEmitter(config)

        this.setParticleEmitter('Sample ' + this.index, particleEmitter)
    }

    private createParticleEmitter(config: Object) {
        const { globalScene } = window.game

        const particle = globalScene.add.particles(SPRITES.EFFECTS.KEY)
        particle.setDepth(DEPTH_OBJECTS.ON_TOP)

        const particleEmitter = particle.createEmitter({
            frame: [SPRITES.EFFECTS.FRAME.FX_STAR_WHITE],
            ...config,
        })
        particleEmitter.setRadial(true)

        return particleEmitter
    }

    private createImportParticle(creationFolder: FolderApi) {
        const button = creationFolder.addButton({
            title: 'Import config',
        })

        const param = {
            config: `{}`,
        }

        creationFolder.addInput(param, 'config')

        button.on('click', () => {
            try {
                const config = JSON.parse(param.config)
                if (GameCore.Utils.Valid.isObject(config)) {
                    const particleEmitter = this.createParticleEmitter(config)

                    this.setParticleEmitter('Sample ' + this.index, particleEmitter)

                    this.editorFolder.importEmitterFromJSON(config)
                }
            } catch (err) {
                //
                alert('Invalid config')
            }
        })
    }

    private addToSelectParticle(name: string, editorFolder: EditorFolder) {
        if (this.editorFolderMap.has(name)) return

        this.editorFolderMap.set(name, editorFolder)

        this.selectParticle.options.push({ text: name, value: name })

        const selects = this.selectParticle.controller_.view.element.getElementsByTagName('select')

        const select = selects[0]
        select.innerHTML += `<option data-index="${this.index}" value="${name}">${name}</option>`
        select.value = name
        select.dispatchEvent(new Event('change'))

        this.index++
    }

    public hide(): void {
        this.pane.hidden = true
    }

    public show(): void {
        this.pane.hidden = false
    }

    public setParticleEmitter(name: string, emitter: ParticleEmitter): void {
        this.editorFolder?.hide()
        this.editorFolder = new EditorFolder(this.pane, emitter)

        this.addToSelectParticle(name, this.editorFolder)
    }

    public addParticleEmitter(name: string, emitter: ParticleEmitter): void {
        const editorFolder = new EditorFolder(this.pane, emitter)
        editorFolder.hide()

        this.addToSelectParticle(name, editorFolder)
    }
}

export default ParticleEditor
