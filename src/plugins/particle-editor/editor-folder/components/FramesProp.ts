import { FolderApi, InputBindingApi, ListApi } from 'tweakpane'

interface Input {
    frame: string
}

interface PropValueInput {
    frames: string[]
    random: boolean
    quantity: number
}

interface Payload {
    root: FolderApi
    propKey: string
    inputStep?: number
    particleEmitter?: ParticleEmitter
}

type ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter

class FramesProp {
    protected particleEmitter?: ParticleEmitter
    protected frames: string[]
    protected propKey: string

    private root: FolderApi
    private folder: FolderApi
    protected propValueInput: PropValueInput
    protected inputStep: number

    private valueInputsMap: Map<number, Input> = new Map<number, Input>()
    private valueInputIndex = 0

    private randomInput: InputBindingApi<unknown, boolean>
    private quantityInput: InputBindingApi<unknown, boolean>

    constructor(payload: Payload) {
        const { root, particleEmitter, propKey, inputStep = 1 } = payload

        this.root = root
        this.particleEmitter = particleEmitter
        this.propKey = propKey
        this.inputStep = inputStep

        // set default
        this.propValueInput = {
            random: true,
            quantity: 1,
            frames: [],
        }

        if (this.fetchPropValue()) {
            this.createInput()
        }
    }

    protected fetchPropValue(): boolean {
        const frames = this.particleEmitter?.frames
        if (!frames || !this.particleEmitter) return false

        this.frames = this.getEffectFrames()

        this.propValueInput.frames = frames.map((frame) => frame.name)

        return true
    }

    private createInput(): void {
        //
        this.folder = this.root.addFolder({
            title: this.propKey,
        })

        const folder = this.folder

        this.randomInput = folder.addInput(this.propValueInput, 'random')
        this.quantityInput = folder.addInput(this.propValueInput, 'quantity', { step: 1 })

        const addFrameBtn = folder.addButton({
            title: 'Add frame',
        })

        addFrameBtn.on('click', () => {
            this.addValueInput(this.propValueInput.frames[0])
        })

        this.propValueInput.frames.forEach((frame) => this.addValueInput(frame))

        folder.on('change', this.update)
    }

    private addValueInput = (frame: string): void => {
        const param = {
            frame,
        }
        const index = this.valueInputIndex
        this.valueInputsMap.set(index, param)

        const options = this.frames.map((frame) => {
            return {
                text: frame,
                value: frame,
            }
        })

        const input = this.folder.addBlade({
            view: 'list',
            label: 'frame',
            options,
            value: frame,
        }) as ListApi<string>

        input.controller_.view.labelElement.addEventListener('click', () => {
            if (this.valueInputsMap.size === 1) return

            this.valueInputsMap.delete(index)
            input.hidden = true
            this.update()
        })

        this.valueInputIndex += 1

        input.on('change', (ev) => {
            param.frame = ev.value
        })
    }

    private update = () => {
        const frames: string[] = []

        this.valueInputsMap.forEach((frame) => {
            if (this.particleEmitter?.texture.get(frame.frame)) {
                frames.push(frame.frame)
            }
        })
        const { random, quantity } = this.propValueInput

        this.particleEmitter?.setFrame(frames, random, quantity)
    }

    private getEffectFrames() {
        const frames = this.particleEmitter?.texture.frames
        if (!frames) return []

        const result: string[] = []
        for (const key in frames) {
            if (key === '__BASE') {
                continue
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            result.push(frames[key].name)
        }

        return result
    }
}

export default FramesProp
