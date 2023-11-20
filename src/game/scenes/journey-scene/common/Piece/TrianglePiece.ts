import Piece from './Piece'
import {
    TRIANGLE_LEFT,
    TRIANGLE_RIGHT,
    TRIANGLE_TOP,
    TRIANGLE_BOTTOM,
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
} from '../../constant/piece'
import { ITrianglePiece } from '../../constant/types'
import GameScene from '../../JourneyScene'
import Pieces from '../../footer/Pieces'

class TrianglePiece extends Piece {
    constructor(scene: GameScene, parent: Pieces, props: ITrianglePiece) {
        super(scene, parent, {
            ...props,
            matrixData: TrianglePiece.getMatrixData(props.direction),
        })
    }

    static getMatrixData(direction: string) {
        let data: number[][] = []
        switch (direction) {
            case LEFT: {
                data = TRIANGLE_LEFT
                break
            }
            case RIGHT: {
                data = TRIANGLE_RIGHT
                break
            }
            case TOP: {
                data = TRIANGLE_TOP
                break
            }
            case BOTTOM: {
                data = TRIANGLE_BOTTOM
                break
            }
            default: {
                data = TRIANGLE_LEFT
                break
            }
        }
        return data
    }

    static getData(direction: string) {
        return TrianglePiece.buildData(TrianglePiece.getMatrixData(direction))
    }
}

export default TrianglePiece
