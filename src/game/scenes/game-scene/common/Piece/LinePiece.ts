import {
    LINE_2_HORIZONTAL,
    LINE_2_TYPE,
    LINE_2_VERTICAL,
    LINE_3_HORIZONTAL,
    LINE_3_TYPE,
    LINE_3_VERTICAL,
    LINE_4_HORIZONTAL,
    LINE_4_TYPE,
    LINE_4_VERTICAL,
    LINE_5_HORIZONTAL,
    LINE_5_TYPE,
    LINE_5_VERTICAL,
    VERTICAL,
} from '../../constant/piece'
import { ILinePiece } from '../../constant/types'
import Pieces from '../../footer/Pieces'
import GameScene from '../../GameScene'
import Piece from './Piece'

class LinePiece extends Piece {
    constructor(scene: GameScene, parent: Pieces, props: ILinePiece) {
        super(scene, parent, {
            ...props,
            matrixData: LinePiece.getMatrixData(props.type, props.direction),
        })
    }

    static getMatrixData(type: string, direction: string) {
        let data: number[][] = []
        switch (type) {
            case LINE_5_TYPE: {
                data = direction === VERTICAL ? LINE_5_VERTICAL : LINE_5_HORIZONTAL
                break
            }
            case LINE_4_TYPE: {
                data = direction === VERTICAL ? LINE_4_VERTICAL : LINE_4_HORIZONTAL
                break
            }
            case LINE_2_TYPE: {
                data = direction === VERTICAL ? LINE_2_VERTICAL : LINE_2_HORIZONTAL
                break
            }
            case LINE_3_TYPE: {
                data = direction === VERTICAL ? LINE_3_VERTICAL : LINE_3_HORIZONTAL
                break
            }
            default: {
                break
            }
        }

        return data
    }

    static getData(type: string, direction: string) {
        return LinePiece.buildData(LinePiece.getMatrixData(type, direction))
    }
}

export default LinePiece
