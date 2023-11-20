import Piece from './Piece'
import { U_PIECE_LEFT, U_PIECE_RIGHT, U_PIECE_TOP, U_PIECE_BOTTOM } from '../../constant/piece'
import { ITrianglePiece } from '../../constant/types'
import GameScene from '../../GameScene'
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
            case 'left': {
                data = U_PIECE_LEFT
                break
            }
            case 'right': {
                data = U_PIECE_RIGHT
                break
            }
            case 'top': {
                data = U_PIECE_TOP
                break
            }
            case 'bottom': {
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
