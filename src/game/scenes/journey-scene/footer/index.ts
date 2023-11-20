import Button from '@/game/components/Button'
import DEPTH_OBJECTS from '@/game/constants/depth'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import GameScene from '..'
import Pieces from './Pieces'
import SettingButton from './SettingButton'

const { KEY, FRAME } = SPRITES.GAMEPLAY
const { KEY: KEY_DEFAULT, FRAME: FRAME_DEFAULT } = SPRITES.DEFAULT

class Footer extends Phaser.GameObjects.Container {
    public scene: GameScene
    public pieces: Pieces

    private debugButton: Button
    public textExist: Phaser.GameObjects.BitmapText
    public background: Phaser.GameObjects.Image

    //Landscape
    private pX: number
    private pY: number
    public buttonSetting: SettingButton
    public panelNextBlock: Phaser.GameObjects.Image
    public textNextBlock: Phaser.GameObjects.Image

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        this.setSize(this.scene.gameZone.width, 85)

        scene.add.existing(this)

        this.init()
    }

    private init(): void {
        // this.createBackground()

        this.createDebugButton()

        // Landscape
        this.addBgPieces()
        this.createTextNextBlock()
        this.createSettingButton()

        this.createPieces()
    }

    private createBackground(): void {
        this.background = this.scene.make.image({
            key: KEY_DEFAULT,
            frame: FRAME_DEFAULT.FOOTER,
        })

        const { width } = this.scene.gameZone

        this.background.setWorldSize(width, this.height)

        this.add(this.background)

        Phaser.Display.Align.In.BottomCenter(this.background, this)
    }

    private createPieces(): void {
        this.pieces = new Pieces(this.scene)

        this.add(this.pieces)

        this.pieces.setPosition(0, 30)
    }

    private createDebugButton(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return

        this.createDebugButtonNextPieces()
    }

    private createDebugButtonNextPieces(): void {
        this.debugButton = new Button(this.scene, KEY, FRAME.BUTTON_WOOD_SMALL, 100, 30)
        this.debugButton.setName('Debug')

        const text = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(30),
            text: 'Next pieces',
            origin: { x: 0.5, y: 0.5 },
        })

        this.debugButton.add([text])

        this.debugButton.onClick = this.clickButtonNextPieces.bind(this)

        this.add(this.debugButton)

        Phaser.Display.Align.In.BottomLeft(this.debugButton, this)

        this.textExist = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(30),
            text: 'Exist',
            origin: { x: 0.5, y: 0.5 },
        })

        this.debugButton.add([this.textExist])

        Phaser.Display.Align.In.Center(this.textExist, this, 80, 0)
    }

    private clickButtonNextPieces(): void {
        const { footer } = this.scene.layoutManager.objects
        footer.pieces.debuggerNextPieces()
    }

    // Landscape
    public updateUILandscape(): void {
        this.initPosition()
        // this.updateBg()

        this.panelNextBlock.setVisible(true)
        this.textNextBlock.setVisible(true)
        this.buttonSetting.setVisible(true)
        this.debugButton?.setVisible(false)
        this.textExist?.setVisible(false)

        const bannerHeight = this.scene.ads.getBannerHeight()

        Phaser.Display.Align.In.BottomLeft(
            this.buttonSetting,
            this.scene.gameZone,
            -5,
            -bannerHeight / 2 - 5
        )
    }

    private initPosition(): void {
        const space = this.panelNextBlock.displayHeight / 3

        this.pieces.positionPiece = [
            { x: 0, y: -space },
            { x: 0, y: 0 },
            { x: 0, y: space },
        ]

        this.pieces.setPosition(0, 0)
    }

    private updateBg(): void {
        this.background.setVisible(false)
    }

    private addBgPieces(): void {
        this.panelNextBlock = this.scene.make.image({
            key: KEY_DEFAULT,
            frame: FRAME_DEFAULT.PANEL_NEXT_BLOCK,
        })

        this.panelNextBlock.setVisible(false)
        this.panelNextBlock.setWorldSize(100.5, 300)

        this.add(this.panelNextBlock)
    }

    private createTextNextBlock(): void {
        const imageScale = this.scene.world.getPixelRatio()

        this.textNextBlock = this.scene.make.image({
            key: KEY_DEFAULT,
            frame: FRAME_DEFAULT.TEXT_NEXT_BLOCK,
        })

        const { width, height } = this.textNextBlock

        this.textNextBlock.setVisible(false)
        this.textNextBlock.setWorldSize(width / imageScale, height / imageScale)

        this.add(this.textNextBlock)

        Phaser.Display.Align.In.TopCenter(this.textNextBlock, this.panelNextBlock, 0, 42)
    }

    private createSettingButton(): void {
        this.buttonSetting = new SettingButton(this.scene)

        this.buttonSetting.setWorldSize(52, 45)
        this.buttonSetting.setVisible(false)

        this.buttonSetting.onClick = this.handleClickSetting.bind(this)

        this.buttonSetting.setDepth(DEPTH_OBJECTS.BUTTON)
    }

    private handleClickSetting(): void {
        this.scene.handlePauseGame()
    }
}

export default Footer
