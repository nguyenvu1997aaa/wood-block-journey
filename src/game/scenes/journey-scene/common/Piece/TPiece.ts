import Piece from './Piece'
import {
    T_PIECE_LEFT,
    T_PIECE_RIGHT,
    T_PIECE_TOP,
    T_PIECE_BOTTOM,
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
} from '../../constant/piece'
import { ITrianglePiece } from '../../constant/types'
import GameScene from '../../JourneyScene'
import Pieces from '../../footer/Pieces'

class TPiece extends Piece {
    constructor(scene: GameScene, parent: Pieces, props: ITrianglePiece) {
        super(scene, parent, {
            ...props,
            matrixData: TPiece.getMatrixData(props.direction),
        })
    }

    static getMatrixData(direction: string) {
        let data: number[][] = []
        switch (direction) {
            case LEFT: {
                data = T_PIECE_LEFT
                break
            }
            case RIGHT: {
                data = T_PIECE_RIGHT
                break
            }
            case TOP: {
                data = T_PIECE_TOP
                break
            }
            case BOTTOM: {
                data = T_PIECE_BOTTOM
                break
            }
            default: {
                data = T_PIECE_LEFT
                break
            }
        }
        return data
    }

    static getData(direction: string) {
        return TPiece.buildData(TPiece.getMatrixData(direction))
    }
}

export default TPiece
