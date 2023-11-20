import Piece from './Piece'
import { TRIANGLE_LEFT, TRIANGLE_RIGHT, TRIANGLE_TOP, TRIANGLE_BOTTOM } from '../../constant/piece'
import { ITrianglePiece } from '../../constant/types'
import GameScene from '../../GameScene'
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
            case 'left': {
                data = TRIANGLE_LEFT
                break
            }
            case 'right': {
                data = TRIANGLE_RIGHT
                break
            }
            case 'top': {
                data = TRIANGLE_TOP
                break
            }
            case 'bottom': {
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
