import ShakeHorizontalAnimation from '@/game/animations/attention/ShakeHorizontal'
import ScaleUpAnimation from '@/game/animations/basic/ScaleUp'
import SlideInAnimation from '@/game/animations/entrances/SlideIn'
import CurveAnimation from '@/game/animations/special/Curve'
import SPRITES from '@/game/constants/resources/sprites'
import BigStarExplosive from '@/game/effects/BigStarExplosive'
import CoinsExplosive from '@/game/effects/CoinsExplosive'
import CoinsExplosive2 from '@/game/effects/CoinsExplosive2'
import CometTwinkle from '@/game/effects/CometTwinkle'
import ConfettiHexagonFallDown from '@/game/effects/ConfettiHexagonFallDown'
import ConfettiSmallFallDown from '@/game/effects/ConfettiSmallFallDown'
import ConfettiSmallFly from '@/game/effects/ConfettiSmallFly'
import DiamondsExplosive from '@/game/effects/DiamondsExplosive'
import FallingStarSparkle from '@/game/effects/FallingStarSparkle'
import PaperFireworkExplosive from '@/game/effects/PaperFireWorkExplosive'
import PaperFireworksCelebration from '@/game/effects/PaperFireworksCelebration'
import SparksExplosive from '@/game/effects/SparksExplosive'
import StarsExplosive from '@/game/effects/StarsExplosive'
import StarsExplosiveSmall from '@/game/effects/StarsExplosiveSmall'
import StarsFlyUp from '@/game/effects/StarsFlyUp'
import StarSparkle from '@/game/effects/StarSparkle'
import StarTwinkle from '@/game/effects/StarTwinkle'
import StarTwinkleUp from '@/game/effects/StarTwinkleUp.'
import StarWhiteTwinkle from '@/game/effects/StarWhiteTwinkle'
import AnimationsScene from '..'

const { KEY, FRAME } = SPRITES.EFFECTS

interface AnimationAction {
    scene: AnimationsScene
    name: string

    run: () => void
    stop: () => void
}

class SlideToTopAnimationAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation1: SlideInAnimation
    private animation2: StarTwinkle

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'SlideToTopAnimation'
    }

    public run = () => {
        const animation = new SlideInAnimation({
            targets: [this.scene.source],
            delay: 250,
            duration: 600,
            ease: 'Back.easeInOut',
            props: {
                scale: 1,
                y: { from: 500, to: 200 },
            },
        })

        animation?.play()

        animation.next(this.runStarTwinkle)

        this.animation1 = animation
    }

    public stop = () => {
        this.animation1.stop()
        this.animation2?.stop()
        this.scene.alignObjects()
    }

    private runStarTwinkle = (): void => {
        const animation = new StarTwinkle(this.scene)

        const { x, y, displayWidth, displayHeight } = this.scene.source
        animation.run(1, x, y, displayWidth, displayHeight)
        this.animation2 = animation
    }
}

class ConfettiSmallAnimationAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private confetti1: ConfettiSmallFallDown
    private confetti2: ConfettiSmallFallDown

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'ConfettiSmallAnimation'
    }

    public run = () => {
        const scene = this.scene

        const confettiSmallFallDownLeftEffect = new ConfettiSmallFallDown(scene, {
            speedX: {
                min: -20,
                max: 100,
            },
            rotate: { start: -360 * 3, end: 0 },
        })

        const confettiSmallFallDownRightEffect = new ConfettiSmallFallDown(scene, {
            speedX: {
                min: 20,
                max: -100,
            },
            rotate: { start: 0, end: 360 * 3 },
        })

        const { width } = scene.gameZone

        confettiSmallFallDownLeftEffect.run(1, 0, 0)
        confettiSmallFallDownRightEffect.run(1, width, 0)

        this.confetti1 = confettiSmallFallDownLeftEffect
        this.confetti2 = confettiSmallFallDownRightEffect
    }

    public stop = () => {
        this.confetti1?.stop()
        this.confetti2?.stop()
        this.confetti1?.kill()
        this.confetti2?.kill()
    }
}

class ConfettiHexagonAnimationAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private confetti: ConfettiHexagonFallDown

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'ConfettiHexagonAnimation'
    }

    public run = () => {
        const scene = this.scene

        const confettiHexagonFallDownEffect = new ConfettiHexagonFallDown(scene)

        const { x, y } = scene.target
        confettiHexagonFallDownEffect.run(2, x, y)

        this.confetti = confettiHexagonFallDownEffect
    }

    public stop = () => {
        this.confetti.stop()
        this.confetti.kill()
    }
}

class StarExplosiveAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: StarsExplosive

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'StarExplosive'
    }

    public run = () => {
        const scene = this.scene

        if (!this.animation) {
            this.animation = new StarsExplosive(scene)
        }

        const { x, y } = scene.source
        this.animation.explode(10, x, y)
    }

    public stop = () => {
        this.animation.pause()
        this.animation.kill()
    }
}

class DiamondsExplosiveAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: DiamondsExplosive

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'DiamondsExplosive'
    }

    public run = () => {
        const scene = this.scene

        const animation = new DiamondsExplosive(scene)
        animation.explode(20, scene.source.x, scene.source.y)
        this.animation = animation
    }

    public stop = () => {
        this.animation.pause()
        this.animation.kill()
    }
}

class SparksExplosiveAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: SparksExplosive

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'SparksExplosive'
    }

    public run = () => {
        const scene = this.scene

        const animation = new SparksExplosive(scene)
        animation.explode(100, scene.source.x, scene.source.y, 180)
        this.animation = animation
    }

    public stop = () => {
        this.animation.pause()
        this.animation.kill()
    }
}

class SparksIdleAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: StarTwinkle

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'SparksIdle'
    }

    public run = () => {
        const scene = this.scene

        const animation = new StarTwinkle(scene)

        const { x, y, displayWidth, displayHeight } = scene.source
        animation.run(1, x, y, displayWidth, displayHeight)
        this.animation = animation
    }

    public stop = () => {
        this.animation.pause()
        this.animation.kill()
    }
}

class StarTwinkleUpAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: StarTwinkleUp

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'StarTwinkleUp'
    }

    public run = () => {
        const scene = this.scene

        const animation = new StarTwinkleUp(scene)

        const { x, y, displayWidth, displayHeight } = scene.source
        animation.run(1, x, y, displayWidth, displayHeight)
        this.animation = animation
    }

    public stop = () => {
        this.animation.pause()
        this.animation.kill()
    }
}

class StarWhiteTwinkleAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: StarWhiteTwinkle

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'StarWhiteTwinkle'
    }

    public run = () => {
        const scene = this.scene

        const animation = new StarWhiteTwinkle(scene)

        const { x, y, displayWidth, displayHeight } = scene.source
        animation.run(1, x, y, displayWidth, displayHeight)
        this.animation = animation
    }

    public stop = () => {
        this.animation.pause()
        this.animation.kill()
    }
}

class CometTwinkleAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: CometTwinkle

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'CometTwinkle'
    }

    public run = () => {
        const scene = this.scene

        const animation = new CometTwinkle(scene)

        const { x, y, displayWidth, displayHeight } = scene.source
        animation.run(1, x, y, displayWidth, displayHeight)
        this.animation = animation
    }

    public stop = () => {
        this.animation.pause()
        this.animation.kill()
    }
}

class BigStarExplosiveAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: BigStarExplosive

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'BigStarExplosive'
    }

    public run = () => {
        const scene = this.scene

        const animation = new BigStarExplosive(scene)

        Phaser.Display.Align.In.Center(scene.source, scene.gameZone)
        Phaser.Display.Align.In.Center(animation, scene.source)

        animation.run()
        this.animation = animation
    }

    public stop = () => {
        this.animation.kill()
        this.scene.alignObjects()
    }
}

class StarsFlyUpAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: StarsFlyUp

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'StarsFlyUp'
    }

    public run = () => {
        const scene = this.scene

        const animation = new StarsFlyUp(scene)

        const { width, height } = scene.gameZone
        animation.run(1, width / 2, height, width, height)
        this.animation = animation
    }

    public stop = () => {
        this.animation.stop()
        this.animation.kill()
    }
}

class ShakeHorizontalAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: ShakeHorizontalAnimation

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'ShakeHorizontal'
    }

    public run = () => {
        const scene = this.scene

        const animation = new ShakeHorizontalAnimation({
            targets: [scene.source],
        })

        animation.play()
        this.animation = animation
    }

    public stop = () => {
        this.animation.stop()
        this.scene.alignObjects()
    }
}

class CurveAnimationAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation1: CometTwinkle
    private animation2: CurveAnimation
    private animation3: SparksExplosive

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'CurveAnimation'
    }

    public run = () => {
        const scene = this.scene

        const { x: targetX, y: targetY } = scene.target
        const { x: sourceX, y: sourceY } = scene.source

        const start = { x: sourceX, y: sourceY }
        const end = { x: targetX, y: targetY }

        scene.objects.setVisible(false)

        const effect = new CometTwinkle(scene)

        const posX = 250
        const posY = 40

        const animation = new CurveAnimation({
            targets: [scene.objects.getChildren()[0]],
            delay: scene.tweens.stagger(80, {}),
            duration: Phaser.Math.RND.between(1000, 2500),
            curve: [
                [start.x, start.y],
                [
                    start.x - Phaser.Math.RND.between(-posX, posX),
                    start.y - Phaser.Math.RND.between(-posY, posY),
                ],
                [end.x, end.y],
            ],
            onComplete: () => {
                scene.objects.setVisible(false)
                this.run()
                this.runSparksExplosive()
            },
            onCurveUpdate: (target) => {
                const radius = 16
                const x = target.x + Phaser.Math.RND.between(-radius, radius)
                const y = target.y + Phaser.Math.RND.between(-radius, radius)
                effect.explode(1, x, y)
            },
        })

        animation.play()

        this.animation1 = effect
        this.animation2 = animation
    }

    public stop = () => {
        this.animation1?.stop()
        this.animation1?.kill()

        this.animation2?.stop()

        this.animation3?.pause()
        this.animation3?.kill()
    }

    private runSparksExplosive = (): void => {
        const scene = this.scene

        const animation = new SparksExplosive(scene)
        animation.explode(100, scene.target.x, scene.target.y, 180)

        this.animation3 = animation
    }
}

class StarTouchAnimationAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: ScaleUpAnimation

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'StarTouchAnimation'
    }

    public run = () => {
        const scene = this.scene

        const circle = scene.make.image({
            key: KEY,
            frame: FRAME.FX_CIRCLE_LIGHT,
        })

        circle.setWorldSize(75.5, 75)
        circle.setPosition(scene.source.x, scene.source.y)

        const scale = 1 / GameCore.Utils.Image.getImageScale()

        const animation = new ScaleUpAnimation({
            targets: [circle],
            duration: 800,
            ease: Phaser.Math.Easing.Cubic.Out,
            props: {
                scale: scale * 2,
                alpha: 0,
            },
            onStop: () => {
                circle.kill()
            },
        })

        animation.play()

        this.animation = animation
    }

    public stop = () => {
        this.animation.stop()
    }
}

class CoinsExplosiveAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: CoinsExplosive

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'CoinsExplosive'
    }

    public run = () => {
        if (!this.animation) {
            const { x, y } = this.scene.target
            this.animation = new CoinsExplosive(this.scene, x, y)
        }

        const { x, y } = this.scene.source
        this.animation.explode(15, x, y)
    }

    public stop = () => {
        //
    }
}

