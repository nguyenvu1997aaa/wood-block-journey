import {
    BLUE,
    BLUE_2,
    BLUE_3,
    GREEN,
    ORANGE,
    PINK,
    PINK_2,
    RED,
    YELLOW,
    TRANSPARENT,
    L_TYPE,
    L_1_TYPE,
    L_3_TYPE,
    LINE_2_TYPE,
    LINE_3_TYPE,
    LINE_4_TYPE,
    LINE_5_TYPE,
    SQUARE_1_TYPE,
    SQUARE_2_TYPE,
    SQUARE_3_TYPE,
    TRAPEZOID_TYPE,
    TRIANGLE_TYPE,
    TOP,
    LEFT,
    RIGHT,
    BOTTOM,
    VERTICAL,
    HORIZONTAL,
    VERTICAL_LEFT,
    VERTICAL_RIGHT,
    HORIZONTAL_LEFT,
    HORIZONTAL_RIGHT,
    FEN_BLUE,
    FEN_BLUE_2,
    FEN_BLUE_3,
    FEN_GREEN,
    FEN_ORANGE,
    FEN_PINK,
    FEN_PINK_2,
    FEN_RED,
    FEN_YELLOW,
    FEN_L,
    FEN_L_1,
    FEN_L_3,
    FEN_LINE_2,
    FEN_LINE_3,
    FEN_LINE_4,
    FEN_LINE_5,
    FEN_SQUARE_1,
    FEN_SQUARE_2,
    FEN_SQUARE_3,
    FEN_TRAPEZOID,
    FEN_TRIANGLE,
    FEN_TOP,
    FEN_LEFT,
    FEN_RIGHT,
    FEN_BOTTOM,
    FEN_VERTICAL,
    FEN_HORIZONTAL,
    FEN_VERTICAL_LEFT,
    FEN_VERTICAL_RIGHT,
    FEN_HORIZONTAL_LEFT,
    FEN_HORIZONTAL_RIGHT,
    CENTER,
} from '../../../constant/piece'
import { ICanCaptureLines } from '../../../constant/types'

const { cols = 8, rows = 8 } = GameCore.Configs.Board

/**
 * Check can capture lines 4 or 5
 * @param board
 * @param minLine
 */
