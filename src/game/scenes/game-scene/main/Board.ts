import { IBoardData, ICell } from '@/constants/ICommon'
import {
    FRAME_BLOCK_GRADIENT_COMBO,
    FRAME_BLOCK_GRADIENT_NORMAL,
} from '@/game/constants/blockGradient'
import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import WORLD_EVENTS from '@/plugins/world/constants/events'
import { sendException } from '@/utils/Sentry'
import vibrate from '@/utils/vibrate'
import Cell from '../common/Cell'
import {
    calculateScore,
    calculateScoreCombo,
    decodeRowByString,
    getAmountCombo,
    getAmountStreak,
    getCaptureCells,
    getCaptureCells3x3,
    getColsCaptureCells,
    getFenCharacterByCode,
    getRowsCaptureCells,
    isGameOver,
    resetAmountStreak,
} from '../common/Piece/utils/board'
import WoodenEffect from '../common/WoodenEffect'
import {
    CROSS_PIECE_5,
    LINE_5_TYPE,
    RESCUE_LIST,
    RESCUE_LIST_CROSS_5,
    RESCUE_LIST_L5,
} from '../constant/piece'
import { ICanCaptureLines, IPiece } from '../constant/types'
import GameScene from '../GameScene'

const { KEY, FRAME } = SPRITES.GAMEPLAY
const { KEY: KEY_32, FRAME: FRAME_32 } = SPRITES.GAMEPLAY_32
const { FRAME: D_FRAME } = SPRITES.DEFAULT
const { cols, rows } = GameCore.Configs.Board
const { VibrateValue } = GameCore.Configs.Gameplay

export default class Board extends Phaser.GameObjects.Container {
    scene: GameScene
    private suggestCells: IPosition[] = []

    public pX: number
    public pY: number
    public borderLeftSize = 4
    public borderTopSize = 4
    public cellSize: number
    public cellPadding: number
    public diceSize: number
    public dataBoard: IBoardData[][] = []
    public cellsHighlight: ICell[] = []
    public cellSharking: Cell[] = []

    public boardFrame: Phaser.GameObjects.Image

    public woodenEffect: WoodenEffect
    public offsetY = -27

    constructor(scene: GameScene, width: number, height: number) {
        super(scene)

        this.scene = scene

        this.setSize(width, height)

        this.woodenEffect = new WoodenEffect(this.scene)

        this.init()

        // this.registerEvents()
    }

    init() {
        this.createBoard()
        this.calcCellLength()
        this.initDataBoard()
    }

    private registerEvents(): void {
        this.scene.world.events.on(WORLD_EVENTS.RESIZE, this.handleResize, this)
    }

    public handleResize(): void {
        // this.boardFrame.setWorldSize(this.width, this.height)
        // this.calcCellLength()
        // this.initDataBoard()
    }

    private createBoard(): void {
        this.boardFrame = this.scene.make.image({
            key: KEY,
            frame: FRAME.BOARD,
        })

        this.boardFrame.setWorldSize(this.width, this.height)

        this.add(this.boardFrame)
    }

    private calcCellLength(): void {
        this.cellPadding = 1
        this.cellSize =
            (this.width - this.borderLeftSize * 2 - this.cellPadding * (cols + 1)) / cols
    }

    private initDataBoard(): void {
        const startX =
            this.boardFrame.x -
            this.boardFrame.displayWidth / 2 +
            this.cellSize / 2 +
            this.borderLeftSize
        const startY =
            this.boardFrame.y -
            this.boardFrame.displayHeight / 2 +
            this.cellSize / 2 +
            this.borderTopSize

        // 2. create cell
        for (let y = 0; y < rows; y++) {
            this.dataBoard[y] = []
            for (let x = 0; x < cols; x++) {
                // 2.1 create sprite cell
                const pX = startX + x * this.cellSize + this.cellPadding * x
                const pY = startY + y * this.cellSize + this.cellPadding * y

                const cellProps = {
                    x: pX,
                    y: pY,
                    width: this.cellSize,
                    height: this.cellSize,
                    texture: KEY_32,
                    frame: FRAME_32.GEM_TRANSPARENT,
                    depth: DEPTH_OBJECTS.PIECE - 0.1,
                    padding: this.cellPadding,
                    isWoodenEffect: true,
                }

                const cell = new Cell(this.scene, cellProps)

                this.add(cell)

                // 2.2 create data
                this.dataBoard[y][x] = {
                    x: pX,
                    y: pY,
                    width: this.cellSize,
                    height: this.cellSize,
                    frame: FRAME_32.GEM_TRANSPARENT,
                    value: 0,
                    cell,
                }
            }
        }
    }

