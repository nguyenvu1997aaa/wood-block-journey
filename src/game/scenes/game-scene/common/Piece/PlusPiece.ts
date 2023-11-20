import Piece from './Piece'
import { ITrianglePiece } from '../../constant/types'
import GameScene from '../../GameScene'
import Pieces from '../../footer/Pieces'
import { PLUS_PIECE_DATA } from '../../constant/piece'

class PlusPiece extends Piece {
    constructor(scene: GameScene, parent: Pieces, props: ITrianglePiece) {
        super(scene, parent, {
            ...props,
            matrixData: PlusPiece.getMatrixData(),
        })
    }

    static getMatrixData() {
        return PLUS_PIECE_DATA
    }

    static getData() {
        return PlusPiece.buildData(PlusPiece.getMatrixData())
    }
}

export default PlusPiece
