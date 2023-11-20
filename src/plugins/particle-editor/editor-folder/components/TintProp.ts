import { BladeController, TpChangeEvent, View } from '@tweakpane/core'
import { BladeApi, FolderApi, InputBindingApi, ListApi } from 'tweakpane'
import easing from '../../const/easing'

interface Input {
    value: string
}
interface XY {
    x: number
    y: number
}

interface XYZ {
    x: number
    y: number
    z: number
}

interface PropValueInput {
    value: string
    values: string[]
    composite: boolean
    array: boolean
    random: boolean
    startEndSteps: XYZ
    minMax: XY
    ease: string
}

interface Payload {
    root: FolderApi
    propKey: string
    inputStep?: number
    particleEmitter?: ParticleEmitter
}

const hasOwn = GameCore.Utils.Object.hasOwn
const isObject = GameCore.Utils.Valid.isObject
const isNumber = GameCore.Utils.Valid.isNumber

type ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter

class ComplexProp {
    protected particleEmitter?: ParticleEmitter
    protected propKey: string

    private root: FolderApi
    private folder: FolderApi
    protected propValueInput: PropValueInput
    protected inputStep: number

    private valueInput: InputBindingApi<unknown, number>
    private valueInputs: FolderApi
    private valueInputsMap: Map<number, Input> = new Map<number, Input>()
    private valueInputIndex = 0

    private arrayInput: InputBindingApi<unknown, boolean>
    private randomInput: InputBindingApi<unknown, boolean>
    private minMaxInput: InputBindingApi<unknown, Phaser.Math.Vector2>
    private startEndStepsInput: InputBindingApi<unknown, Phaser.Math.Vector3>
    private ease: BladeApi<BladeController<View>>

    constructor(payload: Payload) {
        const { root, particleEmitter, propKey, inputStep = 1 } = payload

        this.root = root
        this.particleEmitter = particleEmitter
        this.propKey = propKey
        this.inputStep = inputStep

        // set default
        this.propValueInput = {
            value: '',
            values: [],
            composite: false,
            array: false,
            random: false,
            startEndSteps: { x: 0, y: 0, z: 0 },
            minMax: { x: 0, y: 0 },
            ease: 'None',
        }

        if (this.fetchPropValue()) {
            this.createInput()
        }
    }

    protected fetchPropValue(): boolean {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const value = this.particleEmitter?.[this.propKey]?.propertyValue as unknown

        if (value === undefined) return false

        if (Array.isArray(value)) {
            this.propValueInput.composite = false
            this.propValueInput.value = '#' + (value[0] as number).toString(16)
            this.propValueInput.values = value.map((ele) => '#' + (ele as number).toString(16))

            return true
        } else if (isNumber(value)) {
            this.propValueInput.composite = false
            this.propValueInput.value = '#' + value.toString(16)
            this.propValueInput.values = [this.propValueInput.value]

            return true
        } else if (isObject(value)) {
            if (hasOwn(value, 'start') && hasOwn(value, 'end')) {
                this.propValueInput.composite = true

                const { startEndSteps } = this.propValueInput

                startEndSteps.x = value.start as number
                startEndSteps.y = value.end as number

                if (hasOwn(value, 'random')) {
                    this.propValueInput.random = true
                } else if (hasOwn(value, 'steps')) {
                    startEndSteps.z = value.steps as number
                } else if (hasOwn(value, 'ease')) {
                    this.propValueInput.ease = value.ease as string
                } else {
                    this.propValueInput.ease = 'Linear'
                }

                return true
            } else if (hasOwn(value, 'min') && hasOwn(value, 'max')) {
                this.propValueInput.random = true

                const { minMax } = this.propValueInput

                minMax.x = value.min as number
                minMax.y = value.max as number
                return true
            }
        }

        return false
    }

