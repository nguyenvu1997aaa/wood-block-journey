import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'
import MANAGER from '@/game/gameplay/constants/manager'
import BaseManager from '@/game/managers/BaseManager'
import JourneyScene from '..'
import WORLD_EVENTS from '@/plugins/world/constants/events'

const { STATUS } = MANAGER
const { KEY, FRAME } = SPRITES.GAMEPLAY

class TutorialManager extends BaseManager {
    public scene: JourneyScene

    public step: number
    private listPositionStart: IPosition[]
    private listPositionTo: IPosition[]
    private positionStart: IPosition
    private positionTo: IPosition

    private handFrame: Phaser.GameObjects.Image
    private tweenHand: Phaser.Tweens.Tween

    constructor(scene: JourneyScene) {
        super(scene)

        this.scene = scene

        this.step = 0

        this.createHand()

        this.registerEvents()
    }

    private registerEvents(): void {
        this.scene.world.events.on(WORLD_EVENTS.RESIZE, this.handleResize, this)
    }

    private handleResize(): void {
        console.log('handleResize initPosition')
        this.initPosition()

        this.positionStart = this.listPositionStart[this.step]
        this.positionTo = this.listPositionTo[this.step]

        this.createTweenHand()
    }

    public start(): void {
        this.initPosition()

        if (this.isRunning()) return

        this.setState(STATUS.RUNNING)

        this.handleStep()
    }

    private initPosition(): void {
        const { dataBoard, cellSize } = this.scene.layoutManager.objects.main.board
        const { allPieces, piecesActive } = this.scene.layoutManager.objects.footer.pieces

        const startX = allPieces[piecesActive[0].position].piece.getWorldPosition().x + cellSize / 2
        const startY = allPieces[piecesActive[0].position].piece.getWorldPosition().y + cellSize / 2
        const endX = dataBoard[3][3].cell.getWorldPosition().x + cellSize / 2
        const endY = dataBoard[3][3].cell.getWorldPosition().y + cellSize / 2

        const startX2 = allPieces[piecesActive[1].position].piece.getWorldPosition().x + cellSize
        const startY2 = allPieces[piecesActive[1].position].piece.getWorldPosition().y + cellSize
        const endX2 = dataBoard[5][5].cell.getWorldPosition().x + cellSize / 2
        const endY2 = dataBoard[5][5].cell.getWorldPosition().y + cellSize / 2

        this.listPositionStart = [
            { x: startX, y: startY },
            { x: startX2, y: startY2 },
        ]

        this.listPositionTo = [
            { x: endX, y: endY },
            { x: endX2, y: endY2 },
        ]

        console.log('initPosition', this.listPositionStart, this.listPositionTo)
    }

    private createHand(): void {
        this.handFrame = this.scene.make.image({
            key: KEY,
            frame: FRAME.HAND,
            origin: { x: 0.5, y: 0.5 },
        })

        this.handFrame.setVisible(false).setDepth(DEPTH_OBJECTS.ON_TOP)
        this.handFrame.setWorldSize(64, 55)
    }

    private createTweenHand(): void {
        this.tweenHand?.remove()

        this.tweenHand = this.scene.add.tween({
            paused: true,
            repeatDelay: 500,
            targets: this.handFrame,
            repeat: -1,
            x: {
                from: this.positionStart.x,
                to: this.positionTo.x,
            },
            y: {
                from: this.positionStart.y,
                to: this.positionTo.y,
            },
            duration: 1500,
            ease: Phaser.Math.Easing.Sine.InOut,
        })

        this.tweenHand.play()
    }

    public handleStep(): void {
        this.positionStart = this.listPositionStart[this.step]
        this.positionTo = this.listPositionTo[this.step]

        console.log('This.stepppp ', this.step)

        this.handFrame.setVisible(true)
        this.handFrame.setPosition(this.positionStart.x, this.positionStart.y)

        this.createTweenHand()

        switch (this.step) {
            case 0:
                this.handleStep1()
                break

            case 1:
                this.handleStep2()
                break
        }
    }

    private handleStep1(): void {
        const { main } = this.scene.layoutManager.objects
        main.board.dataBoard[3][3].cell.setFrameImageCell(SPRITES.GAMEPLAY_32.FRAME.GEM_HIGHT_LIGHT)
        main.board.dataBoard[3][4].cell.setFrameImageCell(SPRITES.GAMEPLAY_32.FRAME.GEM_HIGHT_LIGHT)
        main.board.dataBoard[4][3].cell.setFrameImageCell(SPRITES.GAMEPLAY_32.FRAME.GEM_HIGHT_LIGHT)
    }

    private handleStep2(): void {
        const { main } = this.scene.layoutManager.objects
        main.board.dataBoard[5][3].cell.setFrameImageCell(SPRITES.GAMEPLAY_32.FRAME.GEM_HIGHT_LIGHT)
        main.board.dataBoard[5][4].cell.setFrameImageCell(SPRITES.GAMEPLAY_32.FRAME.GEM_HIGHT_LIGHT)
        main.board.dataBoard[5][5].cell.setFrameImageCell(SPRITES.GAMEPLAY_32.FRAME.GEM_HIGHT_LIGHT)
        main.board.dataBoard[3][5].cell.setFrameImageCell(SPRITES.GAMEPLAY_32.FRAME.GEM_HIGHT_LIGHT)
        main.board.dataBoard[4][5].cell.setFrameImageCell(SPRITES.GAMEPLAY_32.FRAME.GEM_HIGHT_LIGHT)
    }

    public handleCompleteTutorial(): void {
        this.setState(STATUS.STOPPED)
        this.stopAnimHand()
    }

    public nextStep(): void {
        this.handFrame.setVisible(false)

        this.step++

        if (this.step >= 2) {
            this.handleCompleteTutorial()
            return
        }

        this.handleStep()
    }

    public stopAnimHand(): void {
        this.handFrame.setVisible(false)
        this.tweenHand?.stop()
    }

    public runAnimHand(): void {
        this.handFrame.setVisible(true)
        this.tweenHand.play()
    }

    public validTargetPosition = (position: { x: number; y: number }): boolean => {
        let targetPosition = { x: 0, y: 0 }

        switch (this.step) {
            case 0:
                targetPosition = { x: 3, y: 3 }
                break

            case 1:
                targetPosition = { x: 3, y: 3 }
                break
        }

        if (targetPosition.x === position.x && targetPosition.y === position.y) return true

        return false
    }

    public validStep(index: number): boolean {
        if (this.step === index) return true

        return false
    }

    public reset(): void {
        this.setState(STATUS.STOPPED)
        this.stopAnimHand()
        this.step = 0
    }
}

export default TutorialManager