export const canCaptureLines = (board: any, minLine = 5): ICanCaptureLines => {
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
                if (statsCol[x].count === rows - 1) colsCanCapture.push({ col: x, ...statsCol[x] })
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

let amountCombo = 0
export const getAmountCombo = () => {
    return amountCombo
}
/**
 * Get cells is capture in board.
 * @param board
 */
export const getCaptureCells = (board: any[], cellHighlight: any[]) => {
    amountCombo = 0
    // 1.
    const captureCells: any[] = []

    // 2. check via horizontal
    const rows = board.length
    const cols = board[0].length

    const rowsCanCapture = []
    const colsCanCapture = []

    for (let y = 0; y < rows; y++) {
        let isCaptureLine = true

        // 2.2 check is capture line
        for (let x = 0; x < cols; x++) {
            if (board[y][x].value === 0) isCaptureLine = false
        }

        // 2.3 add cells to list capture
        if (isCaptureLine) {
            rowsCanCapture.push(y)

            for (let x = 0; x < cols; x++) {
                if (!captureCells.some((item) => item.x === x && item.y === y)) {
                    captureCells.push({ x, y })
                }
            }
        }
    }

    // 3. check via vertical
    for (let x = 0; x < cols; x++) {
        let isCaptureLine = true

        // 3.2 check is capture line
        for (let y = 0; y < rows; y++) {
            if (board[y][x].value === 0) isCaptureLine = false
        }

        // 3.3 add cells to list capture
        if (isCaptureLine) {
            colsCanCapture.push(x)

            for (let y = 0; y < rows; y++) {
                if (!captureCells.some((item) => item.x === x && item.y === y)) {
                    captureCells.push({ x, y })
                }
            }
        }
    }

    const captureCells3x3 = getCaptureCells3x3(board, cellHighlight)

    if (captureCells3x3 && captureCells3x3.length > 0) {
        for (let i = 0; i < captureCells3x3.length; i++) {
            const { x, y } = captureCells3x3[i]
            if (!captureCells.some((item) => item.x === x && item.y === y)) {
                captureCells.push({
                    x,
                    y,
                })
            }
        }
    }

    amountCombo += rowsCanCapture.length
    amountCombo += colsCanCapture.length
    amountCombo += Math.floor(captureCells3x3.length / 9)

    return captureCells
}

const getArea3x3ByCell = (cellItem: any) => {
    const startX = Math.floor(cellItem.x / 3) * 3
    const startY = Math.floor(cellItem.y / 3) * 3

    return {
        x: startX,
        y: startY,
    }
}

const getArea3x3ByCellHighlights = (cellHighlight: any[]) => {
    const areas = []

    for (let i = 0; i < cellHighlight.length; i++) {
        const cellHighlightRow = cellHighlight[i]
        const area = getArea3x3ByCell(cellHighlightRow)

        if (!exitsArray(areas, area)) {
            areas.push(area)
        }
    }

    return areas
}

const exitsArray = (list: { x: number; y: number }[], item: { x: number; y: number }): boolean => {
    if (list.length === 0) return false

    const filter = list.filter((i) => {
        return i.x === item.x && i.y === item.y
    })

    if (!filter || filter.length <= 0) return false

    return true
}

const getCaptureCellInArea = (board: any[], area: { x: number; y: number }) => {
    const { x, y } = area
    const captureCells = []

    for (let i = x; i < x + 3; i++) {
        for (let j = y; j < y + 3; j++) {
            const data = board[j][i]
            if (data.value === 0) return []

            captureCells.push({
                x: i,
                y: j,
            })
        }
    }

    return captureCells
}

/**
 * Get cells is capture in board.
 * @param board
 */
export const getCaptureCells3x3 = (board: any[], cellHighlight: any[]) => {
    const captureCells: any[] = []
    const areas = getArea3x3ByCellHighlights(cellHighlight)

    for (let i = 0; i < areas.length; i++) {
        const area = areas[i]
        const data = getCaptureCellInArea(board, area)

        captureCells.push(...data)
    }

    return captureCells
}

/**
 * Get cells is capture in board.
 * @param board
 */
export const getRowsCaptureCells = (board: any[]) => {
    // 2. check via horizontal
    const rows = board.length
    const cols = board[0].length

    const rowsCanCapture = []

    for (let y = 0; y < rows; y++) {
        let isCaptureLine = true

        // 2.2 check is capture line
        for (let x = 0; x < cols; x++) {
            if (board[y][x].value === 0) isCaptureLine = false
        }

        // 2.3 add cells to list capture
        if (isCaptureLine) {
            rowsCanCapture.push(y)
        }
    }

    return rowsCanCapture
}

/**
 * Get cells is capture in board.
 * @param board
 */
export const getColsCaptureCells = (board: any[]) => {
    const rows = board.length
    const cols = board[0].length

    const colsCanCapture = []

    // 3. check via vertical
    for (let x = 0; x < cols; x++) {
        let isCaptureLine = true

        // 3.2 check is capture line
        for (let y = 0; y < rows; y++) {
            if (board[y][x].value === 0) isCaptureLine = false
        }

        // 3.3 add cells to list capture
        if (isCaptureLine) {
            colsCanCapture.push(x)
        }
    }

    return colsCanCapture
}

/**
 * Check board is game over by list piece.
 * @param board
 * @param pieces
 * @returns {boolean}
 */
export const isGameOver = (board: any[], pieces: any[]): boolean => {
    // 1. get cols and rows
    const rows = board.length
    const cols = board[0].length
    if (pieces.length === 0) return false

    // 2. check can move
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            for (let i = 0; i < pieces.length; i++) {
                if (canMove(board, x, y, pieces[i])) {
                    return false
                }
            }
        }
    }

    return true
}