    private createInput(): void {
        //
        this.folder = this.root.addFolder({
            title: this.propKey,
        })

        const step = this.inputStep

        const fixed = Math.round(Math.log10(1 / step))
        const format = (v: number) => v.toFixed(fixed)

        const opt_params = { step, format }

        const folder = this.folder

        folder.addInput(this.propValueInput, 'composite')
        this.arrayInput = folder.addInput(this.propValueInput, 'array')

        this.valueInput = folder.addInput(this.propValueInput, 'value')

        this.valueInputs = folder.addFolder({ title: 'values' })

        const addValueBtn = this.valueInputs.addButton({
            title: 'Add value',
        })
        addValueBtn.on('click', () => {
            this.addValueInput(this.propValueInput.value)
        })

        this.randomInput = folder.addInput(this.propValueInput, 'random')

        this.minMaxInput = folder.addInput(this.propValueInput, 'minMax')

        this.startEndStepsInput = folder.addInput(this.propValueInput, 'startEndSteps', {
            z: opt_params,
        })

        this.ease = folder.addBlade({
            view: 'list',
            label: 'ease',
            options: easing,
            value: this.propValueInput.ease,
        })

        this.propValueInput.values.forEach((value) => this.addValueInput(value))

        this.updateProp()

        folder.on('change', this.update)
    }

    private addValueInput = (value: string): void => {
        const step = this.inputStep

        const fixed = Math.round(Math.log10(1 / step))
        const format = (v: number) => v.toFixed(fixed)

        const opt_params = { step, format }
        const param = {
            value,
        }
        const index = this.valueInputIndex
        this.valueInputsMap.set(index, param)

        const input = this.valueInputs.addInput(param, 'value', opt_params)

        input.controller_.view.labelElement.addEventListener('click', () => {
            if (this.valueInputsMap.size === 1) return

            this.valueInputsMap.delete(index)
            input.hidden = true
            this.update()
        })

        this.valueInputIndex += 1

        this.update()
    }

    private update = (ev?: TpChangeEvent<unknown>) => {
        if (ev && ev.target instanceof ListApi && ev.target.label === 'ease') {
            this.propValueInput.ease = ev.target.value
        }

        this.updateProp()

        const propValue = this.toPropValue()

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.particleEmitter?.[this.propKey]?.onChange(propValue)
    }

    private updateProp() {
        if (!this.propValueInput.composite) {
            this.randomInput.hidden = true
            this.startEndStepsInput.hidden = true
            this.minMaxInput.hidden = true
            this.ease.hidden = true
            this.arrayInput.hidden = false

            if (this.propValueInput.array) {
                this.valueInputs.hidden = false
                this.valueInput.hidden = true
            } else {
                this.valueInputs.hidden = true
                this.valueInput.hidden = false
            }
        } else {
            this.valueInputs.hidden = true
            this.valueInput.hidden = true
            this.arrayInput.hidden = true

            this.randomInput.hidden = false

            if (this.propValueInput.random) {
                this.minMaxInput.hidden = false

                this.startEndStepsInput.hidden = true
                this.ease.hidden = true
            } else {
                this.minMaxInput.hidden = true

                this.startEndStepsInput.hidden = false
                this.ease.hidden = false
            }
        }
    }

    private toPropValue() {
        type EmitterOpOnEmitType = Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType
        type EmitterOpOnUpdateType = Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType
        let config: EmitterOpOnEmitType | EmitterOpOnUpdateType

        const values: number[] = []
        this.valueInputsMap.forEach((ele) => {
            values.push(this.colorToInt(ele.value))
        })

        if (!this.propValueInput.composite) {
            if (this.propValueInput.array) {
                config = values
            } else {
                config = this.colorToInt(this.propValueInput.value)
            }
        } else {
            if (this.propValueInput.random) {
                const { x: min, y: max } = this.propValueInput.minMax
                config = { min, max }
            } else {
                const { x: start, y: end, z: steps } = this.propValueInput.startEndSteps
                const { ease } = this.propValueInput
                if (ease && ease !== 'None') {
                    config = {
                        start,
                        end,
                        ease,
                    }
                } else {
                    config = {
                        start,
                        end,
                        steps,
                    }
                }
            }
        }

        return config
    }

    private colorToInt(colorStr: string) {
        const color = Phaser.Display.Color.HexStringToColor(colorStr)
        return color.color
    }
}

export default ComplexProp
