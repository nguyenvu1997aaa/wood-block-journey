import { FolderApi } from 'tweakpane'
import defaultConfig from '../const/defaultConfig'
import { complexMap, primitiveMap } from '../const/editorConfig'
import ComplexProp from './components/ComplexProp'
import ExplosionOption from './components/ExplosionOption'
import FramesProp from './components/FramesProp'
import PrimitiveProp from './components/PrimitiveProp'
import TintProp from './components/TintProp'

type ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
type ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager

class EditorFolder {
    protected particleEmitter?: ParticleEmitter
    protected particle: ParticleEmitterManager

    private root: FolderApi

    constructor(root: FolderApi, particleEmitter?: ParticleEmitter) {
        this.particleEmitter = particleEmitter
        this.root = root.addFolder({
            title: 'Editor',
        })

        if (this.particleEmitter) {
            this.createExportButton()
            this.createMonitorConfig()
            this.createResetDefaultButton()
            this.createOptions()
            this.createPrimitiveProp()
            this.createFramesProp()
            this.createTintProp()
            this.createComplexProp()
        }
    }

    private createExportButton(): void {
        this.root
            .addButton({
                title: 'Export JSON',
            })
            .on('click', this.exportEmitterToJSON)
    }

    private configParam = {
        config: '{}',
    }

    private createMonitorConfig(): void {
        if (!this.particleEmitter) return

        this.root.addMonitor(this.configParam, 'config')

        this.root.on('change', this.updateMonitorConfig)

        this.updateMonitorConfig()
    }

    private updateMonitorConfig = (): void => {
        if (!this.particleEmitter) return

        const config = this.particleEmitter.toJSON()

        this.configParam.config = JSON.stringify(config)
    }

    private createResetDefaultButton(): void {
        this.root
            .addButton({
                title: 'Reset default',
            })
            .on('click', () => {
                this.particleEmitter?.fromJSON(defaultConfig)
            })
    }

    public importEmitterFromJSON(config: Object): void {
        //
        this.particleEmitter?.fromJSON(config)

        // @ts-expect-error: ''
        this.particleEmitter?.setRadial(config.radial || true)
    }

    private exportEmitterToJSON = () => {
        if (!this.particleEmitter) return

        const config = this.particleEmitter.toJSON()

        console.log(JSON.stringify(config))

        this.downloadConfig(config, 'emitterConfig')
    }

    private downloadConfig(config: Object, exportName: string) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config))
        const downloadAnchorNode = document.createElement('a')

        downloadAnchorNode.setAttribute('href', dataStr)
        downloadAnchorNode.setAttribute('download', exportName + '.json')
        document.body.appendChild(downloadAnchorNode) // required for firefox
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
    }

    private createOptions(): void {
        new ExplosionOption({
            root: this.root,
            propKey: 'Explosion options',
            particleEmitter: this.particleEmitter,
        })
    }

    private createComplexProp(): void {
        const folder = this.root.addFolder({
            title: complexMap.folder,
            expanded: false,
        })

        complexMap.props.forEach((prop) => {
            new ComplexProp({
                root: folder,
                propKey: prop.key,
                particleEmitter: this.particleEmitter,
                inputStep: prop.steps,
            })
        })
    }

    private createTintProp(): void {
        new TintProp({
            root: this.root,
            propKey: 'tint',
            particleEmitter: this.particleEmitter,
            inputStep: 1,
        })
    }

    private createFramesProp(): void {
        new FramesProp({
            root: this.root,
            propKey: 'frames',
            particleEmitter: this.particleEmitter,
        })
    }

    private createPrimitiveProp(): void {
        const folder = this.root.addFolder({
            title: primitiveMap.folder,
        })
        primitiveMap.props.forEach((prop) => {
            new PrimitiveProp({
                root: folder,
                propKey: prop.key,
                particleEmitter: this.particleEmitter,
                inputStep: prop.steps,
            })
        })
    }

    public show() {
        this.root.hidden = false
    }

    public hide() {
        this.root.hidden = true
    }
}

export default EditorFolder
