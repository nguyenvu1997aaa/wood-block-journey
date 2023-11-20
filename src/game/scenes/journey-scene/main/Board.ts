import { ICaptureCell, ICell, iCellHighlight } from '@/constants/ICommon'
import {
    FRAME_BLOCK_GRADIENT_COMBO,
    FRAME_BLOCK_GRADIENT_NORMAL,
} from '@/game/constants/blockGradient'
import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import WORLD_EVENTS from '@/plugins/world/constants/events'
import { sendException, sendExceptionWithScope } from '@/utils/Sentry'
import vibrate from '@/utils/vibrate'
import JourneyScene from '..'
import Cell from '../common/Cell'
import CollectionEffect from '../common/CollectionEffect'
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
import { FEN_GEM, FRAME_GEM_TILED_MAP } from '../constant/piece'
import { TARGET_COLLECT } from '../constant/target'
import { ICanCaptureLines } from '../constant/types'

const { KEY, FRAME } = SPRITES.GAMEPLAY
const { KEY: KEY_32, FRAME: FRAME_32 } = SPRITES.GAMEPLAY_32
const { cols, rows } = GameCore.Configs.Board
const { FRAME: D_FRAME } = SPRITES.DEFAULT
const { VibrateValue } = GameCore.Configs.Gameplay

export interface IBoardData {
    x: number
    y: number
    value: number
    width: number
    height: number
    frame: string
    cell: Cell
}

export default class Board extends Phaser.GameObjects.Container {
    scene: JourneyScene
    private suggestCells: IPosition[] = []

    public pX: number
    public pY: number
    public borderLeftSize = 4
    public borderTopSize = 4
    public cellSize: number
    public cellPadding: number
    public diceSize: number
    public dataBoard: IBoardData[][] = []
    public cellsHighlight: ICaptureCell[] = []
    public cellSharking: Cell[] = []

    public boardFrame: Phaser.GameObjects.Image

    public woodenEffect: WoodenEffect
    private collectionEffect: CollectionEffect
    public offsetY = -27