/**
 * Check piece has move in board
 * @param board
 * @param startX // col position in board
 * @param startY // row position in board
 * @param piece
 */
export const canMove = (board: any[], startX: number, startY: number, piece: any) => {
    let isCanMove = true
    for (let y = 0; y < piece.data.length; y++) {
        for (let x = 0; x < piece.data[y].length; x++) {
            // 1. if cell is no texture then valid
            if (!piece.data[y][x].texture) continue

            // 2. if position not in board then invalid
            if (
                !board[startY + y] ||
                !board[startY + y][startX + x] ||
                board[startY + y][startX + x].value !== 0
            ) {
                isCanMove = false
            }
        }
    }

    return isCanMove
}

/**
 * Check piece can move in board.
 * @param board
 * @param piece
 * @returns {boolean}
 */
export const isPieceMoveInBoard = (board: any[], piece: any): boolean => {
    // 1. get cols and rows
    const rows = board.length
    const cols = board[0].length

    // 2. check can move
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (canMove(board, x, y, piece)) {
                return true
            }
        }
    }
    return false
}

/**
 * Get cells if piece only one position can move.
 * @param board
 * @param piece
 * @returns {object | null}
 */
export const onlyOneMove = (board: any[], piece: any) => {
    // 1. get cols and rows
    const rows = board.length
    const cols = board[0].length

    // 2. check can move
    let countMove = 0
    let pX = 0
    let pY = 0
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (canMove(board, x, y, piece)) {
                pX = x
                pY = y
                countMove++
                if (countMove > 1) return null
            }
        }
    }

    // 2.2 return if can not move
    if (countMove === 0) return null

    // 3. get cells
    const cells = []
    for (let y = 0; y < piece.data.length; y++) {
        for (let x = 0; x < piece.data[y].length; x++) {
            // 1. if cell is no texture then valid
            if (!piece.data[y][x].texture) continue

            cells.push({ x: pX + x, y: pY + y })
        }
    }

    return cells && cells.length > 0 ? cells : null
}

/**
 * Calculate score by fibonacci
 * @param captureCellNumber // number cell is capture
 */
let amountStreak = 0

export const resetAmountStreak = (): void => {
    amountStreak = 0
}

export const increaseStreak = (): void => {
    amountStreak++
}

export const calculateScore = () => {
    increaseStreak()

    return 18 + 10 * (getAmountStreak() - 1)
}

export const calculateScoreCombo = () => {
    return 18 * amountCombo + 10 * (getAmountStreak() - 1)
}

export const getAmountStreak = (): number => {
    return amountStreak + 1
}

/**
 * Get position center in lines capture.
 * @param board
 */
export const getPositionCenterCaptureLine = (board: any) => {
    // 1. calculate position
    let px = -1
    let py = -1
    let direction = null

    // 2. check via horizontal
    const rows = board.length
    const cols = board[0].length
    const linesHorizontal = []
    for (let y = 0; y < rows; y++) {
        let isCaptureLine = true

        // 2.2 check is capture line
        for (let x = 0; x < cols; x++) {
            if (board[y][x].value === 0) {
                isCaptureLine = false
                break
            }
        }

        // 2.3 add cells to list capture
        if (isCaptureLine) {
            linesHorizontal.push(y)
            direction = HORIZONTAL
        }
    }

    // 2.4 calculate px
    if (linesHorizontal && linesHorizontal.length > 0) {
        py = linesHorizontal[Math.floor(linesHorizontal.length / 2)]
        if (px === -1) px = Math.floor(cols / 2)
    }

    // 3. check via vertical
    const linesVertical = []
    for (let x = 0; x < cols; x++) {
        let isCaptureLine = true

        // 3.2 check is capture line
        for (let y = 0; y < rows; y++) {
            if (board[y][x].value === 0) {
                isCaptureLine = false
                break
            }
        }

        // 3.3 add cells to list capture
        if (isCaptureLine) {
            linesVertical.push(x)
            direction = direction === HORIZONTAL ? CENTER : VERTICAL
        }
    }

    // 3.4
    if (linesVertical && linesVertical.length > 0) {
        px = linesVertical[Math.floor(linesVertical.length / 2)]
        if (py === -1) py = Math.floor(rows / 2)
    }

    return { x: px, y: py, direction }
}