    public handleTweenStartMission() {
        const speed = 100
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const { cell } = this.dataBoard[y][x]

                let delay = 0

                if (y == 4 && x == 4) {
                    delay = speed
                } else if (y >= 3 && y <= 5 && x >= 3 && x <= 5) {
                    delay = speed * 2
                } else if (y >= 2 && y <= 6 && x >= 2 && x <= 6) {
                    delay = speed * 3
                } else if (y >= 1 && y <= 7 && x >= 1 && x <= 7) {
                    delay = speed * 4
                } else {
                    delay = speed * 5
                }

                this.scene.time.delayedCall(delay, () => {
                    cell.playTweenStartMission()
                })
            }
        }
    }

    public handleHighlight(cellsHighlight: ICell[], highlightCellCanCapture: Function): void {
        this.cellsHighlight = cellsHighlight

        for (let i = 0; i < cellsHighlight.length; i++) {
            const { x, y } = cellsHighlight[i]
            if (this.dataBoard[y] && this.dataBoard[y][x] && this.dataBoard[y][x].value === 0) {
                const { cell } = this.dataBoard[y][x]
                this.dataBoard[y][x].frame = FRAME_32.GEM
                cell.setFrameImageCell(FRAME_32.GEM)
                cell.setAlphaImageCell(0.3)
            }
        }

        this.canCaptureCells(cellsHighlight, highlightCellCanCapture)
    }

    /**
     * Handle capture lines after piece is moved in board.
     * @param pieces
     * @param positionCenterPiece
     * @param frame
     */
    public handleCapturePiece(captureCells: any): void {
        try {
            if (!captureCells || captureCells.length <= 0) {
                resetAmountStreak()
                throw new Error('Invalid Capture')
            }

            const duration = 300
            let speed = 0
            const rowsCapture = getRowsCaptureCells(this.dataBoard)
            const colsCapture = getColsCaptureCells(this.dataBoard)
            const combo = getAmountCombo()

            for (let i = 0; i < captureCells.length; i++) {
                const { x, y } = captureCells[i]
                const { cell } = this.dataBoard[y][x]
                let delay = 0
                let indexColor = 0
                let indexCell = 0

                if (rowsCapture.length > 0 && colsCapture.length > 0) {
                    let delayX = 0
                    let delayY = 0

                    speed = duration / cols

                    if (rowsCapture.indexOf(y) !== -1 && colsCapture.indexOf(x) === -1) {
                        delayX = speed * x
                        delayY = 0
                        indexColor = rowsCapture.indexOf(y)
                    }

                    if (rowsCapture.indexOf(y) === -1 && colsCapture.indexOf(x) !== -1) {
                        delayX = 0
                        delayY = speed * y
                        indexColor = colsCapture.indexOf(x)
                    }

                    if (rowsCapture.indexOf(y) !== -1 && colsCapture.indexOf(x) !== -1) {
                        delayX = speed * x
                        delayY = speed * y
                        indexColor = Math.max(colsCapture.indexOf(x), rowsCapture.indexOf(y), 0)
                    }

                    if (rowsCapture.indexOf(y) === -1 && colsCapture.indexOf(x) === -1) {
                        delayX = speed * x
                        delayY = speed * y
                    }

                    delay = Math.max(delayX, delayY, 0)
                } else if (colsCapture.length > 0) {
                    speed = duration / cols

                    delay = speed * y
                    indexColor = colsCapture.indexOf(x)
                    indexCell = y
                } else if (rowsCapture.length > 0) {
                    speed = duration / rows

                    delay = speed * x
                    indexColor = rowsCapture.indexOf(y)
                    indexCell = x
                } else {
                    speed = duration / 3
                    // 3x3
                    const minX = captureCells[0].x
                    delay = speed * (x - minX)
                    indexColor = 0
                }

                cell.hideImageHighlight()

                this.scene.time.delayedCall(delay, () => {
                    const isCombo =
                        combo > 2 && (colsCapture.length >= 3 || rowsCapture.length >= 3)
                    let frameBlockGradient = ''

                    if (isCombo) {
                        frameBlockGradient =
                            FRAME_BLOCK_GRADIENT_COMBO[indexCell] || FRAME_BLOCK_GRADIENT_COMBO[0]

                        cell.imageBreak.setFrame(frameBlockGradient)
                    } else {
                        frameBlockGradient =
                            FRAME_BLOCK_GRADIENT_NORMAL[indexColor] ||
                            FRAME_BLOCK_GRADIENT_NORMAL[0]

                        cell.imageBreak.setFrame(frameBlockGradient)
                    }

                    cell.playTweenScaleDown()

                    const { value } = this.dataBoard[y][x]

                    if (value == 0) {
                        cell.setFrameImageCell(FRAME_32.GEM_TRANSPARENT)
                    }
                })

                this.dataBoard[y][x].frame = FRAME_32.GEM_TRANSPARENT
                this.dataBoard[y][x].value = 0
            }
        } catch (ex) {
            //
        }
    }

    private checkPositionCellOnCaptureCell(cellHighlight: ICell, captureCells: any[]) {
        const filter = captureCells.filter((item) => {
            return item.x === cellHighlight.x && item.y === cellHighlight.y
        })

        return filter && filter.length > 0
    }

    private handlePraise(cellsHighlight: any[], captureCells: any) {
        if (!captureCells || captureCells.length === 0) return

        let score = calculateScore()
        const combo = getAmountCombo()

        if (combo > 1) {
            score = calculateScoreCombo()
        }

        const cellCapturePieceOnCellHighlight = []

        for (let i = 0; i < cellsHighlight.length; i++) {
            const itemCellHighlight = cellsHighlight[i]

            if (this.checkPositionCellOnCaptureCell(itemCellHighlight, captureCells)) {
                cellCapturePieceOnCellHighlight.push(
                    this.dataBoard[itemCellHighlight.y][itemCellHighlight.x]
                )
            }
        }

        if (cellCapturePieceOnCellHighlight.length === 0) return

        const worldPosCellCapture = cellCapturePieceOnCellHighlight[0].cell.getWorldPosition()
        let minPx = worldPosCellCapture.x
        let maxPx = 0
        let minPy = worldPosCellCapture.y
        let maxPy = 0

        for (let i = 0; i < cellCapturePieceOnCellHighlight.length; i++) {
            const cell = cellCapturePieceOnCellHighlight[i]
            const worldPos = cell.cell.getWorldPosition()

            if (worldPos.x < minPx) {
                minPx = worldPos.x
            }

            if (worldPos.x > maxPx) {
                maxPx = worldPos.x
            }

            if (worldPos.y < minPy) {
                minPy = worldPos.y
            }

            if (worldPos.y > maxPy) {
                maxPy = worldPos.y
            }
        }

        const x = minPx + (maxPx - minPx) / 2
        const y = minPy + (maxPy - minPy) / 2

        const { main } = this.scene.layoutManager.objects

        main.praise.handlePraise(x, y, score, combo)

        this.handleStreakBreak(x, y)

        this.playEatSound(combo)
    }

    private handleStreakBreak(x: number, y: number): void {
        if (this.scene.tutorialManager.isRunning()) return

        const amountCombo = getAmountCombo()
        const amountStreak = getAmountStreak() - 1
        const streakWidth = 75

        const { width } = this.scene.gameZone

        if (x - streakWidth < 0) x = streakWidth
        if (x + streakWidth > width) x = width - streakWidth

        if (amountStreak < 2 || amountCombo >= 2) {
            return
        }

        const level = amountStreak > 6 ? 6 : amountStreak
        const vibratePatterns = this.getVibrateByLevel(level)

        if (this.scene.player.getPlayerSettings().vibrate) {
            vibrate(vibratePatterns)
        }

        this.playEatSound(level)

        this.scene.effectManager.streakBreak.setTextStreak(amountStreak)
        this.scene.effectManager.streakBreak.setBgFrame(D_FRAME.BG_STREAK)
        this.scene.effectManager.streakBreak.playAnim(x, y - 20)
    }

    private getVibrateByLevel(level: number) {
        return VibrateValue[level] || 0
    }

    private playEatSound(level: number): void {
        this.scene.audio.playSound(SOUND_EFFECT.EAT_BLOCK, {
            volume: 1,
        })

        switch (level) {
            case 1:
                break
            case 2:
                this.scene.audio.playSound(SOUND_EFFECT.GOOD)
                break
            case 3:
                this.scene.audio.playSound(SOUND_EFFECT.COOL)
                break
            case 4:
                this.scene.audio.playSound(SOUND_EFFECT.EXCELLENT)
                break
            case 5:
                this.scene.audio.playSound(SOUND_EFFECT.EXCELLENT)
                break
            case 6:
                this.scene.audio.playSound(SOUND_EFFECT.EXCELLENT)
                break

            default:
                break
        }
    }

    /**
     * Handle remove highlight. Function onComplete is called when animation finish.
     * @param isClearCanCapture
     * @param onComplete
     */
    public handleRemoveHighlight() {
        try {
            if (!this.cellsHighlight) return

            // 1. remove highlight
            for (let i = 0; i < this.cellsHighlight.length; i++) {
                const { x, y } = this.cellsHighlight[i]
                if (this.dataBoard[y] && this.dataBoard[y][x] && this.dataBoard[y][x].value === 0) {
                    const { cell } = this.dataBoard[y][x]

                    this.dataBoard[y][x].frame = FRAME_32.GEM_TRANSPARENT
                    cell.setFrameImageCell(FRAME_32.GEM_TRANSPARENT)
                    cell.setAlphaImageCell(1)
                }
            }

            this.cellsHighlight = []
        } catch (ex) {
            console.log(ex)
        }
    }

    /**
     * Handle cells can capture.
     * @param cellsHighlight
     * @param frameHighlight
     */
    private canCaptureCells(cellsHighlight: any[], highlightCellCanCapture: Function) {
        // 1. get board
        const board = this.dataBoard
        const newBoard: any[] = []
        for (let y = 0; y < board.length; y++) {
            newBoard[y] = []
            for (let x = 0; x < board[y].length; x++) {
                newBoard[y][x] = { ...board[y][x] }
            }
        }

        // 1.2 set value cell
        for (let i = 0; i < cellsHighlight.length; i++) {
            const { x, y } = cellsHighlight[i]
            newBoard[y][x].value = 1
        }

        this.removeAnimCanCaptureCells(newBoard, cellsHighlight)

        // 2. get capture cells
        const captureCells = getCaptureCells(newBoard, cellsHighlight)

        if (!captureCells || captureCells.length <= 0) {
            return false
        }

        // 3. add animation for can capture cells
        for (let i = 0; i < captureCells.length; i++) {
            const { x, y } = captureCells[i]
            if (!cellsHighlight.some((item) => item.x === x && item.y === y)) {
                this.cellSharking.push({ ...captureCells[i] })
            }
        }

        for (let i = 0; i < this.cellSharking.length; i++) {
            const { x, y } = this.cellSharking[i]
            const { cell } = this.dataBoard[y][x]

            // if (cell.isShaking()) continue

            // cell.setRateShaking(i % 2 === 0 ? 1 : -1)
            // cell.playAnimShaking()

            if (cell.isHighlight()) continue

            cell.showImageHighlight()
        }

        const rowsCapture = getRowsCaptureCells(newBoard)
        const colsCapture = getColsCaptureCells(newBoard)
        const captureCells3x3 = getCaptureCells3x3(newBoard, cellsHighlight)

        highlightCellCanCapture(rowsCapture, colsCapture, captureCells3x3, cellsHighlight)
    }

    public removeAnimCanCaptureCells(newBoard: any[], cellHighlight: any[]) {
        if (this.cellSharking.length === 0) return

        const rowsCaptureCells = getRowsCaptureCells(newBoard)
        const colsCaptureCells = getColsCaptureCells(newBoard)
        const captureCells3x3 = getCaptureCells3x3(newBoard, cellHighlight)

        for (let i = 0; i < this.cellSharking.length; i++) {
            const { x, y } = this.cellSharking[i]
            const { cell } = this.dataBoard[y][x]

            if (
                rowsCaptureCells.indexOf(y) !== -1 ||
                colsCaptureCells.indexOf(x) !== -1 ||
                captureCells3x3.some((i) => i.x === x && i.y === y)
            )
                continue

            // cell.stopAnimShaking()
            cell.hideImageHighlight()
        }

        this.cellSharking = []
    }

    public removeAllCanCaptureCells() {
        if (this.cellSharking.length === 0) return

        for (let i = 0; i < this.cellSharking.length; i++) {
            const { x, y } = this.cellSharking[i]
            const { cell } = this.dataBoard[y][x]

            // cell.stopAnimShaking()
            cell.hideImageHighlight()
        }

        this.cellSharking = []
    }

    public handleSuggestMove(cellsPosition: IPosition[]) {
        try {
            // 1. set suggest cells
            this.suggestCells = cellsPosition

            // 2. set highlight
            for (let i = 0; i < cellsPosition.length; i++) {
                const { x, y } = cellsPosition[i]

                const { cell } = this.dataBoard[y][x]
                cell.setFrameImageCell(FRAME_32.GEM_HIGHT_LIGHT)
                cell.setAlphaImageCell(1)
            }
        } catch (ex) {
            console.log(ex)
        }
    }

    /**
     * Handle remove suggest cells.
     */
    public handleRemoveSuggestMove() {
        try {
            // 1. set highlight
            for (let i = 0; i < this.suggestCells.length; i++) {
                const { x, y } = this.suggestCells[i]
                const { cell } = this.dataBoard[y][x]

                if (!this.isCellHighlight(cell)) {
                    cell.setFrameImageCell(FRAME_32.GEM_TRANSPARENT)
                }
            }

            // 2. set suggest cells
            this.suggestCells = []
        } catch (ex) {
            console.log(ex)
        }
    }

    public handleMove(cellsHighlight: ICell[], onComplete?: () => void) {
        try {
            for (let i = 0; i < cellsHighlight.length; i++) {
                const { x, y } = cellsHighlight[i]
                if (this.dataBoard[y] && this.dataBoard[y][x]) {
                    this.dataBoard[y][x].frame = FRAME_32.GEM
                    this.dataBoard[y][x].value = 1

                    const { cell } = this.dataBoard[y][x]

                    cell.setFrameImageCell(FRAME_32.GEM)
                    cell.setAlphaImageCell(1)
                }
            }

            const captureCells = getCaptureCells(this.dataBoard, cellsHighlight)

            this.handleCapturePiece(captureCells)

            const isGameOver = this.checkIsGameOver()

            if (isGameOver) {
                this.scene.setIsGameOver(true)
            }

            this.handlePraise(cellsHighlight, captureCells)

            if (onComplete) {
                onComplete()
            }

            this.handleResetFrameBoard()

            this.scene.updateMatchData()

            this.handleGameOver()
        } catch (ex) {
            console.log(ex)
            // captureError(ex);
        }
    }

    private handleResetFrameBoard(): void {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (this.dataBoard[y] && this.dataBoard[y][x] && this.dataBoard[y][x].value === 1) {
                    const { frame, cell } = this.dataBoard[y][x]

                    if (!cell.visible) {
                        sendException(new Error('Cell is invisible'))
                    }

                    if (cell.getFrameImageCell() !== frame) {
                        sendException(new Error('Cell is frame not true'))
                    }

                    cell.setFrameImageCell(frame)
                }
            }
        }
    }

    private checkIsGameOver(): boolean {
        const { footer } = this.scene.layoutManager.objects

        const data: any[] = []
        const piecesActive = footer.pieces.piecesActive
        const allPieces = footer.pieces.allPieces

        for (let i = 0; i < piecesActive.length; i++) {
            const { position, used } = piecesActive[i]

            if (used) continue

            const piece = allPieces[position]
            data.push({
                data: piece.data,
                type: piece.type,
                direction: piece.direction,
                isReverse: piece.isReverse,
                frame: piece.frame,
            })
        }

        const gameOver = isGameOver(this.dataBoard, data)

        if (!gameOver) {
            return false
        }

        return true
    }

    private handleGameOver() {
        const isGameOver = this.checkIsGameOver()

        if (!isGameOver) return

        this.scene.disableInput()

        this.runAnimationGameOver()
    }

    /**
     * Handle animation game over. change all cells is gem_silver
     * @param callback
     */
    private runAnimationGameOver(): void {
        try {
            this.scene.audio.playSound(SOUND_EFFECT.BOARD_GAME_OVER)

            // 1. loop cell
            const delayTimes = []
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    // 1.2 set color silver to frame.
                    if (
                        this.dataBoard[y] &&
                        this.dataBoard[y][x] &&
                        this.dataBoard[y][x].value === 1
                    ) {
                        const delay = Math.floor(100 * (y + 1))
                        delayTimes.push({
                            delay,
                            x,
                            y,
                        })

                        this.scene.time.delayedCall(delay, () => {
                            const { cell } = this.dataBoard[y][x]
                            cell.playAnimImageGameOver()
                        })
                    }
                }
            }

            this.scene.time.addEvent({
                delay: delayTimes[delayTimes.length - 1].delay + 300,
                callback: () => {
                    this.scene.handleRequestFinishGame()
                },
            })
        } catch (ex) {
            console.log(ex)
        }
    }

    public rescue(): void {
        // 1. set colors for cells
        for (let y = 0; y < this.dataBoard.length; y++) {
            for (let x = 0; x < this.dataBoard[y].length; x++) {
                if (this.dataBoard[y]) {
                    const dataBoardItem = this.dataBoard[y][x]

                    if (dataBoardItem && dataBoardItem.value === 1) {
                        this.dataBoard[y][x].cell.setFrameImageCell(FRAME_32.GEM)
                        this.dataBoard[y][x].cell.resetImageGameOver()
                    }
                }
            }
        }

        // 2. call use bomb
        this.handleUseBomb()
    }

    private hasPieceL5() {
        const { footer } = this.scene.layoutManager.objects

        const { piecesActive } = footer.pieces

        return (
            piecesActive.filter((item: IPiece) => {
                return item.type === LINE_5_TYPE
            }).length > 0
        )
    }

    private hasPieceCross5() {
        const { footer } = this.scene.layoutManager.objects

        const { piecesActive } = footer.pieces

        return (
            piecesActive.filter((item: IPiece) => {
                return item.type === CROSS_PIECE_5
            }).length > 0
        )
    }

    /**
     * Handle use bomb remove 1/4 cells in board.
     * @params onComplete is function
     */
    private handleUseBomb(): void {
        try {
            const isHasItemL5 = this.hasPieceL5()
            const isHasItemCross5 = this.hasPieceCross5()

            // window.game.playSound(SoundEffect.BOMB)

            // 1. random cells of 1/4 board
            const index = Math.floor(Math.random() * RESCUE_LIST.length)
            let rescue = RESCUE_LIST[index]

            if (isHasItemL5) {
                rescue = RESCUE_LIST_L5[index]
            }

            if (isHasItemCross5) {
                rescue = RESCUE_LIST_CROSS_5[index]
            }

            // 1.2 build cells run animations
            const cells = []

            for (let y = rescue.minRow; y < rescue.minRow + rescue.rows; y++) {
                for (let x = rescue.minCol; x < rescue.minCol + rescue.cols; x++) {
                    if (this.dataBoard[y][x].frame === FRAME_32.GEM_TRANSPARENT) continue
                    cells.push({ x, y })
                }
            }

            // 2 clear cells
            for (let i = 0; i < cells.length; i++) {
                const { x, y } = cells[i]
                const dataBoardItem = this.dataBoard[y][x]

                dataBoardItem.frame = FRAME_32.GEM_TRANSPARENT
                dataBoardItem.value = 0
                dataBoardItem.cell.setFrameImageCell(FRAME_32.GEM_TRANSPARENT)
            }

            this.woodenEffect.handleShowEffect(cells)

            const { footer } = this.scene.layoutManager.objects

            footer.pieces.setActivePieces()

            this.scene.updateMatchData()
        } catch (ex) {
            console.log(ex)
        }
    }

    /**
     * Check can capture lines 4 or 5
     * @param board
     * @param minLine
     */
    public canCaptureLines = (board: any, minLine = 5): ICanCaptureLines => {
        // 1. calculate cols, rows
        const rows = board.length
        const cols = board[0].length

        // 2. calculate cols and rows can capture
        const colsCanCapture = []
        const rowsCanCapture = []
        const statsCol = []
        for (let y = 0; y < rows; y++) {
            let countX = 0
            const positionX = { x: -1, y: -1 }

            for (let x = 0; x < cols; x++) {
                if (y === 0) {
                    statsCol[x] = { count: 0, x: -1, y: -1 }
                }

                if (board[y][x].value === 1) {
                    statsCol[x].count++
                    countX++
                } else {
                    positionX.x = x
                    positionX.y = y
                    statsCol[x].x = x
                    statsCol[x].y = y
                }
            }

            // 2.2 get list col, row can capture
            if (countX === cols - 1) rowsCanCapture.push({ row: y, ...positionX })
            if (y === rows - 1) {
                for (let x = 0; x < cols; x++) {
                    if (statsCol[x].count === rows - 1)
                        colsCanCapture.push({ col: x, ...statsCol[x] })
                }
            }
        }

        // 3. check can capture greater than 5 lines
        // 3.1 check rows
        if (rowsCanCapture.length >= minLine) {
            let count = 0
            const position = { x: -1, y: -1 }
            for (let i = 0; i < rowsCanCapture.length; i++) {
                if (i === 0) {
                    position.x = rowsCanCapture[i].x
                    position.y = rowsCanCapture[i].y
                    count++
                    continue
                }

                if (rowsCanCapture[i].x === position.x && rowsCanCapture[i].y === position.y + 1) {
                    position.x = rowsCanCapture[i].x
                    position.y = rowsCanCapture[i].y
                    count++
                } else {
                    count = 1
                }
                if (count >= minLine) return { isCapture: true, direction: 'vertical', minLine }
            }
        }

        // 3.2 check cols
        if (colsCanCapture.length >= minLine) {
            let count = 0
            const position = { x: -1, y: -1 }
            for (let i = 0; i < colsCanCapture.length; i++) {
                if (i === 0) {
                    position.x = colsCanCapture[i].x
                    position.y = colsCanCapture[i].y
                    count++
                    continue
                }

                if (colsCanCapture[i].x === position.x + 1 && colsCanCapture[i].y === position.y) {
                    position.x = colsCanCapture[i].x
                    position.y = colsCanCapture[i].y
                    count++
                } else {
                    count = 1
                }
                if (count >= minLine) return { isCapture: true, direction: 'horizontal', minLine }
            }
        }

        return { isCapture: false, direction: '', minLine }
    }

    public getBoardByFen(fen: string) {
        try {
            // 1. decode fen
            const board: any[][] = []
            const tmp = fen.split(' ')

            if (tmp.length < 2) throw new Error('Invalid fen')

            const fenBoard = tmp[0]

            // 2. get board
            const tmpBoard = fenBoard.split('/')
            const rows = tmpBoard.length
            for (let y = 0; y < rows; y++) {
                board[y] = []
                const data = decodeRowByString(tmpBoard[y])
                for (let x = 0; x < data.length; x++) {
                    board[y][x] = data[x]
                }
            }

            return board
        } catch (error) {
            this.clearBoard()
            return this.dataBoard
        }
    }

    public getFenByBoard(): string {
        // 1. build board position
        let fenBoard = ''
        for (let y = 0; y < rows; y++) {
            let countGray = 0
            let row = ''
            for (let x = 0; x < cols; x++) {
                // 1.2 if position value = 0
                if (this.dataBoard[y][x].value === 0) countGray++

                // 1.3 value = 1
                if (this.dataBoard[y][x].value === 1) {
                    if (countGray > 0) {
                        row += countGray >= rows ? 'x' : `${countGray}`
                        countGray = 0
                    }
                    const character = getFenCharacterByCode(this.dataBoard[y][x].frame)
                    row += `${character}`
                }

                // 1.4
                if (x === this.dataBoard[y].length - 1 && countGray > 0)
                    row += countGray >= rows ? 'x' : `${countGray}`
            }

            // 1.5 end row
            fenBoard += y === this.dataBoard.length - 1 ? `${row}` : `${row}/`
        }

        return fenBoard
    }

    /**
     * Handle start game with board data. If invalid board then board is clear.
     * @param board
     */
    public startGame(board: any): void {
        // 1. validate
        if (!board) return

        // 2. init board
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                const { value, frame } = board[y][x]
                const dataBoardItem = this.dataBoard[y][x]

                if (value === 1) {
                    dataBoardItem.value = 1
                    dataBoardItem.frame = frame
                    dataBoardItem.cell.setFrameImageCell(FRAME_32.GEM)
                }
            }
        }
    }

    /**
     * Clear all data in board.
     */
    public clearBoard(): void {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const dataBoardItem = this.dataBoard[y][x]

                dataBoardItem.value = 0
                dataBoardItem.frame = FRAME_32.GEM_TRANSPARENT

                dataBoardItem.cell.reset()
                dataBoardItem.cell.setFrameImageCell(FRAME_32.GEM_TRANSPARENT)
                dataBoardItem.cell.resetImageGameOver()
            }
        }
    }

    public isCellHighlight(cell: ICell): boolean {
        const filter = this.cellsHighlight.filter((item) => {
            return item.x === cell.x && item.y && cell.y
        })

        if (filter && filter.length > 0) return true

        return false
    }
}