    constructor(scene: JourneyScene, width: number, height: number) {
        super(scene)

        this.scene = scene

        this.setSize(width, height)

        this.woodenEffect = new WoodenEffect(this.scene)
        this.collectionEffect = new CollectionEffect(this.scene)

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
                cell.setFrameImageCell(FRAME_32.GEM)

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

    public handleHighlight(
        cellsHighlight: ICaptureCell[],
        highlightCellCanCapture: Function
    ): void {
        this.cellsHighlight = cellsHighlight

        for (let i = 0; i < cellsHighlight.length; i++) {
            const { x, y, frame } = cellsHighlight[i]
            if (this.dataBoard[y] && this.dataBoard[y][x] && this.dataBoard[y][x].value === 0) {
                const { cell } = this.dataBoard[y][x]
                this.dataBoard[y][x].frame = frame || FRAME_32.GEM
                cell.setFrameImageCell(frame || FRAME_32.GEM)
                cell.setAlphaImageCell(0.3)
            }
        }

        this.canCaptureCells(cellsHighlight, highlightCellCanCapture)
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

            const captureCellCollection = captureCells.filter((item: ICaptureCell) => {
                return item.frame !== FRAME_32.GEM
            })

            this.collectionEffect.handleShowEffect(captureCellCollection)

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
                    if (cell.getFrameImageCell() === FRAME_32.GEM) {
                        cell.resetImageBreak()

                        const isCombo =
                            combo > 2 && (colsCapture.length >= 3 || rowsCapture.length >= 3)
                        let frameBlockGradient = ''

                        if (isCombo) {
                            frameBlockGradient =
                                FRAME_BLOCK_GRADIENT_COMBO[indexCell] ||
                                FRAME_BLOCK_GRADIENT_COMBO[0]

                            cell.imageBreak.setFrame(frameBlockGradient)
                        } else {
                            frameBlockGradient =
                                FRAME_BLOCK_GRADIENT_NORMAL[indexColor] ||
                                FRAME_BLOCK_GRADIENT_NORMAL[0]

                            cell.imageBreak.setFrame(frameBlockGradient)
                        }

                        cell.playTweenScaleDown()
                    }

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
        const cellCapturePieceOnCellHighlight = []

        for (let i = 0; i < cellsHighlight.length; i++) {
            const itemCellHighlight = cellsHighlight[i]

            if (this.checkPositionCellOnCaptureCell(itemCellHighlight, captureCells)) {
                cellCapturePieceOnCellHighlight.push(itemCellHighlight)
            }
        }

        if (cellCapturePieceOnCellHighlight.length === 0) return

        if (this.scene.targetMissionManager.getTargetType() === TARGET_COLLECT) {
            this.playEatSound(1)
            return
        }

        let score = calculateScore()
        const combo = getAmountCombo()

        if (combo > 1) {
            score = calculateScoreCombo()
        }

        let minPx = cellCapturePieceOnCellHighlight[0].pX
        let maxPx = 0
        let minPy = cellCapturePieceOnCellHighlight[0].pY
        let maxPy = 0

        for (let i = 0; i < cellCapturePieceOnCellHighlight.length; i++) {
            const cell = cellCapturePieceOnCellHighlight[i]
            if (cell.pX < minPx) {
                minPx = cell.pX
            }

            if (cell.pX > maxPx) {
                maxPx = cell.pX
            }

            if (cell.pY < minPy) {
                minPy = cell.pY
            }

            if (cell.pY > maxPy) {
                maxPy = cell.pY
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
        // if (amountCombo > 1) {
        //     this.scene.effectManager.streakBreak.setTextCombo(amountCombo)
        //     this.scene.effectManager.streakBreak.setBgFrame(D_FRAME.BG_COMBO)
        // } else if (amountStreak > 1) {
        //     this.scene.effectManager.streakBreak.setTextStreak(amountStreak)
        //     this.scene.effectManager.streakBreak.setBgFrame(D_FRAME.BG_STREAK)
        // }

        this.scene.effectManager.streakBreak.playAnim(x, y - 20)
    }

    private getVibrateByLevel(level: number) {
        return VibrateValue[level] || 0
    }

    private playEatSound(level: number): void {
        this.scene.audio.playSound(SOUND_EFFECT.EAT_BLOCK)

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

    public handleMove(cellsHighlight: iCellHighlight[], onComplete?: () => void) {
        try {
            for (let i = 0; i < cellsHighlight.length; i++) {
                const { x, y, frame = FRAME_32.GEM } = cellsHighlight[i]

                if (this.dataBoard[y] && this.dataBoard[y][x]) {
                    this.dataBoard[y][x].frame = frame
                    this.dataBoard[y][x].value = 1

                    const { cell } = this.dataBoard[y][x]

                    cell.setFrameImageCell(frame)
                    cell.setAlphaImageCell(1)
                }
            }

            const captureCells = getCaptureCells(this.dataBoard, cellsHighlight)

            this.handleCapturePiece(captureCells)

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

                    cell.setAlpha(1)

                    console.log(
                        'handleResetFrameBoard',
                        frame,
                        cell.visible,
                        cell.alpha,
                        cell.scale
                    )
                    cell.setFrameImageCell(frame)
                }
            }
        }
    }

    private handleGameOver() {
        if (this.scene.isLevelComplete) return
        const { footer } = this.scene.layoutManager.objects

        const data: any[] = []
        const piecesActive = footer.pieces.piecesActive
        const allPieces = footer.pieces.allPieces

        for (let i = 0; i < piecesActive.length; i++) {
            const { position, used } = piecesActive[i]

            if (used) continue

            const { piece } = allPieces[position]
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
            return
        }

        this.scene.isGameOver = true

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
    }

    public getFenByBoard(): string {
        // 1. build board position
        let fenBoard = ''
        for (let y = 0; y < rows; y++) {
            let row = ''
            for (let x = 0; x < cols; x++) {
                const { value, frame } = this.dataBoard[y][x]
                const character = getFenCharacterByCode(frame) || FEN_GEM

                switch (value) {
                    case 0:
                        row += ',x'
                        break

                    case 1:
                        row += `,${character}`
                        break
                }
            }

            row = row.substring(1)

            fenBoard += `/${row}`
        }

        return fenBoard.substring(1)
    }

    /**
     * Handle start game with board data. If invalid board then board is clear.
     * @param board
     */
    public startGame(board: any, fen: string): void {
        // 1. validate
        if (!board) return

        // 2. init board
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                let { frame } = board[y][x]
                const { value } = board[y][x]
                const dataBoardItem = this.dataBoard[y][x]

                if (value === 1) {
                    if (!frame || frame === FRAME_32.GEM_TRANSPARENT) {
                        sendExceptionWithScope(new Error('MapByBoardError'), {
                            level: this.scene.levelManager.getLevel(),
                            row: y,
                            col: x,
                            frame,
                            fen,
                        })

                        frame = FRAME_32.GEM
                    }

                    dataBoardItem.value = 1
                    dataBoardItem.frame = frame
                    dataBoardItem.cell.setFrameImageCell(frame)
                    // dataBoardItem.cell.setAlphaImageCell(0)

                    dataBoardItem.cell.setScale(0)
                }
            }
        }

        this.fadeIn()
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

    public setFrameBoardByIndex(row: number, col: number, frame: string): void {
        const data = this.dataBoard[row][col]
        const { cell } = data

        cell.setFrameImageCell(frame)

        data.frame = frame
        data.value = 1

        cell.setScale(0)

        // cell.setScaleImageCell(0)
        // cell.setAlphaImageCell(0)
    }

    public getFrameByMapItemIndex(index: number): string {
        console.log('index === ', index)

        //@ts-ignore
        return FRAME_GEM_TILED_MAP[index]
    }

    public fadeOut(): Phaser.Tweens.Tween | null {
        const itemTween = []

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const dataBoardItem = this.dataBoard[y][x]

                if (!dataBoardItem.value) continue

                itemTween.push(dataBoardItem.cell)
            }
        }

        if (!itemTween || itemTween.length === 0) return null

        const tween = this.scene.add.tween({
            targets: itemTween,
            duration: 300,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            alpha: {
                from: 1,
                to: 0,
            },
            scale: {
                from: 1,
                to: 0,
            },
            paused: true,
        })

        tween.play()

        return tween
    }

    public fadeIn(): void {
        const itemTween = []

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const dataBoardItem = this.dataBoard[y][x]

                if (!dataBoardItem.value) continue

                itemTween.push(dataBoardItem.cell)
            }
        }

        if (!itemTween || itemTween.length === 0) return

        const tween = this.scene.add.tween({
            targets: itemTween,
            duration: 300,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            alpha: {
                from: 0,
                to: 1,
            },
            scale: {
                from: 0,
                to: 1,
            },
            paused: true,
        })

        tween.play()
    }
}
