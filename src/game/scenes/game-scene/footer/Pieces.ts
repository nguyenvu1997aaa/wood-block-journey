import FPS from '@/game/constants/fps'
import SPRITES from '@/game/constants/resources/sprites'
import WORLD_EVENTS from '@/plugins/world/constants/events'
import Piece from '../common/Piece/Piece'
import PieceFactory from '../common/Piece/PieceFactory'
import { decodePiece, getFenCharacterByCode, isPieceMoveInBoard } from '../common/Piece/utils/board'
import {
    BOTTOM,
    HORIZONTAL,
    HORIZONTAL_LEFT,
    HORIZONTAL_RIGHT,
    LINE_2_TYPE,
    LINE_3_TYPE,
    LINE_4_TYPE,
    LINE_5_TYPE,
    L_1_TYPE,
    L_3_TYPE,
    L_TYPE,
    PIECE_RATE_CAPTURE_LINES_4,
    PIECE_RATE_CAPTURE_LINES_5,
    PIECE_TYPES,
    PIECE_TYPES_RATE,
    SQUARE_1_TYPE,
    SQUARE_2_TYPE,
    SQUARE_3_TYPE,
    TOP,
    TRAPEZOID_TYPE,
    TRIANGLE_TYPE,
    VERTICAL,
    VERTICAL_LEFT,
    VERTICAL_RIGHT,
    LEFT,
    RIGHT,
    T_PIECE,
    PLUS_PIECE,
    CROSS_PIECE_2,
    CROSS_PIECE_3,
    CROSS_PIECE_5,
    CROSS_PIECE_4,
    U_PIECE,
} from '../constant/piece'
import { ICanCaptureLines } from '../constant/types'
import GameScene from '../GameScene'

const { KEY, FRAME } = SPRITES.GAMEPLAY_32

export default class Pieces extends Phaser.GameObjects.Container {
    public scene: GameScene

    private tweenToEnableMaxFps: Phaser.Tweens.Tween

    public cellSize: number
    public canCaptureLines: ICanCaptureLines
    public allPieces: Piece[] = []
    public allPiecesGroup: any = []
    public piecesActive: any = []
    public positionPiece: IPosition[]

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        if (this.scene.world.isLandscape()) {
            this.setSize(101, 300)
        } else {
            this.setSize(375, 140)
        }

        scene.add.existing(this)

        const { width, height } = this.scene.gameZone

        const pieceY = (height / 2 - 352 / 2 - 27 + 100) / -2

        console.log('pieceY', pieceY)

        this.positionPiece = [
            { x: -width / 3, y: pieceY },
            { x: 0, y: pieceY },
            { x: width / 3, y: pieceY },
        ]

