import Piece from './Piece'
import {
    U_PIECE_LEFT,
    U_PIECE_RIGHT,
    U_PIECE_TOP,
    U_PIECE_BOTTOM,
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
} from '../../constant/piece'
import { ITrianglePiece } from '../../constant/types'
import GameScene from '../../JourneyScene'
import Pieces from '../../footer/Pieces'

class UPiece extends Piece {
    constructor(scene: GameScene, parent: Pieces, props: ITrianglePiece) {
        super(scene, parent, {
            ...props,
            matrixData: UPiece.getMatrixData(props.direction),
        })
    }

    static getMatrixData(direction: string) {
        let data: number[][] = []
        switch (direction) {
            case LEFT: {
                data = U_PIECE_LEFT
                break
            }
            case RIGHT: {
                data = U_PIECE_RIGHT
                break
            }
            case TOP: {
                data = U_PIECE_TOP
                break
            }
            case BOTTOM: {
                data = U_PIECE_BOTTOM
                break
            }
            default: {
                data = U_PIECE_LEFT
                break
            }
        }
        return data
    }

    static getData(direction: string) {
        return UPiece.buildData(UPiece.getMatrixData(direction))
    }
}

export default UPiece
