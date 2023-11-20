import SPRITES from '@/game/constants/resources/sprites'
import GameScene from '@/game/scenes/game-scene'
import { SQUARE_1_TYPE } from '@/game/scenes/game-scene/constant/piece'
import TutorialManager from '../components/TutorialManager'

class StepFour {
    private scene: GameScene
    private manager: TutorialManager
    private tweenHand: Phaser.Tweens.Tween
    public dataInit = {
        fen: '4bb3/4bb3/4bb3/3bb4/bbbb2bbb/bbbb1bbbb/4bb3/4bb3/4bb3 l tz-vr,b',
        piece: SQUARE_1_TYPE,
        position: { x: 4, y: 3 },
    }

    constructor(manager: TutorialManager) {
        this.scene = manager.scene
        this.manager = manager
    }

    public start(): void {
        this.initBoardData()
        this.handleHighlight()
        this.createTweenHand()
    }

    private initBoardData(): void {
        this.manager.handleGuidePlayStep(this.dataInit.fen)
    }

    public createTweenHand(): void {
        const { dataBoard, cellSize } = this.scene.layoutManager.objects.main.board
        const { allPieces, piecesActive } = this.scene.layoutManager.objects.footer.pieces

        const startX = allPieces[piecesActive[0].position].getWorldPosition().x + cellSize / 2
        const startY = allPieces[piecesActive[0].position].getWorldPosition().y + cellSize
        const endX = dataBoard[4][4].cell.getWorldPosition().x + cellSize / 2
        const endY = dataBoard[4][4].cell.getWorldPosition().y + cellSize / 2

        this.manager.handFrame.setVisible(true)
        this.manager.handFrame.setPosition(startX, startY)

        this.tweenHand?.remove()

        this.tweenHand = this.scene.add.tween({
            repeatDelay: 500,
            targets: this.manager.handFrame,
            repeat: -1,
            x: {
                from: startX,
                to: endX,
            },
            y: {
                from: startY,
                to: endY,
            },
            duration: 1500,
            ease: Phaser.Math.Easing.Sine.InOut,
        })
    }

    private handleHighlight(): void {
        const hl = [
            { x: 5, y: 3 },
            { x: 5, y: 4 },
            { x: 4, y: 4 },
            { x: 4, y: 5 },
        ]

        const { main } = this.scene.layoutManager.objects

        for (let i = 0; i < hl.length; i++) {
            const { x, y } = hl[i]
            main.board.dataBoard[y][x].cell.setFrameImageCell(
                SPRITES.GAMEPLAY_32.FRAME.GEM_HIGHT_LIGHT
            )
            main.board.dataBoard[y][x].cell.stopAnimShaking()
        }
    }

    public dragStart(): void {
        this.tweenHand.stop()
        this.manager.handFrame.setVisible(false)
    }

    public invalidMove(): void {
        this.manager.handFrame.setVisible(true)
        this.tweenHand.play()
        this.handleHighlight()
    }

    public nextLevel(): void {
        this.tweenHand.stop().remove()
    }
}

export default StepFour
