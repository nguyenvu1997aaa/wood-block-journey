import SPRITES, { demoEffect } from '@/game/constants/resources/sprites'
import BaseScene from '@/game/scenes/BaseScene'
import DEPTH_OBJECTS from '../constants/depth'
import CoinMove from './CoinMove'

const { KEY, FRAME: Demo } = SPRITES.EFFECTS
const FRAME = Demo as demoEffect

class CoinsExplosive extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    public onUpdate: Function
    public onComplete: Function

    private emitter: Phaser.GameObjects.Particles.ParticleEmitter
    private circle: Phaser.Geom.Circle

    constructor(scene: BaseScene, destinationX: number, destinationY: number) {
        super(scene, KEY, FRAME.COIN)

        this.createEmitters(destinationX, destinationY)

        this.setActive(false)
        this.setVisible(false)

        this.scene.add.existing(this)
    }

    private createEmitters(destinationX: number, destinationY: number): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.emitter = this.createEmitter({
            on: false,
            frame: FRAME.COIN,
            angle: { min: 0, max: 360 },
            speed: { min: 240, max: 340 },
            scale: { start: scale, end: scale },
            lifespan: 5000,
            emitCallback: (coin: Phaser.GameObjects.Particles.Particle) => {
                coin.accelerationX = -coin.velocityX / 1.2
                coin.accelerationY = -coin.velocityY / 1.2
            },
            deathCallback: (coin: Phaser.GameObjects.Particles.Particle) => {
                const coinAnimation = new CoinMove(this.scene, {
                    from: { x: coin.x, y: coin.y },
                    to: { x: destinationX, y: destinationY },
                })

                coinAnimation.onUpdate = () => {
                    if (typeof this.onUpdate === 'function') {
                        this.onUpdate()
                    }
                }

                coinAnimation.onComplete = () => {
                    if (typeof this.onComplete === 'function') {
                        this.onComplete()
                    }
                }

                coinAnimation.setDepth(DEPTH_OBJECTS.ON_TOP)
                coinAnimation.run()
            },
        })
    }

    public explode(count: number, x: number, y: number): void {
        this.setActive(true)
        this.setVisible(true)

        if (!this.circle) this.circle = new Phaser.Geom.Circle(x, y, 100)

        this.emitter.deathZone = new Phaser.GameObjects.Particles.Zones.DeathZone(
            this.circle,
            false
        )
        this.emitter.explode(count, x, y)
    }
}

export default CoinsExplosive
