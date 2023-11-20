import {
    BOTTOM,
    LEFT,
    L_1_BOTTOM,
    L_1_LEFT,
    L_1_RIGHT,
    L_1_TOP,
    L_1_TYPE,
    L_3_BOTTOM,
    L_3_LEFT,
    L_3_RIGHT,
    L_3_TOP,
    L_3_TYPE,
    L_BOTTOM,
    L_BOTTOM_REVERSE,
    L_LEFT,
    L_LEFT_REVERSE,
    L_RIGHT,
    L_RIGHT_REVERSE,
    L_TOP,
    L_TOP_REVERSE,
    RIGHT,
    TOP,
} from '../../constant/piece'
import { ILinePiece } from '../../constant/types'
import Pieces from '../../footer/Pieces'
import GameScene from '../../JourneyScene'
import Piece from './Piece'

class LPiece extends Piece {
    constructor(scene: GameScene, parent: Pieces, props: ILinePiece) {
        super(scene, parent, {
            ...props,
            matrixData: LPiece.getMatrixData(props.type, props.direction, props.isReverse),
        })
    }

    static getMatrixData(type: string, direction: string, isReverse = false) {
        let data: number[][] = []
        switch (direction) {
            case LEFT: {
                if (isReverse) {
                    data = L_LEFT_REVERSE
                } else {
                    data = L_LEFT
                    if (type === L_1_TYPE) data = L_1_LEFT
                    if (type === L_3_TYPE) data = L_3_LEFT
                }
                break
            }
            case RIGHT: {
                if (isReverse) {
                    data = L_RIGHT_REVERSE
                } else {
                    data = L_RIGHT
                    if (type === L_1_TYPE) data = L_1_RIGHT
                    if (type === L_3_TYPE) data = L_3_RIGHT
                }
                break
            }
            case TOP: {
                if (isReverse) {
                    data = L_TOP_REVERSE
                    break
                }

                data = L_TOP
                if (type === L_1_TYPE) data = L_1_TOP
                if (type === L_3_TYPE) data = L_3_TOP
                break
            }
            case BOTTOM: {
                if (isReverse) {
                    data = L_BOTTOM_REVERSE
                } else {
                    data = L_BOTTOM
                    if (type === L_1_TYPE) data = L_1_BOTTOM
                    if (type === L_3_TYPE) data = L_3_BOTTOM
                }
                break
            }
            default: {
                break
            }
        }
        return data
    }

    static getData(type: string, direction: string, isReverse = false) {
        return LPiece.buildData(LPiece.getMatrixData(type, direction, isReverse))
    }
}

export default LPiece
