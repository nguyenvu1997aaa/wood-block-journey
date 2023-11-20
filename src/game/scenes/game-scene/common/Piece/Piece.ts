import { iCellHighlight, IXY } from '@/constants/ICommon'
import DEPTH_OBJECTS from '@/game/constants/depth'
import FPS from '@/game/constants/fps'
import SPRITES from '@/game/constants/resources/sprites'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import { isDesktop } from '@/utils/platform'
import { IPiece, IPieceCells } from '../../constant/types'
import Pieces from '../../footer/Pieces'
import GameScene from '../../GameScene'
import Cell from '../Cell'
import { onlyOneMove } from './utils/board'

const { KEY: KEY_32, FRAME: FRAME_32 } = SPRITES.GAMEPLAY_32
const { cols, rows } = GameCore.Configs.Board

export default class Piece extends Phaser.GameObjects.Container {
    public scene: GameScene

    public wrapPiece: Phaser.GameObjects.Image
    public type: string
    public frame: string
    public direction: string | null
    public data: any = []
    public isReverse = false

    private matrixData: Array<Array<number>> | undefined
    private cellItems: IPieceCells[] = []
    private cells: Cell[][] = []

    private isSetDrag = false
    private isCreateCell = false
    private isDragEnd = false
    private isCanMove: boolean

    private index: number
    private distancePY: number
    private backupPx: number | null
    private backupPy: number | null
    private moveTopNumber = 30
    private correctAlpha = 1

    private props: IPiece
    private parent: Pieces

    private animMoveTopAndScaleUp: Phaser.Tweens.Tween
    private animMoveDownAndScaleDown: Phaser.Tweens.Tween
    private animScaleUp: Phaser.Tweens.Tween
    private animScaleDown: Phaser.Tweens.Tween

    constructor(scene: GameScene, parent: Pieces, props: IPiece) {
        super(scene)

        this.props = props
        this.type = props.type
        this.matrixData = props.matrixData
        this.data = Piece.buildData(this.matrixData)
        this.direction = props.direction || null
        this.isReverse = props.isReverse || false
        this.parent = parent
        this.scene = scene

        if (this.scene.world.isLandscape()) {
            this.setSize(parent.width, parent.height / 3)
        } else {
            this.setSize(parent.width / 3, parent.height)
        }

        this.scene.add.existing(this)

        this.createWrapPiece()

        this.listenEvents()
    }

    private createWrapPiece() {
        this.wrapPiece = this.scene.make.image({
            key: KEY_32,
            frame: FRAME_32.GEM_TRANSPARENT,
        })

        this.wrapPiece.setWorldSize(this.width, this.height)
    }

