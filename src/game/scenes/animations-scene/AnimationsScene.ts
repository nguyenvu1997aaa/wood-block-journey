import ConfettiAnimation from '@/game/animations/frames/Confetti'
import ANIMATIONS from '@/game/constants/animation'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import BaseScene from '../BaseScene'
import {
    BigStarExplosiveAction,
    CoinsExplosive2Action,
    CoinsExplosiveAction,
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
} from './animation-scroller/AnimationAction'
import AnimationScroller from './animation-scroller/AnimationScroller'

const { KEY, FRAME } = SPRITES.EFFECTS

class AnimationsScene extends BaseScene {
    public target: Phaser.GameObjects.Image
    public source: Phaser.GameObjects.Image
    public objects: Phaser.GameObjects.Group

    private scroller: AnimationScroller

    public preload(): void {
        this.textures.removeKey(SPRITES.EFFECTS.KEY)

        this.load.multiatlas({
            key: SPRITES.ANIMATION_SCENE.KEY,
            path: SPRITES.ANIMATION_SCENE.PATH,
            atlasURL: SPRITES.ANIMATION_SCENE.JSON,
        })
    }

    public create(): void {
        super.create()

        this.createBackground(KEY, FRAME.BLANK, 0x000000)

        this.createTargetObject()
        this.createSourceObject()

        this.createMultiObjects()

        this.createSpriteAnimations()

        this.createAnimationScroller()

        this.alignObjects()

        const { POINTER_DOWN } = Phaser.Input.Events
        this.gameZone.setInteractive().on(POINTER_DOWN, this.scroller.runCurrentAnim)
    }

    private createAnimationScroller(): void {
        const scroller = new AnimationScroller(this)

        scroller.addButton(new BigStarExplosiveAction(this))

        scroller.addButton(new CoinsExplosiveAction(this))
        scroller.addButton(new CoinsExplosive2Action(this))
        scroller.addButton(new CometTwinkleAction(this))
        scroller.addButton(new ConfettiHexagonAnimationAction(this))
        scroller.addButton(new ConfettiSmallAnimationAction(this))
        scroller.addButton(new ConfettiSmallFlyAction(this))
        scroller.addButton(new CurveAnimationAction(this))

        scroller.addButton(new DiamondsExplosiveAction(this))

        scroller.addButton(new FallingStarSparkleAction(this))

        scroller.addButton(new PaperFireworkExplosiveAction(this))
        scroller.addButton(new PaperFireworksCelebrationAction(this))

        scroller.addButton(new ShakeHorizontalAction(this))
        scroller.addButton(new SlideToTopAnimationAction(this))
        scroller.addButton(new SparksExplosiveAction(this))
        scroller.addButton(new SparksIdleAction(this))
        scroller.addButton(new StarExplosiveAction(this))
        scroller.addButton(new StarsExplosiveSmallAction(this))
        scroller.addButton(new StarsFlyUpAction(this))
        scroller.addButton(new StarSparkleAction(this))
        scroller.addButton(new StarTouchAnimationAction(this))
        scroller.addButton(new StarTwinkleUpAction(this))
        scroller.addButton(new StarWhiteTwinkleAction(this))

        this.scroller = scroller
    }

    private createTargetObject(): void {
        this.target = this.make.image({
            key: KEY,
            frame: FRAME.BLANK,
        })

        this.target.setTint(0x4ec497)
        this.target.setWorldSize(50, 50)
    }

    private createSourceObject(): void {
        this.source = this.make.image({
            key: KEY,
            frame: FRAME.BLANK,
        })

        this.source.setTint(0x499cd6)
        this.source.setWorldSize(50, 50)
    }

    private createMultiObjects(): void {
        this.objects = this.make.group({
            repeat: 10,
            key: KEY,
            frame: FRAME.BLANK,
            classType: Phaser.GameObjects.Image,
            createMultipleCallback: (items) => {
                items.forEach((item) => {
                    item.setSize(80, 80)
                })
            },
        })

        this.objects.setTint(0xbdb9ae)
        this.objects.setVisible(false)
    }

    private createSpriteAnimations(): void {
        const confettiAnimation = new ConfettiAnimation(this.anims)
        this.anims.add(ANIMATIONS.CONFETTI_HEXAGON.KEY, confettiAnimation)
    }

    public alignObjects(): void {
        Phaser.Display.Align.In.TopCenter(this.target, this.gameZone, 0, -100)
        Phaser.Display.Align.In.BottomCenter(this.source, this.gameZone, 0, -150)
    }
}

export default AnimationsScene

if (import.meta.hot) {
    import.meta.hot.accept(GameCore.LiveUpdate.Scene(SceneKeys.ANIMATIONS_SCENE))
}
