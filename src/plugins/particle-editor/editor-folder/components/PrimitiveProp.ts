import { FolderApi } from 'tweakpane'

interface PropValueInput {
    value: number | boolean | string
}

interface Payload {
    root: FolderApi
    propKey: string
    inputStep?: number
    particleEmitter?: ParticleEmitter
}

const { isNumber, isString, isBoolean } = GameCore.Utils.Valid

type ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter

class PrimitiveProp {
    private particleEmitter?: ParticleEmitter
    private propKey: string

    private root: FolderApi
    private propValueInput: PropValueInput
    private inputStep: number

    constructor(payload: Payload) {
        const { root, particleEmitter, propKey, inputStep = 1 } = payload

        this.root = root
        this.particleEmitter = particleEmitter
        this.propKey = propKey
        this.inputStep = inputStep

        // set default
        this.propValueInput = {
            value: 0,
        }

        if (this.fetchPropValue()) {
            this.createInput()
        }
    }

    private fetchPropValue(): boolean {
        const key = this.propKey as keyof ParticleEmitter

        const value = this.particleEmitter?.[key] as unknown

        if (value === undefined) return false

        if (isNumber(value) || isString(value) || isBoolean(value)) {
            this.propValueInput.value = value

            return true
        }

        return false
    }

    private createInput(): void {
        if (!this.particleEmitter) return

        const step = this.inputStep

        const fixed = Math.round(Math.log10(1 / step))
        const format = (v: number) => v.toFixed(fixed)

        const opt_params = { step, format }

        const key = this.propKey as keyof ParticleEmitter
        this.root.addInput(this.particleEmitter, key, opt_params)
    }
}

export default PrimitiveProp