    private listenEvents() {
        this.setInteractiveContainer()

        this.wrapPiece.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.parent.playTweenToEnableMaxFps()
        })

        this.wrapPiece.on(Phaser.Input.Events.DRAG_START, (pointer: Phaser.Input.Pointer) => {
            this.handleDragStart(pointer)
        })

        this.wrapPiece.on(Phaser.Input.Events.DRAG, (pointer: Phaser.Input.Pointer) => {
            this.handleDrag(pointer)
        })

        this.wrapPiece.on(Phaser.Input.Events.DRAG_END, () => {
            this.handleDragEnd()
            this.parent.stopTweenToEnableMaxFps()
        })
    }

    public updatePosition(x: number, y: number) {
        this.setPosition(x, y)

        this.backupPx = this.x
        this.backupPy = this.y
    }

    public updateWrapPiecePosition() {
        const { x, y } = this.getWorldPosition()
        this.wrapPiece.setPosition(x, y)
    }

    public setIndex(index: number) {
        this.index = index
    }

    public setInteractiveContainer() {
        this.wrapPiece
            .setInteractive()
            .input.hitArea.setTo(
                0,
                0,
                this.width / this.wrapPiece.scaleX,
                this.height / this.wrapPiece.scaleY
            )

        this.scene.input.setDraggable(this.wrapPiece)

        // this.scene.input.enableDebug(this.wrapPiece, 0x000000)
    }

    private handleDragStart(pointer: Phaser.Input.Pointer) {
        if (this.scene.isGameOver || !this.isCanMove) return

        this.animScaleUp?.stop()
        this.animScaleDown?.stop()
        this.setAlpha(this.correctAlpha).setScale(1).setPosition(this.x, this.y)

        this.isDragEnd = false
        this.isSetDrag = true

        this.setDepth(DEPTH_OBJECTS.PIECE + 1)
        this.parent.bringToTop(this)

        if (this.animMoveDownAndScaleDown && this.animMoveDownAndScaleDown.isPlaying()) {
            this.animMoveDownAndScaleDown.stop()

            this.setScale(1)
        }

        // Tutorial
        if (this.scene.tutorialManager.isRunning()) {
            this.scene.tutorialManager.dragStart()
        }

        this.scene.audio.playSound(SOUND_EFFECT.PIECE_PICK)

        const { main } = this.scene.layoutManager.objects

        const scale = main.board.cellSize / this.parent.cellSize
        const { height } = this.getContainerSize()

        const pX = pointer.worldX - this.getWorldPosition().x + this.x

        let pY = 0
        if (isDesktop() || this.scene.world.isLandscape()) {
            pY = pointer.worldY - this.getWorldPosition().y + this.y - (height * scale) / 2
        } else {
            const anchorBottom =
                this.scene.gameZone.height / 2 +
                main.board.width / 2 -
                this.parent.cellSize * 2 +
                this.moveTopNumber

            let distanceY = this.y + height * scale - anchorBottom + height

            const ratioCommon = 375 / 619
            const ratio = this.scene.gameZone.width / this.scene.gameZone.height

            if (ratio >= ratioCommon) {
                distanceY = 44 + (height * scale) / 2
            } else {
                distanceY = 53 + (height * scale) / 2
            }

            pY = pointer.worldY - this.getWorldPosition().y + this.y - distanceY
        }

        this.distancePY = pointer.worldY - pY

        const paddingCell = (main.board.cellPadding * 41) / 100

        this.updateCellsWithPadding(paddingCell)

        this.animMoveTopAndScaleUp = this.scene.tweens.add({
            x: pX,
            y: pY,
            scale,
            duration: 150,
            targets: this,
            ease: Phaser.Math.Easing.Sine.InOut,
            delay: 20,
            onComplete: () => {
                if (this.isDragEnd) return

                this.setPosition(pX, pY)
                const cellsHighlight = this.getCellsHighlight()
                main.board.handleRemoveHighlight()
                main.board.handleHighlight(cellsHighlight, this.highlightCellCanCapture.bind(this))
            },
        })

        this.drawSuggestCells()
    }

    private handleDrag(pointer: Phaser.Input.Pointer) {
        if (this.scene.isGameOver || !this.isCanMove) return
        if (!this.isSetDrag) return

        try {
            const { main } = this.scene.layoutManager.objects

            if (this.animMoveTopAndScaleUp && this.animMoveTopAndScaleUp.isPlaying()) {
                const scale = main.board.cellSize / this.parent.cellSize

                this.animMoveTopAndScaleUp.complete()

                this.animMoveTopAndScaleUp.stop()

                this.setScale(scale)
            }

            const { lockX, lockY } = this.checkOutOfThePage(pointer)
            if (lockX && lockY) return

            this.resetCellItems()

            this.scene.game.updateFps(FPS.max)

            const pX = pointer.worldX - this.getWorldPosition().x + this.x
            const pY = pointer.worldY - this.distancePY

            if (lockX) {
                this.setY(pY)
            } else if (lockY) {
                this.setX(pX)
            } else {
                this.setPosition(pX, pY)
            }

            this.canMove()

            const cellsHighlight = this.getCellsHighlight()

            main.board.handleRemoveHighlight()

            main.board.handleHighlight(cellsHighlight, this.highlightCellCanCapture.bind(this))
        } catch (ex) {
            this.handleDragPieceInvalidMove()
        }
    }

    private checkOutOfThePage(pointer: Phaser.Input.Pointer): { lockX: boolean; lockY: boolean } {
        const { width: widthPiece, height: heightPiece } = this.getContainerSize()
        const { width, height } = this.scene.gameZone
        const { worldX, worldY } = pointer

        const distanceY = this.distancePY - this.getWorldPosition().y + this.y

        let lockX = false
        let lockY = false

        if (worldX < widthPiece / 2 || worldX > width - widthPiece / 2) lockX = true
        if (worldY - distanceY < heightPiece / 2 || worldY - distanceY > height) lockY = true

        return { lockX, lockY }
    }

    private highlightCellCanCapture(
        rowsCapture: number[],
        colsCapture: number[],
        captureCells3x3: IXY[],
        cellsHighlight: iCellHighlight[]
    ): void {
        let minCol = cols
        let minRow = rows
        const xyCellHighlight: IXY[] = []

        for (let i = 0; i < cellsHighlight.length; i++) {
            const { x, y } = cellsHighlight[i]

            if (minCol > x) minCol = x
            if (minRow > y) minRow = y
        }

        for (let i = 0; i < rowsCapture.length; i++) {
            const number = rowsCapture[i]

            const cellHLFilter = cellsHighlight.filter((item) => {
                return item.y === number
            })

            if (!cellHLFilter || cellHLFilter.length === 0) continue

            for (let j = 0; j < cellHLFilter.length; j++) {
                const item = cellHLFilter[j]

                if (!this.checkItemInArray(xyCellHighlight, item)) {
                    xyCellHighlight.push(item)
                }
            }
        }

        for (let i = 0; i < colsCapture.length; i++) {
            const number = colsCapture[i]

            const cellHLFilter = cellsHighlight.filter((item) => {
                return item.x === number
            })

            if (!cellHLFilter || cellHLFilter.length === 0) continue

            for (let j = 0; j < cellHLFilter.length; j++) {
                const item = cellHLFilter[j]

                if (!this.checkItemInArray(xyCellHighlight, item)) {
                    xyCellHighlight.push(item)
                }
            }
        }

        for (let i = 0; i < captureCells3x3.length; i++) {
            const captureCells3x3Row = captureCells3x3[i]

            const cellHLFilter = cellsHighlight.filter((item) => {
                return item.x === captureCells3x3Row.x && item.y === captureCells3x3Row.y
            })

            if (!cellHLFilter || cellHLFilter.length === 0) continue

            const item = cellHLFilter[0]

            if (!this.checkItemInArray(xyCellHighlight, item)) {
                xyCellHighlight.push(item)
            }
        }

        for (let i = 0; i < xyCellHighlight.length; i++) {
            const { x, y } = xyCellHighlight[i]
            const filterPieceCell = this.cellItems.filter((item) => {
                return item.x === x - minCol && item.y === y - minRow
            })

            if (!filterPieceCell || filterPieceCell.length === 0) continue

            filterPieceCell[0].cell.setFrameImageCell(FRAME_32.GEM_LIGHT)
        }
    }

    private resetCellItems(): void {
        for (let i = 0; i < this.cellItems.length; i++) {
            this.cellItems[i].cell.setFrameImageCell(FRAME_32.GEM)
        }
    }

    private checkItemInArray(data: IXY[], item: IXY): boolean {
        const filter = data.filter((i) => {
            return i.x === item.x && i.y === item.y
        })

        if (!filter || filter.length === 0) return false

        return true
    }

    handleDragPieceInvalidMove() {
        const { main } = this.scene.layoutManager.objects

        main.board.handleRemoveHighlight()
        main.board.removeAllCanCaptureCells()
    }

    handleDragEnd() {
        if (this.isDragEnd || !this.isSetDrag || !this.isCanMove) return
        this.isDragEnd = true
        this.isSetDrag = false

        const { main } = this.scene.layoutManager.objects

        this.setDepth(DEPTH_OBJECTS.PIECE)
        main.board.handleRemoveSuggestMove()
        main.board.removeAllCanCaptureCells()

        this.resetCellItems()

        try {
            this.canMove()

            this.scene.audio.playSound(SOUND_EFFECT.PIECE_DROP)

            this.handleBoardMoveCompleted()

            this.wrapPiece.disableInteractive()
        } catch (ex) {
            this.handleInvalidMove()
        }
    }

    cancelDrag() {
        if (this.isDragEnd || !this.isSetDrag) return
        this.isDragEnd = true
        this.isSetDrag = false

        const { main } = this.scene.layoutManager.objects

        this.setDepth(DEPTH_OBJECTS.PIECE)
        main.board.handleRemoveSuggestMove()
        main.board.removeAllCanCaptureCells()

        this.resetCellItems()

        main.board.handleRemoveHighlight()

        this.handleInvalidMove()
    }

    /**
     * Handle event run animation piece in board completed.
     * @param positionCenterPiece
     */
    public handleBoardMoveCompleted() {
        const { main } = this.scene.layoutManager.objects

        const cellTopLeft = this.getPositionTopLeftInBoard()

        if (!cellTopLeft) {
            main.board.handleRemoveHighlight()

            return
        }

        const pieceScore = this.calcScore() || 0

        if (!this.scene.tutorialManager.isRunning()) {
            this.scene.handleUpdateScore(pieceScore)
            this.scene.handleAddScoreAnim(pieceScore)
        }

        const { x: col, y: row } = cellTopLeft
        const item = main.board.dataBoard[row][col]

        const { x: cellX, y: cellY } = item.cell.getWorldPosition()
        const { x, y } = this.getWorldPosition()

        const endX = this.x + cellX - x
        const endY = this.y + cellY - y

        const { width, height } = this.getContainerSizeOrigin()

        const newX = endX + width / 2
        const newY = endY + height / 2
        const cellsHighlight = this.getCellsHighlight()

        this.scene.add.tween({
            targets: this,
            x: newX,
            y: newY,
            duration: 50,
            onComplete: () => {
                this.updateCellsWithPadding(0.5)
                main.board.handleRemoveHighlight()
                this.hide()
                this.setScale(1)
                this.parent.removeActivePiece(this.index)
                main.board.handleMove(cellsHighlight, this.onBoardHandleMoveCompleted.bind(this))
            },
        })
    }

    public getContainerSizeOrigin(): { width: number; height: number } {
        const maxCols = this.data[0].length - 1
        const maxRows = this.data.length - 1

        const cellSize = this.parent.cellSize
        const width = maxCols * cellSize * this.scale
        const height = maxRows * cellSize * this.scale

        return { width, height }
    }

    private calcScore(): number {
        if (!this.matrixData) return 0

        const n = this.matrixData.length || 0

        if (n === 0) return 0

        const m = this.matrixData[0]?.length || 0

        let score = 0

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                if (this.matrixData[i][j] === 1) score++
            }
        }

        return score
    }

    public hide() {
        this.setVisible(false)
        this.wrapPiece.setVisible(false)
    }

    private show() {
        this.setVisible(true)
        this.wrapPiece.setVisible(true)
    }

    private playAnimShow() {
        this.setAlpha(0).setScale(0)

        this.show()

        // this.animShow.play()

        this.animScaleUp.play()
    }

    private onBoardHandleMoveCompleted() {
        if (this.scene.tutorialManager.isRunning()) {
            return
        }

        this.parent.setActivePieces()

        if (!this.parent.existPiecesActive()) {
            this.parent.showNewPieces()
        }
    }

    private drawSuggestCells() {
        const { main } = this.scene.layoutManager.objects

        // 1. get board data
        const board = main.board.dataBoard

        // 2. emit event draw cells when piece only one move.
        const cells = onlyOneMove(board, { data: this.data })
        if (cells) {
            main.board.handleSuggestMove(cells)
        }
    }

    private handleInvalidMove() {
        const { main } = this.scene.layoutManager.objects

        this.scene.audio.playSound(SOUND_EFFECT.PIECE_INVALID_MOVE)

        main.board.handleRemoveHighlight()

        // Tutorial
        if (this.scene.tutorialManager.isRunning()) {
            this.scene.tutorialManager.invalidMove()
        }

        this.animMoveDownAndScaleDown = this.scene.tweens.add({
            x: this.backupPx,
            y: this.backupPy,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            targets: this,
            ease: Phaser.Math.Easing.Sine.InOut,
            delay: 20,
            onComplete: () => {
                this.updateCellsWithPadding(0.5)
            },
        })
    }

    /**
     * Check piece has move in board.
     * @returns {boolean}
     */
    private canMove(): boolean {
        const { main } = this.scene.layoutManager.objects

        const board = main.board.dataBoard

        const cellsHighlight = this.getCellsHighlight()

        if (cellsHighlight.length === 0) throw new Error('Invalid Move')

        let validMove = true

        for (let i = 0; i < cellsHighlight.length; i++) {
            const { x, y } = cellsHighlight[i]
            if (!board[y] || !board[y][x] || board[y][x].value !== 0) {
                validMove = false
                break
            }
        }

        if (!validMove || cellsHighlight.length === 0) throw new Error('Invalid Move')

        return validMove
    }

    /**
     * Get list cell highlight in board
     */
    private getCellsHighlight() {
        const { main } = this.scene.layoutManager.objects

        const board = main.board.dataBoard
        const cells: any[] = []
        const cellTopLeft = this.getPositionTopLeftInBoard()

        if (cellTopLeft === null) {
            return cells
        }

        // Check tutorial
        if (this.scene.tutorialManager.isRunning()) {
            const validTargetPosition = this.scene.tutorialManager.validTargetPosition(cellTopLeft)

            if (!validTargetPosition) return cells
        }

        for (let y = 0; y < this.data.length; y++) {
            for (let x = 0; x < this.data[y].length; x++) {
                if (this.data[y][x].texture) {
                    const cx = x + cellTopLeft.x
                    const cy = y + cellTopLeft.y
                    const pX = board[cy] && board[cy][cx] ? board[cy][cx].x : 0
                    const pY = board[cy] && board[cy][cx] ? board[cy][cx].y : 0

                    if (cy >= rows || cx >= cols || !board[cy][cx] || board[cy][cx].value === 1)
                        return []

                    cells.push({
                        x: cx,
                        y: cy,
                        pX,
                        pY,
                    })
                }
            }
        }

        return cells
    }

    /**
     * Get position (col, row) top-left of piece in board
     */
    public getPositionTopLeftInBoard() {
        const { main } = this.scene.layoutManager.objects

        const { width: widthPiece, height: heightPiece } = this.getContainerSize()
        const { x, y } = this.getWorldPosition()
        const board = main.board.dataBoard
        const topX = x + this.parent.cellSize * this.scale - widthPiece / 2
        const topY = y + this.parent.cellSize * this.scale - heightPiece / 2
        const { cellPadding } = main.board
        let col = -1
        let row = -1

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const { x: cellX, y: cellY } = board[y][x].cell.getWorldPosition()

                if (
                    cellX - cellPadding / 2 <= topX &&
                    cellX + board[y][x].width + cellPadding / 2 >= topX &&
                    cellY - cellPadding / 2 <= topY &&
                    cellY + board[y][x].height + cellPadding / 2 >= topY
                ) {
                    col = x
                    row = y
                    break
                }
            }
        }

        // 3. check position in board
        if (col < 0 || col > cols - 1 || row < 0 || row > rows - 1) {
            return null
        }

        return { x: col, y: row }
    }

    /**
     * Build data by matrix number
     */
    static buildData(matrixData: any) {
        const data: any = []
        for (let y = 0; y < matrixData.length; y++) {
            data[y] = []
            for (let x = 0; x < matrixData[y].length; x++) {
                const texture: any = matrixData[y][x] === 1 ? FRAME_32.GEM : null
                data[y][x] = { x, y, texture }
            }
        }

        return data
    }

    public drawPiece() {
        // 1. calculator padding in cell
        const paddingCell = 0.5

        // 2. create cell
        if (!this.isCreateCell) {
            // 2.1 create cells
            this.createCells(paddingCell)
        } else {
            // 3. cell is created
            // 3.1 reset props cells
        }

        this.createAnimShow()

        this.playAnimShow()

        this.wrapPiece.setInteractive()

        return this
    }

    private createAnimShow() {
        const delay = this.index * 140

        this.animScaleUp = this.scene.tweens.add({
            delay,
            paused: true,
            duration: 163,
            targets: this,
            alpha: {
                from: 0,
                to: this.alpha,
            },
            scale: {
                from: 0,
                to: 1.2,
            },
            ease: Phaser.Math.Easing.Sine.Out,
            onComplete: () => {
                this.animScaleDown.play()
            },
        })

        this.animScaleDown = this.scene.tweens.add({
            delay: 83,
            paused: true,
            duration: 150,
            targets: this,
            scale: 1,
            ease: Phaser.Math.Easing.Sine.Out,
        })
    }

    /**
     * Create cells by piece
     * @param paddingCell
     */
    private createCells(paddingCell: number): void {
        const cellLength = this.parent.cellSize

        const maxRows = this.data.length
        const maxCols = this.data[0].length

        // 2. create cell
        for (let y = 0; y < this.data.length; y++) {
            this.cells[y] = []

            for (let x = 0; x < this.data[y].length; x++) {
                if (!this.data[y][x].texture) continue
                const pX = (x - (maxCols - 1) / 2) * (cellLength + paddingCell)
                const pY = (y - (maxRows - 1) / 2) * (cellLength + paddingCell)

                const props = {
                    x: pX,
                    y: pY,
                    width: cellLength - paddingCell * 2,
                    height: cellLength - paddingCell * 2,
                }
                const cell = new Cell(this.scene, props)

                cell.setFrameImageCell(FRAME_32.GEM)

                // 2.2 set depth
                this.cells[y][x] = cell

                this.cellItems.push({
                    x,
                    y,
                    cell,
                })

                this.add(cell)
            }
        }

        this.isCreateCell = true
    }

    public updateCellsWithPadding(paddingCell: number): void {
        const cellLength = this.parent.cellSize

        const maxRows = this.data.length
        const maxCols = this.data[0].length

        for (let y = 0; y < this.data.length; y++) {
            for (let x = 0; x < this.data[y].length; x++) {
                if (!this.data[y][x].texture) continue

                const cell = this.cells[y][x]
                const pX = (x - (maxCols - 1) / 2) * (cellLength + paddingCell)
                const pY = (y - (maxRows - 1) / 2) * (cellLength + paddingCell)

                cell.setPosition(pX, pY)
            }
        }
    }

    private getContainerSize() {
        let maxCols = 0
        const maxRows = this.data.length

        // 2. create cell
        for (let y = 0; y < this.data.length; y++) {
            if (this.data[y].length > maxCols) {
                maxCols = this.data[y].length
            }
        }

        const cellSize = this.parent.cellSize
        const width = maxCols * cellSize * this.scale
        const height = maxRows * cellSize * this.scale

        return {
            width,
            height,
        }
    }

    public setCanMove(isCanMove: boolean) {
        this.isCanMove = isCanMove
        this.correctAlpha = isCanMove ? 1 : 0.4
        this.setAlpha(this.correctAlpha)
    }

    public reset() {
        this.setVisible(false)
        this.setScale(1)
        this.wrapPiece.disableInteractive()
    }
}
