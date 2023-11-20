import SPRITES, { demoEffect } from '@/game/constants/resources/sprites'
import StarsExplosive from './StarsExplosive'
import DEPTH_OBJECTS from '@/game/constants/depth'
import StarsExplosiveSmall from './StarsExplosiveSmall'

const { KEY, FRAME: Demo } = SPRITES.EFFECTS
const FRAME = Demo as demoEffect

class CoinsExplosive2 extends Phaser.GameObjects.Container {
    private coinGroup: Phaser.GameObjects.Group
    private containerGroup: Phaser.GameObjects.Group

    private startsExplosive: StarsExplosive
    private startsExplosiveSmall: StarsExplosiveSmall
    private startsExplosiveSmallTimer: Phaser.Time.TimerEvent

    private gravity = 300

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.setVisible(true)

        this.coinGroup = this.scene.add.group({
            defaultKey: KEY,
            defaultFrame: FRAME.COIN,
        })

        this.containerGroup = this.scene.add.group({
            classType: Phaser.GameObjects.Container,
        })

        this.startsExplosive = new StarsExplosive(scene)
        this.startsExplosive.setDepth(DEPTH_OBJECTS.ON_TOP + 1)

        this.startsExplosiveSmall = new StarsExplosiveSmall(scene)
        this.startsExplosiveSmall.setDepth(DEPTH_OBJECTS.ON_TOP + 1)

        this.scene.add.existing(this)
    }

    private createConfigOne(dist: number, container: Phaser.GameObjects.Container, left: boolean) {
        const scale = dist / 300
        const startPoint = new Phaser.Math.Vector2(0, 0)
        const endPoint = new Phaser.Math.Vector2(0, -dist)

        const random = left ? -1 : 1

        const angle1 = Phaser.Math.RND.between(-90, 90)
        const magicNumber = angle1 < 0 ? 1 : (300 - Math.abs(angle1)) / 300 //
        const maxLength1 = ((angle1 + 90) / 180) * 180 * magicNumber * scale
        const length1 = Phaser.Math.RND.between(20, maxLength1 + 20)
        const vec1 = new Phaser.Math.Vector2(1, 0)
        vec1.setAngle((angle1 * Math.PI) / 180)

        const angle2 = Phaser.Math.RND.between(-Math.abs(angle1) - 15, -Math.abs(angle1) + 15)
        const maxLength2 = ((length1 * (100 - Math.abs(angle1))) / 100) * scale
        const length2 = Phaser.Math.RND.between(maxLength2 * 0.2, maxLength2)
        const vec2 = new Phaser.Math.Vector2(1, 0)
        vec2.setAngle((angle2 * Math.PI) / 180)

        const x1 = random * vec1.x * length1
        const y1 = vec1.y * length1
        const x2 = random * vec2.x * length2
        const y2 = vec2.y * length2 - dist
        const controlPoint1 = new Phaser.Math.Vector2(x1, y1)
        const controlPoint2 = new Phaser.Math.Vector2(x2, y2)

        const curve = new Phaser.Curves.CubicBezier(
            startPoint,
            controlPoint1,
            controlPoint2,
            endPoint
        )

        const duration = Phaser.Math.RND.between(1500 + length1 * 3, 2000 + length1 * 3)

        const coin: Phaser.GameObjects.Sprite = this.coinGroup.get(0, 0)
        coin.revive()
        coin.setRotation(-container.rotation)
        coin.setWorldSize(24, 22)
        container.add(coin)

        return {
            from: 0,
            to: 1,
            duration,
            ease: 'Sine.In',
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                const point = curve.getPointAt(tween.getValue())
                coin.setPosition(point.x, point.y)
            },
            onComplete: (tween: Phaser.Tweens.Tween) => {
                coin.kill()
                if (tween.totalProgress < 1) return

                // this.scene.audio.playSound(SOUND_EFFECT.DIAMONDS_EAT)

                // chi goi explode moi 100ms
                if (this.startsExplosiveSmallTimer && !this.startsExplosiveSmallTimer.hasDispatched)
                    return
                this.startsExplosiveSmallTimer = this.scene.time.delayedCall(100, () => null)

                const pos = coin.getWorldPosition()
                this.startsExplosiveSmall.explode(10, pos.x, pos.y)
            },
        }
    }

    public explode(count: number, srcX: number, srcY: number, destX: number, destY: number) {
        if (count <= 0) return []

        this.startsExplosive.explode(30, srcX, srcY)

        const vec = new Phaser.Math.Vector2(destX - srcX, destY - srcY)
        const dist = vec.length()

        const container: Phaser.GameObjects.Container = this.containerGroup.get(srcX, srcY)
        container.setRotation(vec.angle() + Math.PI / 2)
        container.revive()
        this.add(container)

        let longestTween: Phaser.Tweens.Tween | undefined = undefined
        let totalTime = 0

        const allTweens: Phaser.Tweens.Tween[] = []

        for (let i = 0; i < count; i++) {
            const config = this.createConfigOne(dist, container, i % 2 === 0)
            const tween = this.scene.tweens.addCounter(config)
            allTweens.push(tween)

            if (config.duration > totalTime) {
                totalTime = config.duration
                longestTween = tween
            }
        }

        const killEffectBeforeSceneSleep = () => {
            allTweens.forEach((tween) => {
                tween.complete()
            })
            this.startsExplosive.emitters.getAt(0)?.killAll()
            this.startsExplosiveSmall.emitters.getAt(0)?.killAll()
            container.kill()
        }

        longestTween?.once(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
            container.kill()
            this.scene.events.off('sleep', killEffectBeforeSceneSleep)
        })

        this.scene.events.once('sleep', killEffectBeforeSceneSleep)

        return allTweens
    }
}

export default CoinsExplosive2
