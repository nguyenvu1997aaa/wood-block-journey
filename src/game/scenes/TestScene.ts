import { SceneKeys } from '@/game/constants/scenes'
import SPRITES from '../constants/resources/sprites'
import BaseScene from './BaseScene'

const { DEMO_SPINE } = SPRITES

class TestScene extends BaseScene {
    private fontName: string
    private text: Phaser.GameObjects.Text

    private run = (): void => {
        //
    }

    public preload(): void {
        this.events.on('wake', this.run)
        this.events.once('create', this.run)

        this.scene.isPaused()

        this.fontName = 'Bebas'
        this.textStyler.addFont({
            type: 'local',
            fontName: this.fontName,
            fontType: 'truetype',
        })

        // ? Enable preMultipliedAlpha for some spines use that
        this.load.spine(DEMO_SPINE.KEY, DEMO_SPINE.jsonPATH, DEMO_SPINE.atlasPATH, true)
    }

    public create(): void {
        super.create()

        this.cameras.main.setBackgroundColor(0x4a4a4a)

        this.createSpine()
        this.createTextObject()
    }

    private createTextObject(): void {
        this.text = this.add.text(0, 0, 'Text Styler', {
            fontFamily: this.fontName,
            fontSize: '50px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        })

        this.text.setHighQuality()

        Phaser.Display.Align.In.Center(this.text, this.gameZone)
    }

    private createSpine() {
        const spine = this.add.spine(200, 300, DEMO_SPINE.KEY)

        // ? That spine use size 2x
        // ? So we need to scale it for correct display
        spine.setScale(0.5)

        const animations = spine.getAnimationList()
        console.log('🤖 ? Spine animations', animations)

        const rand = Math.floor(Math.random() * animations.length)
        spine.setAnimation(0, animations[rand], true)
    }
}

export default TestScene

if (import.meta.hot) {
    import.meta.hot.accept(GameCore.LiveUpdate.Scene(SceneKeys.TEST_SCENE))
}
