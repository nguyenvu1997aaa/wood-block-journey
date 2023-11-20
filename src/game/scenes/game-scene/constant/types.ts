import Cell from '../common/Cell'

export interface ILinePiece {
    type: string
    direction: string //'vertical' | 'horizontal'
    isReverse: boolean
    x: number
    y: number
    width: number
    height: number
    texture: string
    frame: string
}

export interface ISquarePiece {
    type: string
    x: number
    y: number
    width: number
    height: number
    texture: string
    frame: string
}

export interface ITrapezoidPiece {
    type: string
    direction: string //'vertical_right' | 'vertical_left' | 'horizontal_right' | 'horizontal_left'
    x: number
    y: number
    width: number
    height: number
    texture: string
    frame: string
}

export interface ITrianglePiece {
    type: string
    direction: string //'left' | 'right' | 'top' | 'bottom'
    x: number
    y: number
    width: number
    height: number
    texture: string
    frame: string
}

export interface ICanCaptureLines {
    isCapture: boolean
    direction: string
    minLine: number
}

export interface IPiece {
    type: string
    position?: number

    direction?: string
    matrixData?: Array<Array<number>>

    x?: number
    y?: number
    width?: number
    height?: number
    texture?: string
    frame?: string

    maxHeight?: number
    parentHeight?: number
    cellLength?: number
    wrap?: IWrapPiece
    isReverse?: boolean
}

export interface IWrapPiece {
    x: number
    y: number
    width: number
    height: number
}

export interface IAnimationCanCaptureCell {
    duration: number
    maxAngle: number
    angleAdded: number
    direction?: 'top' | 'bottom'
}

export interface ICanCaptureCell {
    direction: string
    angle: number
}

export interface IPieceCells {
    x: number
    y: number
    cell: Cell
}
