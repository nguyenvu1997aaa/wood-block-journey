import LPiece from './LPiece'
import LinePiece from './LinePiece'
import SquarePiece from './SquarePiece'
import TrianglePiece from './TrianglePiece'
import TrapezoidPiece from './TrapezoidPiece'
import TPiece from './TPiece'

import {
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
    TRIANGLE_TYPE,
    TRAPEZOID_TYPE,
    T_PIECE,
    PLUS_PIECE,
    CROSS_PIECE_2,
    CROSS_PIECE_3,
    CROSS_PIECE_4,
    CROSS_PIECE_5,
    U_PIECE,
} from '../../constant/piece'
import GameScene from '../../GameScene'
import { ILinePiece } from '../../constant/types'
import Pieces from '../../footer/Pieces'
import { CrossPiece, PlusPiece } from '.'
import UPiece from './UPiece'

class PieceFactory {
    static create(scene: GameScene, parent: Pieces, props: ILinePiece) {
        let piece
        const { type } = props
        switch (type) {
            case L_TYPE:
            case L_1_TYPE:
            case L_3_TYPE: {
                piece = new LPiece(scene, parent, props)
                break
            }
            case LINE_2_TYPE:
            case LINE_3_TYPE:
            case LINE_4_TYPE:
            case LINE_5_TYPE: {
                piece = new LinePiece(scene, parent, props)
                break
            }
            case SQUARE_1_TYPE:
            case SQUARE_2_TYPE:
            case SQUARE_3_TYPE: {
                piece = new SquarePiece(scene, parent, props)
                break
            }
            case TRIANGLE_TYPE: {
                piece = new TrianglePiece(scene, parent, props)
                break
            }
            case T_PIECE: {
                piece = new TPiece(scene, parent, props)
                break
            }
            case U_PIECE: {
                piece = new UPiece(scene, parent, props)
                break
            }
            case PLUS_PIECE: {
                piece = new PlusPiece(scene, parent, props)
                break
            }
            case CROSS_PIECE_2:
            case CROSS_PIECE_3:
            case CROSS_PIECE_4:
            case CROSS_PIECE_5: {
                piece = new CrossPiece(scene, parent, props)
                break
            }
            case TRAPEZOID_TYPE: {
                piece = new TrapezoidPiece(scene, parent, props)
                break
            }
            default: {
                piece = new SquarePiece(scene, parent, props)
                break
            }
        }

        return piece
    }
}

export default PieceFactory