        this.canCaptureLines = { isCapture: false, direction: '', minLine: 5 }
    }

    public init() {
        this.initCellSize()

        this.createAllPieces()

        this.createAllPiecesGroup()

        this.createTweenToEnableMaxFps()

        this.registerEvents()
    }

    private registerEvents(): void {
        this.scene.world.events.on(WORLD_EVENTS.RESIZE, this.handleResize, this)
    }

    public handleResize(): void {
        for (let i = 0; i < this.piecesActive.length; i++) {
            const piece = this.allPieces[this.piecesActive[i].position]
            const { x, y } = this.positionPiece[i]

            piece.updatePosition(x, y)
            piece.updateWrapPiecePosition()
        }
    }

    private initCellSize() {
        const { main } = this.scene.layoutManager.objects

        if (this.scene.world.isLandscape()) {
            this.cellSize = (main.board.cellSize * 35) / 100
        } else {
            this.cellSize = (main.board.cellSize * 41) / 100
        }
    }

    private createTweenToEnableMaxFps() {
        this.tweenToEnableMaxFps = this.scene.add.tween({
            targets: [],
            duration: 300,
            loop: -1,
            paused: true,
        })
    }

    public playTweenToEnableMaxFps() {
        this.tweenToEnableMaxFps.play()
    }

    public stopTweenToEnableMaxFps() {
        this.tweenToEnableMaxFps.stop()
    }

    /**
     * Get list direction by piece type.
     * @param type
     * @returns {Array}
     */
    getDirectionsByType(type: string) {
        const squareTypes = [SQUARE_1_TYPE, SQUARE_2_TYPE, SQUARE_3_TYPE]
        if (squareTypes.some((value) => value === type)) return []

        let direction: string[] = []
        switch (type) {
            case L_TYPE:
            case L_1_TYPE:
            case L_3_TYPE: {
                direction = [TOP, LEFT, RIGHT, BOTTOM]
                break
            }
            case LINE_2_TYPE:
            case LINE_3_TYPE:
            case LINE_4_TYPE:
            case LINE_5_TYPE: {
                direction = [VERTICAL, HORIZONTAL]
                break
            }
            case TRIANGLE_TYPE: {
                direction = [TOP, LEFT, RIGHT, BOTTOM]
                break
            }
            case TRAPEZOID_TYPE: {
                direction = [VERTICAL_LEFT, VERTICAL_RIGHT, HORIZONTAL_LEFT, HORIZONTAL_RIGHT]
                break
            }
            case T_PIECE: {
                direction = [TOP, LEFT, RIGHT, BOTTOM]
                break
            }
            case U_PIECE: {
                direction = [TOP, LEFT, RIGHT, BOTTOM]
                break
            }
            case PLUS_PIECE: {
                direction = []
                break
            }
            case CROSS_PIECE_2:
            case CROSS_PIECE_3:
            case CROSS_PIECE_4:
            case CROSS_PIECE_5: {
                direction = [LEFT, RIGHT]
                break
            }
            default: {
                break
            }
        }
        return direction
    }

    public createAllPieces() {
        // 1. generate all pieces
        const cellSize = this.cellSize

        const items: any[] = []
        for (let i = 0; i < PIECE_TYPES.length; i++) {
            // 1.2 get directions
            const directions = this.getDirectionsByType(PIECE_TYPES[i])
            if (directions.length <= 0) {
                items.push({ type: PIECE_TYPES[i] })
            } else {
                for (let j = 0; j < directions.length; j++) {
                    items.push({ type: PIECE_TYPES[i], direction: directions[j] })
                }

                // 2. L Piece reverse
                if (L_TYPE === PIECE_TYPES[i]) {
                    for (let j = 0; j < directions.length; j++) {
                        items.push({
                            type: PIECE_TYPES[i],
                            direction: directions[j],
                            isReverse: true,
                        })
                    }
                }
            }
        }

        // 2. create pieces and save
        for (let i = 0; i < items.length; i++) {
            const props = {
                ...items[i],
                texture: KEY,
                frame: FRAME.GEM,
                x: Math.floor(this.x),
                y: Math.floor(this.y),
                width: Math.floor(cellSize / 2),
                height: Math.floor(cellSize / 2),
                cellLength: Math.floor(cellSize / 2),
                parentHeight: this.height,
                wrap: {
                    x: Math.floor(this.x),
                    y: Math.floor(this.y),
                    width: Math.floor(cellSize / 2),
                    height: Math.floor(cellSize / 2),
                },
            }
            const piece = PieceFactory.create(this.scene, this, props)
            piece.hide()

            this.add(piece)

            this.allPieces.push(piece)
        }
    }

    public createAllPiecesGroup() {
        for (let i = 0; i < this.allPieces.length; i++) {
            const piece = this.allPieces[i]
            if (!this.allPiecesGroup[piece.type]) this.allPiecesGroup[piece.type] = []
            this.allPiecesGroup[piece.type].push(i)
        }
    }

    public randomPieces() {
        const number = 3

        // 1. emit event update fps
        this.scene.game.updateFps(FPS.max)

        // 1.1 build piece type rates
        let pieceRates = this.buildPieceRates(false)

        // 1.2 random pieces
        const piecesRandom: any[] = []
        while (piecesRandom.length < number) {
            // 1.2.1 random piece
            const indexPieceRates = Math.floor(Math.random() * pieceRates.length)
            const groupName = pieceRates[indexPieceRates]
            if (!this.allPiecesGroup[groupName]) continue

            // 1.2.2 random in group
            const index = Math.floor(Math.random() * this.allPiecesGroup[groupName].length)
            let position = this.allPiecesGroup[groupName][index]

            // 1.2.3 if has can capture 5 line
            const isInList5Lines = [LINE_4_TYPE, LINE_5_TYPE].some((value) => value === groupName)
            if (this.canCaptureLines.isCapture && isInList5Lines) {
                for (let i = 0; i < this.allPiecesGroup[groupName].length; i++) {
                    const newPosition = this.allPiecesGroup[groupName][i]
                    if (
                        this.allPieces[newPosition] &&
                        this.allPieces[newPosition].direction === this.canCaptureLines.direction
                    ) {
                        position = newPosition
                        break
                    }
                }

                // 1.2.4 if line_4 or line_5 exists then change rate to default
                pieceRates = this.buildPieceRates(false)
            }

            // 1.3 check if piece exists in list pieces active then retry random
            if (!piecesRandom.some((item) => item.index === position)) {
                piecesRandom.push({
                    index: position,
                    type: groupName,
                })
            }
        }

        // 3. get pieces
        const pieces: any[] = []

        for (let i = 0; i < piecesRandom.length; i++) {
            const position = piecesRandom[i].index
            const piece = this.allPieces[position]
            pieces.push({
                position,
                texture: KEY,
                frame: FRAME.GEM,
                type: piece.type,
                direction: piece.direction,
                isReverse: piece.isReverse,
            })
        }

        this.piecesActive = pieces
    }

    /**
     * Build random rate of pieces.
     * If can capture lines 4 or 5. Increase rating random Line 4, 5 piece.
     * @param isCheckCanCaptureLines // default true to force check can capture lines
     */
    public buildPieceRates(isCheckCanCaptureLines = true) {
        const { main } = this.scene.layoutManager.objects

        // 1. if rating for capture greater than 5, pieces line 4 and 5 rating multiply 4 times
        const rating = []
        for (let i = 0; i < PIECE_TYPES_RATE.length; i++) {
            rating.push({ ...PIECE_TYPES_RATE[i] })
        }

        // 1.2 check can capture line
        if (isCheckCanCaptureLines) {
            const board = main.board.dataBoard
            let minLine = 5
            this.canCaptureLines = main.board.canCaptureLines(board, minLine)
            if (this.canCaptureLines.isCapture) {
                for (let i = 0; i < rating.length; i++) {
                    if (rating[i].type === LINE_5_TYPE) rating[i].rate = PIECE_RATE_CAPTURE_LINES_5
                }
            } else {
                minLine = 4
                this.canCaptureLines = main.board.canCaptureLines(board, minLine)
                if (this.canCaptureLines.isCapture) {
                    for (let i = 0; i < rating.length; i++) {
                        if (rating[i].type === LINE_4_TYPE)
                            rating[i].rate = PIECE_RATE_CAPTURE_LINES_4
                    }
                }
            }
        }

        // 2. build default rate
        const tmp: string[] = []
        for (let i = 0; i < rating.length; i++) {
            const { type, rate } = rating[i]
            for (let j = 0; j < rate; j++) {
                tmp.push(type)
            }
        }

        return tmp
    }

    /**
     * Draw list piece active.
     */
    private drawPieces(): void {
        for (let i = 0; i < this.piecesActive.length; i++) {
            const piece = this.allPieces[this.piecesActive[i].position]
            const { x, y } = this.positionPiece[i]

            piece.updatePosition(x, y)
            piece.updateWrapPiecePosition()
            piece.setIndex(i)
            piece.drawPiece()

            this.allPieces[this.piecesActive[i].position] = piece
        }
    }

    removeActivePiece(index: number) {
        this.piecesActive[index].used = true
    }

    existPiecesActive() {
        const filter = this.piecesActive.filter((item: any) => {
            return !item.used
        })

        return filter && filter.length > 0
    }

    showNewPieces() {
        for (let i = 0; i < this.allPieces.length; i++) {
            this.allPieces[i].reset()
        }

        this.randomPieces()

        this.setActivePieces()

        this.drawPieces()
    }

    /**
     * Calculate cellLength, and max col of pieces active
     */
    calculatePieceInfo() {
        let cols = 0
        let rows = 0

        // 1. get config board cell length
        const boardCellLength = this.cellSize

        // 1.2 calculator cols and rows
        for (let i = 0; i < this.piecesActive.length; i++) {
            const { data } = this.allPieces[this.piecesActive[i].position]
            cols += data[0].length
            if (data.length > rows) rows = data.length
        }

        // 2. calculator cell length
        const cellLength = boardCellLength / 2
        return { cellLength, cols }
    }

    /**
     * Check pieces active can move in board.
     * If piece can not move in board then set piece inactive. set visible is 0.6 alpha.
     */
    setActivePieces() {
        const { main } = this.scene.layoutManager.objects

        // 1. get board data.
        const board = main.board.dataBoard

        // 2. loop pieces
        for (let i = 0; i < this.piecesActive.length; i++) {
            const { position } = this.piecesActive[i]

            // 2.2 if piece can move in board
            const isActive = isPieceMoveInBoard(board, this.allPieces[position])

            this.allPieces[position].setCanMove(isActive)
        }
    }

    getPiecesByFen(fen: string) {
        // 1. decode fen
        const pieces: any = []
        const tmp = fen.split(' ')
        if (tmp.length < 2) throw new Error('Invalid fen')
        const fenPieces = tmp.splice(2)

        // 3. get pieces
        for (let i = 0; i < fenPieces.length; i++) {
            // 3.1
            if (fenPieces[i].trim() === 'l') continue

            // 3.2 decode piece
            const data = decodePiece(fenPieces[i].trim())
            pieces.push(data)
        }

        return pieces
    }

    public getFenByPieces(): string {
        let fenPieces = 'l'

        for (let i = 0; i < this.piecesActive.length; i++) {
            const { type, direction, isReverse, frame, used } = this.piecesActive[i]

            if (used) continue

            let name = getFenCharacterByCode(type)
            if (direction && direction !== '') name += `-${getFenCharacterByCode(direction)}`
            if (isReverse) name += `-r`
            fenPieces += ` ${name},${getFenCharacterByCode(frame)}`
        }

        return fenPieces
    }

    /**
     * Clear all pieces active.
     */
    public clearPieces(): void {
        for (let i = 0; i < this.piecesActive.length; i++) {
            const { position } = this.piecesActive[i]
            this.allPieces[position].hide()
        }
        this.piecesActive = []
    }

    /**
     * Show pieces when resume match. If no pieces then show new list
     * @param pieces
     */
    public showAvailablePieces(pieces: any): void {
        // 1. validate
        if (!pieces || pieces.length <= 0) {
            return
        }

        // 2. show list piece
        const newPieces: any[] = []
        for (let i = 0; i < pieces.length; i++) {
            const { type, direction, isReverse, frame } = pieces[i]
            for (let j = 0; j < this.allPieces.length; j++) {
                const piece = this.allPieces[j]
                if (
                    type === piece.type &&
                    direction === piece.direction &&
                    isReverse === piece.isReverse
                ) {
                    newPieces.push({
                        position: j,
                        texture: KEY,
                        frame,
                        type: piece.type,
                        direction: piece.direction,
                        isReverse: piece.isReverse,
                    })

                    break
                }
            }
        }

        // 3. set pieces active and draw
        this.piecesActive = newPieces

        this.setActivePieces()

        this.drawPieces()
    }

    public debuggerNextPieces(): void {
        for (let i = 0; i < this.piecesActive.length; i++) {
            this.removeActivePiece(i)
        }

        for (let i = 0; i < this.allPieces.length; i++) {
            this.allPieces[i].wrapPiece.setVisible(false)
        }

        this.showNewPieces()
    }
}
