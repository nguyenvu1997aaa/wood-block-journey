import Button from '@/game/components/Button'
import FPS from '@/game/constants/fps'
import SPRITES from '@/game/constants/resources/sprites'
import GameCore from '@/GameCore'
import WORLD_EVENTS from '@/plugins/world/constants/events'
import Piece from '../common/Piece/Piece'
import PieceFactory from '../common/Piece/PieceFactory'
import {
    decodePiece,
    getCodeByFenCharacter,
    getFenCharacterByCode,
    isPieceMoveInBoard,
} from '../common/Piece/utils/board'
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
    T_PIECE_TYPE,
    PLUS_PIECE_TYPE,
    CROSS_PIECE_2_TYPE,
    CROSS_PIECE_3_TYPE,
    CROSS_PIECE_5_TYPE,
    CROSS_PIECE_4_TYPE,
    U_PIECE_TYPE,
    PIECE_TYPES_TILED_MAP,
    FRAME_GEM_TILED_MAP,
} from '../constant/piece'
import { ICanCaptureLines, IPieceData, IPieceMap } from '../constant/types'
import JourneyScene from '../JourneyScene'

const { KEY, FRAME } = SPRITES.GAMEPLAY_32
const { Gameplay, Match } = GameCore.Configs

interface iAllPieces {
    piece: Piece
    isUsed: boolean
}

interface iSegment {
    avgScore: number
    score: number
    pieceDistancePerGem: number
    piece1: string
    piece5: string
}

export default class Pieces extends Phaser.GameObjects.Container {
    public scene: JourneyScene
    private tweenToEnableMaxFps: Phaser.Tweens.Tween

    public cellSize: number
    public canCaptureLines: ICanCaptureLines
    public allPieces: iAllPieces[] = []
    public allPiecesGroup: any = []
    public piecesActive: any = []

    public positionPiece: IPosition[]

    private listPieceMap: IPieceMap[] = []
    private amountPieceContainGem = 0
    private hasPieceContainGem: boolean

    private segmentAmountPiece1Min = 0
    private segmentAmountPiece1Max = 0
    private segmentAmountPiece1Cur = 0
    private segmentAmountPiece5Min = 0
    private segmentAmountPiece5Max = 0
    private segmentAmountPiece5Cur = 0
    private segmentAvgScore = 0
    private segmentTotalPieceScore = 0
    private segmentTotalPiece = 0
    private segmentTotalScore = 0
    private segmentPieceDistancePerGem = 0
    private segmentPieceRandomGem = false

    constructor(scene: JourneyScene) {
        super(scene)

        this.scene = scene

        if (this.scene.world.isLandscape()) {
            this.setSize(101, 300)
        } else {
            this.setSize(375, 140)
        }

        scene.add.existing(this)

        const { width, height } = this.scene.gameZone

        const pieceY = (height / 2 - 352 / 2 - 13 + 100) / -2

        this.positionPiece = [
            { x: -width / 3, y: pieceY },
            { x: 0, y: pieceY },
            { x: width / 3, y: pieceY },
        ]

        this.canCaptureLines = { isCapture: false, direction: '', minLine: 5 }
    }

    init() {
        this.initCellSize()

        this.createAllPieces()

        this.createAllPiecesGroup()

        this.createTweenToEnableMaxFps()

        this.addDebuggerBtnRandomPieces()

        this.registerEvents()
    }

    private registerEvents(): void {
        this.scene.world.events.on(WORLD_EVENTS.RESIZE, this.handleResize, this)
    }