export const buildMatrix = (cols: number, rows: number, animationsCells: any[]) => {
    // 1. generate default matrix
    const matrix: any = []
    for (let y = 0; y < rows; y++) {
        matrix[y] = []
        for (let x = 0; x < cols; x++) {
            matrix[y][x] = { value: 0, delay: 0 }
        }
    }

    // 2. set cell has animation
    for (let i = 0; i < animationsCells.length; i++) {
        const { x, y } = animationsCells[i]
        matrix[y][x].value = 1
    }
    return matrix
}

const isCaptureLineHorizontal = (matrix: any[]) => {
    for (let y = 0; y < matrix.length; y++) {
        let count = 0
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x].value === 1) count++
        }
        if (count === matrix[y].length) return true
    }
    return false
}

const isCaptureLineVertical = (matrix: any[]) => {
    for (let x = 0; x < matrix[0].length; x++) {
        let count = 0
        for (let y = 0; y < matrix.length; y++) {
            if (matrix[y][x].value === 1) count++
        }
        if (count === matrix[0].length) return true
    }
    return false
}

/**
 * Build matrix has animation and delay time in every cell.
 * @param cols
 * @param rows
 * @param animationsCells
 * @param positionCenterPiece
 */
export const buildCaptureAnimation = (
    cols: number,
    rows: number,
    animationsCells: any[],
    positionCenterPiece: any
) => {
    // 1. build matrix
    const matrix = buildMatrix(cols, rows, animationsCells)
    const isCaptureHorizontal = isCaptureLineHorizontal(matrix)
    const isCaptureVertical = isCaptureLineVertical(matrix)

    // 2. add animation for rows
    const { x: pX, y: pY } = positionCenterPiece || { x: 0, y: 0 }
    const rowDirection = pX < (cols - 1) / 2 ? 'right' : 'left'
    const colDirection = pY < (rows - 1) / 2 ? 'bottom' : 'top'

    // 2.2 add animation for rows
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (matrix[y][x].value === 1) {
                const delayRow = rowDirection === 'right' ? x * 50 : (cols - 1 - x) * 50
                const delayCol = colDirection === 'bottom' ? y * 50 : (rows - 1 - y) * 50
                if (isCaptureHorizontal && isCaptureVertical) {
                    matrix[y][x].delay = Math.max(delayCol, delayRow, 0)
                } else if (isCaptureHorizontal) {
                    matrix[y][x].delay = Math.max(delayRow, 0)
                } else if (isCaptureVertical) {
                    matrix[y][x].delay = Math.max(delayCol, 0)
                }
            }
        }
    }

    return matrix
}