class CoinsExplosive2Action implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: CoinsExplosive2

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'CoinsExplosive2'
    }

    public run = () => {
        if (!this.animation) {
            this.animation = new CoinsExplosive2(this.scene)
        }

        const { x, y } = this.scene.source
        const { x: x1, y: y1 } = this.scene.target
        this.animation.explode(15, x, y, x1, y1)
    }

    public stop = () => {
        //
    }
}

class PaperFireworkExplosiveAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private timer: Phaser.Time.TimerEvent

    private animation: PaperFireworkExplosive

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'PaperFireworkExplosive'
    }

    public run = () => {
        this.animation = new PaperFireworkExplosive(this.scene)

        const x = Phaser.Math.Between(0, 375)
        const y = Phaser.Math.Between(0, 620)

        this.animation.explode(100, x, y, 90)

        this.timer?.remove()
        this.timer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(100, 800),
            callback: this.run,
        })
    }

    public stop = () => {
        this.timer?.remove()
    }
}

class ConfettiSmallFlyAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: ConfettiSmallFly

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'ConfettiSmallFly'
    }

    public run = () => {
        this.animation?.destroy()

        this.animation = new ConfettiSmallFly(this.scene, {
            speedY: {
                min: -12,
                max: -200,
            },
            rotate: { start: 0, end: 360 * 3 },
            angle: { min: 320, max: 355 },
        })

        const { x, y } = this.scene.source

        this.animation.explode(100, x, y)
    }

    public stop = () => {
        //
    }
}

class PaperFireworksCelebrationAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: PaperFireworksCelebration

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'PaperFireworksCelebration'
    }

    public run = () => {
        if (!this.animation) {
            this.animation = new PaperFireworksCelebration(this.scene)
        }

        this.animation.run(0, this.scene.gameZone.height, 375, 200)
    }

    public stop = () => {
        //
    }
}

class StarsExplosiveSmallAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: StarsExplosiveSmall

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'StarsExplosiveSmall'
    }

    public run = () => {
        if (!this.animation) {
            this.animation = new StarsExplosiveSmall(this.scene)
        }

        const { x, y } = this.scene.source
        this.animation.explode(12, x, y)
    }

    public stop = () => {
        //
    }
}

class FallingStarSparkleAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: FallingStarSparkle

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'FallingStarSparkle'
    }

    public run = () => {
        if (!this.animation) {
            this.animation = new FallingStarSparkle(this.scene)
        }

        const { x, y, displayWidth, displayHeight } = this.scene.target
        this.animation.run(1, x, y, displayWidth * 2, displayHeight)
    }

    public stop = () => {
        //
        this.animation.stop()
    }
}

class StarSparkleAction implements AnimationAction {
    public scene: AnimationsScene
    public name: string

    private animation: StarSparkle

    constructor(scene: AnimationsScene) {
        this.scene = scene
        this.name = 'StarSparkle'
    }

    public run = () => {
        if (!this.animation) {
            this.animation = new StarSparkle(this.scene)
        }

        const { x, y, displayWidth, displayHeight } = this.scene.target
        this.animation.run(1, x, y, displayWidth * 2, displayHeight)
    }

    public stop = () => {
        //
        this.animation.stop()
    }
}

export {
    AnimationAction,
    BigStarExplosiveAction,
    CoinsExplosiveAction,
    CoinsExplosive2Action,
    CometTwinkleAction,
    ConfettiHexagonAnimationAction,
    ConfettiSmallAnimationAction,
    ConfettiSmallFlyAction,
    CurveAnimationAction,
    DiamondsExplosiveAction,
    FallingStarSparkleAction,
    PaperFireworkExplosiveAction,
    PaperFireworksCelebrationAction,
    ShakeHorizontalAction,
    SlideToTopAnimationAction,
    SparksExplosiveAction,
    SparksIdleAction,
    StarExplosiveAction,
    StarsExplosiveSmallAction,
    StarsFlyUpAction,
    StarSparkleAction,
    StarTouchAnimationAction,
    StarTwinkleUpAction,
    StarWhiteTwinkleAction,
}