    public handleResize(): void {
        for (let i = 0; i < this.piecesActive.length; i++) {
            const { piece } = this.allPieces[this.piecesActive[i].position]
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
            case T_PIECE_TYPE: {
                direction = [TOP, LEFT, RIGHT, BOTTOM]
                break
            }
            case U_PIECE_TYPE: {
                direction = [TOP, LEFT, RIGHT, BOTTOM]
                break
            }
            case PLUS_PIECE_TYPE: {
                direction = []
                break
            }
            case CROSS_PIECE_2_TYPE:
            case CROSS_PIECE_3_TYPE:
            case CROSS_PIECE_4_TYPE:
            case CROSS_PIECE_5_TYPE: {
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

            this.add(piece)

            piece.hide()
            this.allPieces.push({ piece, isUsed: false })
        }
    }

    public createAllPiecesGroup() {
        for (let i = 0; i < this.allPieces.length; i++) {
            const { piece } = this.allPieces[i]

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
                    const { piece } = this.allPieces[newPosition]

                    if (piece && piece.direction === this.canCaptureLines.direction) {
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
            const { piece } = this.allPieces[position]

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
        // 1. if rating for capture greater than 5, pieces line 4 and 5 rating multiply 4 times
        const rating = []
        for (let i = 0; i < PIECE_TYPES_RATE.length; i++) {
            rating.push({ ...PIECE_TYPES_RATE[i] })
        }
        const { main } = this.scene.layoutManager.objects

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
    private drawPieces() {
        console.log('this.piecesActive === ', this.piecesActive)

        for (let i = 0; i < this.piecesActive.length; i++) {
            const { position, fenPiece } = this.piecesActive[i]
            const { piece } = this.allPieces[position]
            const { x, y } = this.positionPiece[i]

            if (fenPiece) {
                const dataPiece = this.convertFenPiecesToData(fenPiece)

                if (dataPiece) {
                    piece.updateDataPiece(dataPiece)
                }
            } else {
                if (this.listPieceMap.length === 0) {
                    const pieceContainGem = this.isPieceContainGem()

                    if (pieceContainGem) {
                        const dataPieceRandom = this.getRandomPieceData(piece.data)

                        if (dataPieceRandom) {
                            piece.updateDataPiece(dataPieceRandom)
                        }
                    }
                }
            }

            piece.updatePosition(x, y)
            piece.updateWrapPiecePosition()
            piece.setIndex(i)
            piece.drawPiece()

            this.allPieces[position] = { piece, isUsed: true }
        }
    }

    private isPieceContainGem(): boolean {
        const random = Phaser.Math.Between(0, 1)

        if (random === 1 && !this.hasPieceContainGem) {
            this.amountPieceContainGem++
            this.hasPieceContainGem = true
            return true
        }

        if (this.amountPieceContainGem < Gameplay.RatePieceContainGem) {
            this.amountPieceContainGem++
            return false
        }

        if (this.amountPieceContainGem >= Gameplay.RatePieceContainGem) {
            const result = this.hasPieceContainGem
            this.amountPieceContainGem = 0
            this.hasPieceContainGem = false

            return !result
        }

        return false
    }

    private convertFenPiecesToData(fenPiece: string): IPieceData[][] | null {
        if (!fenPiece) return null

        const fens = fenPiece.split('/')

        if (fens.length === 0) return null

        const data: IPieceData[][] = []

        for (let x = 0; x < fens.length; x++) {
            const tmp = fens[x].split(',')
            data[x] = []

            for (let y = 0; y < tmp.length; y++) {
                let frame: string | null = getCodeByFenCharacter(tmp[y])

                if (tmp[y] === 'null' || tmp[y] === 'x') {
                    frame = null
                }

                data[x].push({
                    x,
                    y,
                    texture: frame,
                })
            }
        }

        return data
    }

    private countDataGem(data: IPieceData[]): number {
        let count = 0
        for (let i = 0; i < data.length; i++) {
            if (!data[i].texture) continue

            count++
        }

        return count
    }

    private getRandomPieceData(data: IPieceData[][]): IPieceData[][] | null {
        const { header } = this.scene.layoutManager.objects
        const targetKeys = header.collectItems.getTargetKeys()

        if (!targetKeys || targetKeys.length === 0) return null

        let count = 0
        const row = data.length
        const col = data[0].length

        for (let x = 0; x < row; x++) {
            for (let y = 0; y < col; y++) {
                const countGem = this.countDataGem(data[x])

                if (
                    !data[x][y].texture ||
                    (!Phaser.Math.Between(0, 1) && !count && y + 1 !== countGem)
                ) {
                    continue
                }

                let frame = FRAME.GEM

                if (count < Gameplay.MaxGemInPiece) {
                    const randomIndex = Phaser.Math.Between(0, targetKeys.length - 1)
                    frame = targetKeys[randomIndex]
                }

                data[x][y] = {
                    x,
                    y,
                    texture: frame,
                }

                count++
            }
        }

        return data
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
        this.resetAllPieces()

        if (this.listPieceMap.length > 0) {
            this.showListPieceMap()
            return
        }

        this.randomPieces()

        this.setActivePieces()

        this.drawPieces()
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
            const { piece } = this.allPieces[position]

            // 2.2 if piece can move in board
            const isActive = isPieceMoveInBoard(board, piece)

            piece.setCanMove(isActive)
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
            const { type, direction, isReverse, used, position } = this.piecesActive[i]

            if (used) continue

            let name = getFenCharacterByCode(type)

            if (direction && direction !== '') name += `-${getFenCharacterByCode(direction)}`
            if (isReverse) name += `-r`

            const { piece } = this.allPieces[position]

            fenPieces += ` ${name}|${this.getFenDataPiece(piece)}`
        }

        return fenPieces
    }

    private getFenDataPiece(piece: Piece): string {
        const data = piece.data
        const rows = data.length
        const cols = data[0].length
        let str = ''

        for (let row = 0; row < rows; row++) {
            let strCol = ''

            for (let col = 0; col < cols; col++) {
                strCol += `,${getFenCharacterByCode(data[row][col].texture)}`
            }

            str += `/${strCol.substring(1)}`
        }

        return str.substring(1)
    }

    /**
     * Clear all pieces active.
     */
    public clearPieces(): void {
        for (let i = 0; i < this.piecesActive.length; i++) {
            const { position } = this.piecesActive[i]

            this.allPieces[position].isUsed = false
            this.allPieces[position].piece.hide()
        }

        this.piecesActive = []
        this.listPieceMap = []
    }

    private resetAllPieces(): void {
        for (let i = 0; i < this.allPieces.length; i++) {
            this.allPieces[i].isUsed = false
            this.allPieces[i].piece.reset()
        }
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

        this.resetAllPieces()

        // 2. show list piece
        const newPieces: any[] = []
        for (let i = 0; i < pieces.length; i++) {
            const { type, direction, isReverse, frame } = pieces[i]
            let isSamePiece = false

            for (let j = 0; j < this.allPieces.length; j++) {
                const { piece, isUsed } = this.allPieces[j]

                if (
                    type === piece.type &&
                    direction === piece.direction &&
                    isReverse === piece.isReverse
                ) {
                    if (isUsed) {
                        isSamePiece = true
                        continue
                    }

                    isSamePiece = false

                    newPieces.push({
                        position: j,
                        texture: KEY,
                        frame,
                        type: piece.type,
                        direction: piece.direction,
                        isReverse: piece.isReverse,
                        fenPiece: pieces[i].fenPiece,
                    })

                    this.allPieces[j].isUsed = true

                    break
                }
            }

            if (isSamePiece) {
                const { piece: newPiece, index } = this.spawnPiece(type, direction, isReverse)

                newPieces.push({
                    position: index,
                    texture: KEY,
                    frame,
                    type: newPiece.type,
                    direction: newPiece.direction,
                    isReverse: newPiece.isReverse,
                    fenPiece: pieces[i].fenPiece,
                })
            }
        }

        // 3. set pieces active and draw
        this.piecesActive = newPieces

        this.setActivePieces()

        this.drawPieces()
    }

    private spawnPiece(
        type: string,
        direction: string,
        isReverse: boolean
    ): { piece: Piece; index: number } {
        const cellSize = this.cellSize

        const props = {
            type,
            direction,
            isReverse,
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
        this.allPieces.push({ piece, isUsed: true })

        this.add(piece)

        return { piece, index: this.allPieces.length - 1 }
    }

    private showListPieceMap(): void {
        this.piecesActive = this.listPieceMap.splice(0, 3)

        // if (!this.validItemsPieceMap(this.piecesActive) || this.piecesActive.length < 3) {
        //     this.randomPieces()
        // }

        this.showAvailablePieces(this.piecesActive)

        // Debugger
        const { footer } = this.scene.layoutManager.objects
        if (footer.textExist) {
            const text = this.listPieceMap.length <= 0 ? 'Done' : 'Exits'

            footer.textExist.setText(text)
        }
    }

    private validItemsPieceMap(itemsPiece: IPieceMap[]): boolean {
        let isValid = true
        const cloneItemsPiece = [...itemsPiece]

        while (cloneItemsPiece.length > 1) {
            const item = cloneItemsPiece.shift()

            const filterItem = cloneItemsPiece.filter((i) => {
                return (
                    i.type === item?.type &&
                    i.direction === item.direction &&
                    i.isReverse === item.isReverse
                )
            })

            if (filterItem && filterItem.length > 0) isValid = false
        }

        return isValid
    }

    public getPieceDataByType(type: string): IPieceMap {
        //@ts-ignore
        return PIECE_TYPES_TILED_MAP[type]
    }

    public addItemPieceMap(pieceMap: IPieceMap): void {
        if (pieceMap.properties) {
            const fenPiece = this.getFenPieceForPropertiesPieceMap(pieceMap)

            if (fenPiece) pieceMap = { ...pieceMap, fenPiece }
        }

        this.listPieceMap.push(pieceMap)
    }

    private getFenPieceForPropertiesPieceMap(pieceMap: IPieceMap): string {
        if (!pieceMap.properties) return ''

        let fen = ''

        const piece = this.allPieces.filter((item) => {
            const { piece: pieceItem } = item

            return (
                pieceItem.direction === pieceMap.direction &&
                pieceItem.isReverse === pieceMap.isReverse &&
                pieceItem.type === pieceMap.type
            )
        })[0]?.piece

        const key = pieceMap.properties[0].value.split(',')
        const position = pieceMap.properties[1].value.split(',')
        let count = 0

        if (!piece) return fen

        const piceData = piece.data
        const row = piceData.length
        const col = piceData[0].length

        for (let i = 0; i < row; i++) {
            let fenRow = ''

            for (let j = 0; j < col; j++) {
                const data = piceData[i][j]
                const { texture } = data

                let frameKey = texture
                const indexOfKey = position.indexOf(String(count))

                if (texture) {
                    if (indexOfKey !== -1) {
                        //@ts-ignore
                        frameKey = FRAME_GEM_TILED_MAP[key[indexOfKey]]
                    }

                    count++
                }

                let fenCode = null

                if (frameKey) {
                    fenCode = getFenCharacterByCode(frameKey)
                }

                fenRow += `,${fenCode}`
            }

            fen += `/${fenRow.substring(1)}`
        }

        return fen.substring(1)
    }

    public start(): void {
        if (this.listPieceMap.length === 0) {
            this.showNewPieces()
            return
        }

        this.showListPieceMap()
    }

    public getListPieceMap(): IPieceMap[] {
        return this.listPieceMap
    }

    public setListPieceMap(listPieceMap: IPieceMap[]): void {
        this.listPieceMap = [...listPieceMap]
    }

    public buildPiecesByMap(): void {
        const map = this.scene.mapManager.getTileMap()
        const { layers } = map
        const { properties } = layers[0]

        if (!properties || properties.length <= 0) return

        for (let i = 0; i < properties.length; i++) {
            const objectItem = properties[i] as { value: iSegment }
            const { value } = objectItem

            if (!value) continue

            const { avgScore, score, pieceDistancePerGem } = value

            console.log('pieceDistancePerGem === ', pieceDistancePerGem, avgScore, score)

            let { piece1, piece5 } = value

            piece1 = piece1.replace('min', '"min"').replace('max', '"max"')
            piece5 = piece5.replace('min', '"min"').replace('max', '"max"')

            const piece1Json = JSON.parse(piece1)
            const piece5Json = JSON.parse(piece5)

            this.segmentAvgScore = avgScore
            this.segmentAmountPiece1Min = piece1Json.min
            this.segmentAmountPiece1Max = piece1Json.max
            this.segmentAmountPiece5Min = piece5Json.min
            this.segmentAmountPiece5Max = piece5Json.max
            this.segmentTotalScore = score
            this.segmentPieceDistancePerGem = pieceDistancePerGem
            this.segmentTotalPieceScore = 0
            this.segmentTotalPiece = 0
            this.listPieceMap = []

            this.buildObjectPieces()
        }

        console.log('listttttttt ', this.listPieceMap)
    }

    private buildObjectPieces(): void {
        while (this.checkAverageScore()) {
            this.buildObjectPiece()
        }
    }

    private checkAverageScore(): boolean {
        if (this.segmentTotalPiece === 0 || this.segmentTotalPieceScore === 0) return true

        if (this.segmentTotalPiece > Match.PieceRandoms.maxPiece) return false

        if (
            this.segmentTotalPieceScore / this.segmentTotalPiece <=
                this.segmentAvgScore + Match.PieceRandoms.measureError &&
            this.segmentTotalPieceScore / this.segmentTotalPiece >=
                this.segmentAvgScore - Match.PieceRandoms.measureError &&
            this.segmentTotalPieceScore >= this.segmentTotalScore
        ) {
            return false
        }

        return true
    }

    private buildObjectPiece(): void {
        const piece = this.getPieceByAvgScore()

        if (!piece) return

        if (!this.checkPieceMaxAmountConfig(piece)) {
            this.buildObjectPiece()

            return
        }

        // Random gem for piece
        let fenPiece = ''

        if (Math.floor((this.segmentTotalPiece - 1) / 3) % this.segmentPieceDistancePerGem === 0) {
            const random = Phaser.Math.Between(0, 1)

            if ((this.segmentTotalPiece - 1) % 3 === 0 && this.segmentPieceDistancePerGem === 1) {
                this.segmentPieceRandomGem = false
            }

            if (
                (random && !this.segmentPieceRandomGem) ||
                (!this.segmentPieceRandomGem && this.segmentTotalPiece % 3 === 2)
            ) {
                const dataPieceRandom = this.getRandomPieceData(piece.data)

                if (dataPieceRandom) {
                    piece.updateDataPiece(dataPieceRandom)

                    fenPiece = this.getFenDataPiece(piece)
                }

                this.segmentPieceRandomGem = true
            }
        } else {
            this.segmentPieceRandomGem = false
        }

        this.listPieceMap.push({
            type: piece.type,
            direction: piece.direction,
            isReverse: piece.isReverse,
            fenPiece,
        })
    }

    private checkPieceMaxAmountConfig(piece: Piece): boolean {
        const scorePiece = piece.getScore()

        switch (scorePiece) {
            case 1:
                if (this.segmentAmountPiece1Max <= this.segmentAmountPiece1Cur) return false

                this.segmentAmountPiece1Cur++
                break

            case 5:
                if (this.segmentAmountPiece5Max <= this.segmentAmountPiece5Cur) return false

                this.segmentAmountPiece5Cur++
                break
        }

        this.segmentTotalPiece++
        this.segmentTotalPieceScore += scorePiece

        return true
    }

    private getPieceByAvgScore(): Piece | null {
        if (this.segmentTotalPieceScore < this.segmentTotalScore) {
            const pieceRates = this.buildPieceRates(false)
            const indexPieceRates = Math.floor(Math.random() * pieceRates.length)
            const groupName = pieceRates[indexPieceRates]

            if (!this.allPiecesGroup[groupName]) return null

            const index = Math.floor(Math.random() * this.allPiecesGroup[groupName].length)
            const position = this.allPiecesGroup[groupName][index]

            return this.allPieces[position].piece
        }

        if (this.segmentTotalPieceScore / this.segmentTotalPiece <= this.segmentAvgScore) {
            const pieces = this.allPieces.filter((i) => {
                return i.piece.getScore() <= this.segmentAvgScore
            })

            if (!pieces || pieces.length === 0) return null

            const index = Phaser.Math.Between(0, pieces.length - 1)

            return pieces[index].piece
        }

        if (this.segmentTotalPieceScore / this.segmentTotalPiece > this.segmentAvgScore) {
            const pieces = this.allPieces.filter((i) => {
                return i.piece.getScore() > this.segmentAvgScore
            })

            if (!pieces || pieces.length === 0) return null

            const index = Phaser.Math.Between(0, pieces.length - 1)

            return pieces[index].piece
        }

        return null
    }

    public debuggerNextPieces(): void {
        for (let i = 0; i < this.piecesActive.length; i++) {
            this.removeActivePiece(i)
        }

        for (let i = 0; i < this.allPieces.length; i++) {
            this.allPieces[i].piece.wrapPiece.setVisible(false)
        }

        this.showNewPieces()
    }

    private addDebuggerBtnRandomPieces(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return

        const positon = [80, 375 / 2, 295]
        const { height } = this.scene.gameZone

        for (let i = 0; i < 3; i++) {
            const btn = new Button(this.scene, KEY, FRAME.GEM, 50, 30)

            this.add(btn)

            btn.onClick = () => {
                this.debuggerNewPieces(i)
            }

            btn.setPosition(positon[i], height)
        }
    }

    private debuggerNewPieces(index: number): void {
        this.removeActivePiece(index)

        const activePiece = this.piecesActive[index]
        const { piece: pieceItem } = this.allPieces[activePiece.position]

        pieceItem.setVisible(false)

        const newIndex = Phaser.Math.Between(0, this.allPieces.length - 1)

        this.piecesActive[index] = {
            position: newIndex,
            texture: KEY,
            frame: FRAME.GEM,
            type: pieceItem.type,
            direction: pieceItem.direction,
            isReverse: pieceItem.isReverse,
        }

        const { position, fenPiece } = this.piecesActive[index]
        const { piece } = this.allPieces[position]
        const { x, y } = this.positionPiece[index]

        if (fenPiece) {
            const dataPiece = this.convertFenPiecesToData(fenPiece)

            if (dataPiece) {
                piece.updateDataPiece(dataPiece)
            }
        } else {
            if (this.listPieceMap.length === 0) {
                const pieceContainGem = this.isPieceContainGem()

                if (pieceContainGem) {
                    const dataPieceRandom = this.getRandomPieceData(piece.data)

                    if (dataPieceRandom) {
                        piece.updateDataPiece(dataPieceRandom)
                    }
                }
            }
        }

        piece.updatePosition(x, y)
        piece.setIndex(index)
        piece.drawPiece()
    }
}
