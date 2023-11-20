import Board from './Board'
import GameScene from '../JourneyScene'
import Praise from './Praise'

class Main extends Phaser.GameObjects.Container {
    public scene: GameScene
    public board: Board
    public praise: Praise

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        scene.add.existing(this)

        this.init()
    }

    init(): void {
        this.createBoard()

        this.createPraise()
    }

    createBoard(): void {
        this.board = new Board(this.scene, 354, 352)
        this.add(this.board)
    }

    createPraise(): void {
        this.praise = new Praise(this.scene)
    }

    public updateUILandscape(): void {
        // this.board.setSize(425, 424)
        // this.board.offsetY = 17
        // this.board.handleResize()
    }
}

export default Main