export const getFenCharacterByCode = (code: string) => {
    let character = code
    switch (code) {
        case BLUE: {
            character = FEN_BLUE
            break
        }
        case BLUE_2: {
            character = FEN_BLUE_2
            break
        }
        case BLUE_3: {
            character = FEN_BLUE_3
            break
        }
        case GREEN: {
            character = FEN_GREEN
            break
        }
        case ORANGE: {
            character = FEN_ORANGE
            break
        }
        case PINK: {
            character = FEN_PINK
            break
        }
        case PINK_2: {
            character = FEN_PINK_2
            break
        }
        case RED: {
            character = FEN_RED
            break
        }
        case YELLOW: {
            character = FEN_YELLOW
            break
        }
        case L_TYPE: {
            character = FEN_L
            break
        }
        case L_1_TYPE: {
            character = FEN_L_1
            break
        }
        case L_3_TYPE: {
            character = FEN_L_3
            break
        }
        case LINE_2_TYPE: {
            character = FEN_LINE_2
            break
        }
        case LINE_3_TYPE: {
            character = FEN_LINE_3
            break
        }
        case LINE_4_TYPE: {
            character = FEN_LINE_4
            break
        }
        case LINE_5_TYPE: {
            character = FEN_LINE_5
            break
        }
        case SQUARE_1_TYPE: {
            character = FEN_SQUARE_1
            break
        }
        case SQUARE_2_TYPE: {
            character = FEN_SQUARE_2
            break
        }
        case SQUARE_3_TYPE: {
            character = FEN_SQUARE_3
            break
        }
        case TRAPEZOID_TYPE: {
            character = FEN_TRAPEZOID
            break
        }
        case TRIANGLE_TYPE: {
            character = FEN_TRIANGLE
            break
        }
        case TOP: {
            character = FEN_TOP
            break
        }
        case LEFT: {
            character = FEN_LEFT
            break
        }
        case RIGHT: {
            character = FEN_RIGHT
            break
        }
        case BOTTOM: {
            character = FEN_BOTTOM
            break
        }
        case VERTICAL: {
            character = FEN_VERTICAL
            break
        }
        case HORIZONTAL: {
            character = FEN_HORIZONTAL
            break
        }
        case VERTICAL_LEFT: {
            character = FEN_VERTICAL_LEFT
            break
        }
        case VERTICAL_RIGHT: {
            character = FEN_VERTICAL_RIGHT
            break
        }
        case HORIZONTAL_LEFT: {
            character = FEN_HORIZONTAL_LEFT
            break
        }
        case HORIZONTAL_RIGHT: {
            character = FEN_HORIZONTAL_RIGHT
            break
        }
    }
    return character
}

export const getCodeByFenCharacter = (fenCharacter: string) => {
    let code = fenCharacter
    switch (fenCharacter) {
        case FEN_BLUE: {
            code = BLUE
            break
        }
        case FEN_BLUE_2: {
            code = BLUE_2
            break
        }
        case FEN_BLUE_3: {
            code = BLUE_3
            break
        }
        case FEN_GREEN: {
            code = GREEN
            break
        }
        case FEN_ORANGE: {
            code = ORANGE
            break
        }
        case FEN_PINK: {
            code = PINK
            break
        }
        case FEN_PINK_2: {
            code = PINK_2
            break
        }
        case FEN_RED: {
            code = RED
            break
        }
        case FEN_YELLOW: {
            code = YELLOW
            break
        }
        case FEN_L: {
            code = L_TYPE
            break
        }
        case FEN_L_1: {
            code = L_1_TYPE
            break
        }
        case FEN_L_3: {
            code = L_3_TYPE
            break
        }
        case FEN_LINE_2: {
            code = LINE_2_TYPE
            break
        }
        case FEN_LINE_3: {
            code = LINE_3_TYPE
            break
        }
        case FEN_LINE_4: {
            code = LINE_4_TYPE
            break
        }
        case FEN_LINE_5: {
            code = LINE_5_TYPE
            break
        }
        case FEN_SQUARE_1: {
            code = SQUARE_1_TYPE
            break
        }
        case FEN_SQUARE_2: {
            code = SQUARE_2_TYPE
            break
        }
        case FEN_SQUARE_3: {
            code = SQUARE_3_TYPE
            break
        }
        case FEN_TRAPEZOID: {
            code = TRAPEZOID_TYPE
            break
        }
        case FEN_TRIANGLE: {
            code = TRIANGLE_TYPE
            break
        }
        case FEN_TOP: {
            code = TOP
            break
        }
        case FEN_LEFT: {
            code = LEFT
            break
        }
        case FEN_RIGHT: {
            code = RIGHT
            break
        }
        case FEN_BOTTOM: {
            code = BOTTOM
            break
        }
        case FEN_VERTICAL: {
            code = VERTICAL
            break
        }
        case FEN_HORIZONTAL: {
            code = HORIZONTAL
            break
        }
        case FEN_VERTICAL_LEFT: {
            code = VERTICAL_LEFT
            break
        }
        case FEN_VERTICAL_RIGHT: {
            code = VERTICAL_RIGHT
            break
        }
        case FEN_HORIZONTAL_LEFT: {
            code = HORIZONTAL_LEFT
            break
        }
        case FEN_HORIZONTAL_RIGHT: {
            code = HORIZONTAL_RIGHT
            break
        }
    }
    return code
}

