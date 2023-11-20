import Piece from './Piece'
import {
    TRAPEZOID_VERTICAL_LEFT,
    TRAPEZOID_VERTICAL_RIGHT,
    TRAPEZOID_HORIZONTAL_LEFT,
    TRAPEZOID_HORIZONTAL_RIGHT,
    HORIZONTAL_RIGHT,
    VERTICAL_LEFT,
    HORIZONTAL_LEFT,
    VERTICAL_RIGHT,
} from '../../constant/piece'
import GameScene from '../../JourneyScene'
import { ITrapezoidPiece } from '../../constant/types'
import Pieces from '../../footer/Pieces'

class TrapezoidPiece extends Piece {
    constructor(scene: GameScene, parent: Pieces, props: ITrapezoidPiece) {
        super(scene, parent, {
            ...props,
            matrixData: TrapezoidPiece.getMatrixData(props.direction),
        })
    }

    static getMatrixData(direction: string) {
        let data: number[][] = []
        switch (direction) {
            case VERTICAL_LEFT: {
                data = TRAPEZOID_VERTICAL_LEFT
                break
            }
            case VERTICAL_RIGHT: {
                data = TRAPEZOID_VERTICAL_RIGHT
                break
            }
            case HORIZONTAL_RIGHT: {
                data = TRAPEZOID_HORIZONTAL_RIGHT
                break
            }
            case HORIZONTAL_LEFT: {
                data = TRAPEZOID_HORIZONTAL_LEFT
                break
            }
            default: {
                data = TRAPEZOID_VERTICAL_LEFT
                break
            }
        }
        return data
    }

    static getData(direction: string) {
        return TrapezoidPiece.buildData(TrapezoidPiece.getMatrixData(direction))
    }
}

export default TrapezoidPiece
