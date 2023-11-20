import Cell from '@/game/scenes/game-scene/common/Cell'

export interface ISettingItem {
    scene: Phaser.Scene
    x: number
    y: number
    width: number
    height: number
    frameIcon: string
    iconWidth: number
    iconHeight: number
    text: string
}

export interface IFriends {
    scene: Phaser.Scene
    x: number
    y: number
    width: number
    height: number
}

export interface IFriend {
    playerId: string
    name?: string
    photo: string
    score: number
}

export interface IFriendItemScore {
    isTextRandom?: boolean
    color: any
}

export interface IFriendItem {
    scene: Phaser.Scene
    x: number
    y: number
    width: number
    height: number
    scale: number
    frame?: string
    cup?: string
    score?: IFriendItemScore
    id?: number
    isRandom?: boolean
}

export interface IPlayerItem {
    scene: Phaser.Scene
    playerId: string
    name?: string
    photo: string
    score: number
    x?: number
    y?: number
    width?: number
    height?: number
    hasCrown?: boolean
}

export interface IAvatar {
    scene: Phaser.Scene
    playerId?: string
    name?: string
    photo?: string
    x?: number
    y?: number
    width: number
    height: number
    frameBorder?: string
    frameAvatar?: string
}

export interface IAvatarImage {
    name?: string
    texture: string
    url: string
    depth?: number
}

export interface IPlayerItemUpdate {
    playerId: string
    photo: string
    score: number
}

export interface IMagnetItem {
    // x: number
    // y: number
    // pX: number
    // pY: number
    width: number
    height: number
    // diceSize: number
}

export interface INextDice {
    value: number
}

export interface IDice {
    x: number
    y: number
    texture: string
    width: number
    height: number
    frame?: string
    inputEnabled?: boolean
}

export interface IMatrixDiceData {
    x: number
    y: number
    value: number
}

export interface IPosition {
    x: number
    y: number
}

export interface ICell {
    x: number
    y: number
    width: number
    height: number
    padding?: number
    addToScene?: boolean
    inputEnabled?: boolean
    depth?: number
    isWoodenEffect?: boolean
}

export interface iCellHighlight {
    x: number
    y: number
    frame: string
}

export interface IDicePosition {
    pX: number
    pY: number
}

export interface IBoardValue {
    value: number
    frame: string
}

export interface IBoardData {
    x: number
    y: number
    value: number
    width: number
    height: number
    frame: string
    cell: Cell
}

export interface IBoardFen {
    value: number
    frame: string
}

export interface IPieceGroup {
    [key: string]: number[]
}

export interface ICaptureCell {
    x: number
    y: number
    frame: string
}

export interface IXY {
    x: number
    y: number
}