/**
 * Build fen by board and pieces active.
 * @param board
 * @param pieces
 */
export const getFenByBoard = (board: any, pieces: any): string => {
    // 1. build board position
    let fenBoard = ''
    for (let y = 0; y < board.length; y++) {
        let countGray = 0
        let row = ''
        for (let x = 0; x < board[y].length; x++) {
            // 1.2 if position value = 0
            if (board[y][x].value === 0) countGray++

            // 1.3 value = 1
            if (board[y][x].value === 1) {
                if (countGray > 0) {
                    row += countGray >= rows ? 'x' : `${countGray}`
                    countGray = 0
                }
                const character = getFenCharacterByCode(board[y][x].frame)
                row += `${character}`
            }

            // 1.4
            if (x === board[y].length - 1 && countGray > 0)
                row += countGray >= rows ? 'x' : `${countGray}`
        }

        // 1.5 end row
        fenBoard += y === board.length - 1 ? `${row}` : `${row}/`
    }

    // 2. build pieces
    let fenPieces = 'l'
    for (let i = 0; i < pieces.length; i++) {
        const { type, direction, isReverse, frame } = pieces[i]
        let name = getFenCharacterByCode(type)
        if (direction && direction !== '') name += `-${getFenCharacterByCode(direction)}`
        if (isReverse) name += `-r`
        fenPieces += ` ${name},${getFenCharacterByCode(frame)}`
    }
    return `${fenBoard} ${fenPieces}`
}

export const decodeRowByString = (str: string) => {
    const data = []
    const numberStr = '12345678x'
    const tmp = str.split('')
    for (let i = 0; i < tmp.length; i++) {
        if (numberStr.indexOf(tmp[i]) >= 0) {
            const count = tmp[i] === 'x' ? rows : Number(tmp[i])
            for (let j = 0; j < count; j++) {
                data.push({ value: 0, frame: TRANSPARENT })
            }
        } else {
            data.push({ value: 1, frame: getCodeByFenCharacter(tmp[i]) })
        }
    }
    return data
}

export const decodePiece = (str: string) => {
    const tmp = str.split(',')
    const tmp1 = tmp[0].split('-')
    if (tmp1.length <= 0) throw new Error('Invalid piece')
    const type = getCodeByFenCharacter(tmp1[0])
    const direction = getCodeByFenCharacter(tmp1[1]) || null
    const isReverse = (tmp1[2] && tmp1[2] === 'r') || false
    return { type, direction, isReverse, frame: getCodeByFenCharacter(tmp[1]) }
}

/**
 * Get board data by fen (board, pieces).
 * @param fen
 */
export const getBoardByFen = (fen: string) => {
    // 1. decode fen
    const board: any = []
    const pieces: any = []
    const tmp = fen.split(' ')
    if (tmp.length < 2) throw new Error('Invalid fen')
    const fenBoard = tmp[0]
    const fenPieces = tmp.splice(2)

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

    // 3. get pieces
    for (let i = 0; i < fenPieces.length; i++) {
        // 3.1
        if (fenPieces[i].trim() === 'l') continue

        // 3.2 decode piece
        const data = decodePiece(fenPieces[i].trim())
        pieces.push(data)
    }

    return { board, pieces }
}
