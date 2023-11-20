import { FolderApi } from 'tweakpane'

interface PropValueInput {
    clickToExplode: boolean
    emitterFollowPointer: boolean
    count: number
    x: number
    y: number
}

interface Payload {
    root: FolderApi
    propKey: string
    inputStep?: number
    particleEmitter?: ParticleEmitter
}

type ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
type Pointer = Phaser.Input.Pointer

const { POINTER_DOWN, POINTER_MOVE } = Phaser.Input.Events

class ExplosionOption {
    private particleEmitter?: ParticleEmitter
    private propKey: string

    private root: FolderApi
    private folder: FolderApi
    private propValueInput: PropValueInput

    constructor(payload: Payload) {
        const { root, particleEmitter, propKey } = payload

        this.root = root
        this.particleEmitter = particleEmitter
        this.propKey = propKey

        // set default
        this.propValueInput = {
            clickToExplode: false,
            emitterFollowPointer: false,
            count: 10,
            x: 0,
            y: 0,
        }

        this.createInput()

        this.listenEvents()
    }

    private listenEvents() {
        if (!this.particleEmitter) return

        const manager = this.particleEmitter.manager
        const input = manager.scene.input

        input.on(POINTER_DOWN, (pointer: Pointer) => {
            if (!this.particleEmitter) return

            const { clickToExplode, emitterFollowPointer, count } = this.propValueInput
            const { worldX, worldY } = pointer

            if (clickToExplode) {
                const frequency = this.particleEmitter.frequency

                this.particleEmitter.explode(count, worldX, worldY)

                this.particleEmitter.setFrequency(frequency)

                this.propValueInput.x = worldX
                this.propValueInput.y = worldY
            }

            if (emitterFollowPointer) {
                this.particleEmitter.setPosition(worldX, worldY)
            }
        })

        input.on(POINTER_MOVE, (pointer: Pointer) => {
            if (!this.particleEmitter) return
            if (!pointer.isDown) return

            const { emitterFollowPointer } = this.propValueInput
            const { worldX, worldY } = pointer

            if (emitterFollowPointer) {
                this.particleEmitter.setPosition(worldX, worldY)
            }
        })
    }

    private createInput(): void {
        if (!this.particleEmitter) return

        this.folder = this.root.addFolder({ title: 'Explosion options' })

        this.createExplodeButton()

        this.folder.addInput(this.propValueInput, 'clickToExplode')
        this.folder.addInput(this.propValueInput, 'emitterFollowPointer')
        this.folder.addInput(this.propValueInput, 'count', { step: 1 })
        this.folder.addMonitor(this.propValueInput, 'x')
        this.folder.addMonitor(this.propValueInput, 'y')
    }

    private createExplodeButton() {
        const explodeBtn = this.folder.addButton({
            title: 'Explode',
        })
        explodeBtn.on('click', () => {
            if (!this.particleEmitter) return

            const frequency = this.particleEmitter.frequency
            const { x, y, count } = this.propValueInput

            this.particleEmitter.explode(count, x, y)
            this.particleEmitter.setFrequency(frequency)
        })
    }
}

export default ExplosionOption
