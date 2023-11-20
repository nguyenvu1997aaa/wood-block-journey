import Piece from './Piece'
import { T_PIECE_LEFT, T_PIECE_RIGHT, T_PIECE_TOP, T_PIECE_BOTTOM } from '../../constant/piece'
import { ITrianglePiece } from '../../constant/types'
import GameScene from '../../GameScene'
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
            case 'left': {
                data = T_PIECE_LEFT
                break
            }
            case 'right': {
                data = T_PIECE_RIGHT
                break
            }
            case 'top': {
                data = T_PIECE_TOP
                break
            }
            case 'bottom': {
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
