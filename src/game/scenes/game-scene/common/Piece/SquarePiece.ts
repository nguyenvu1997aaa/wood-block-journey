import Piece from './Piece'
import {
    SQUARE_1_TYPE,
    SQUARE_2_TYPE,
    SQUARE_3_TYPE,
    SQUARE_1,
    SQUARE_2,
    SQUARE_3,
} from '../../constant/piece'
import GameScene from '../../GameScene'
import { ISquarePiece } from '../../constant/types'
import Pieces from '../../footer/Pieces'

class SquarePiece extends Piece {
    constructor(scene: GameScene, parent: Pieces, props: ISquarePiece) {
        super(scene, parent, {
            ...props,
            matrixData: SquarePiece.getMatrixData(props.type),
        })
    }

    static getMatrixData(type: string) {
        let data: number[][] = []
        switch (type) {
            case SQUARE_1_TYPE: {
                data = SQUARE_1
                break
            }
            case SQUARE_2_TYPE: {
                data = SQUARE_2
                break
            }
            case SQUARE_3_TYPE: {
                data = SQUARE_3
                break
            }
            default: {
                break
            }
        }
        return data
    }

    static getData(type: string) {
        return SquarePiece.buildData(SquarePiece.getMatrixData(type))
    }
}

export default SquarePiece
