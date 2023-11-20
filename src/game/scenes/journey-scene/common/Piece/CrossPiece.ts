import Piece from './Piece'
import {
    CROSS_PIECE_LEFT_2_DATA,
    CROSS_PIECE_RIGHT_2_DATA,
    CROSS_PIECE_LEFT_3_DATA,
    CROSS_PIECE_RIGHT_3_DATA,
    CROSS_PIECE_2_TYPE,
    CROSS_PIECE_3_TYPE,
    CROSS_PIECE_LEFT_5_DATA,
    CROSS_PIECE_RIGHT_5_DATA,
    CROSS_PIECE_LEFT_4_DATA,
    CROSS_PIECE_RIGHT_4_DATA,
    CROSS_PIECE_4_TYPE,
    CROSS_PIECE_5_TYPE,
    LEFT,
    RIGHT,
} from '../../constant/piece'
import { ITrianglePiece } from '../../constant/types'
import GameScene from '../../JourneyScene'
import Pieces from '../../footer/Pieces'

class CrossPiece extends Piece {
    constructor(scene: GameScene, parent: Pieces, props: ITrianglePiece) {
        super(scene, parent, {
            ...props,
            matrixData: CrossPiece.getMatrixData(props.type, props.direction),
        })
    }

    static getDataByDirectionCross2(direction: string) {
        let data: number[][] = []
        switch (direction) {
            case LEFT: {
                data = CROSS_PIECE_LEFT_2_DATA
                break
            }
            case RIGHT: {
                data = CROSS_PIECE_RIGHT_2_DATA
                break
            }
            default: {
                data = CROSS_PIECE_LEFT_2_DATA
                break
            }
        }
        return data
    }

    static getDataByDirectionCross3(direction: string) {
        let data: number[][] = []
        switch (direction) {
            case LEFT: {
                data = CROSS_PIECE_LEFT_3_DATA
                break
            }
            case RIGHT: {
                data = CROSS_PIECE_RIGHT_3_DATA
                break
            }
            default: {
                data = CROSS_PIECE_LEFT_3_DATA
                break
            }
        }
        return data
    }

    static getDataByDirectionCross4(direction: string) {
        let data: number[][] = []
        switch (direction) {
            case LEFT: {
                data = CROSS_PIECE_LEFT_4_DATA
                break
            }
            case RIGHT: {
                data = CROSS_PIECE_RIGHT_4_DATA
                break
            }
            default: {
                data = CROSS_PIECE_LEFT_4_DATA
                break
            }
        }
        return data
    }

    static getDataByDirectionCross5(direction: string) {
        let data: number[][] = []
        switch (direction) {
            case LEFT: {
                data = CROSS_PIECE_LEFT_5_DATA
                break
            }
            case RIGHT: {
                data = CROSS_PIECE_RIGHT_5_DATA
                break
            }
            default: {
                data = CROSS_PIECE_LEFT_5_DATA
                break
            }
        }
        return data
    }

    static getMatrixData(type: string, direction: string) {
        let data: number[][] = []
        switch (type) {
            case CROSS_PIECE_2_TYPE: {
                data = CrossPiece.getDataByDirectionCross2(direction)
                break
            }
            case CROSS_PIECE_3_TYPE: {
                data = CrossPiece.getDataByDirectionCross3(direction)
                break
            }
            case CROSS_PIECE_4_TYPE: {
                data = CrossPiece.getDataByDirectionCross4(direction)
                break
            }
            case CROSS_PIECE_5_TYPE: {
                data = CrossPiece.getDataByDirectionCross5(direction)
                break
            }
        }

        return data
    }

    static getData(type: string, direction: string) {
        return CrossPiece.buildData(CrossPiece.getMatrixData(type, direction))
    }
}

export default CrossPiece
