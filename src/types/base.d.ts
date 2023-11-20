type unused = unknown
type TObject = Record<string | number | symbol, string | unknown>

declare type TPosition = {
    x: number
    y: number
}

declare type TTransformMatrix = {
    translateX: number
    translateY: number
}

declare type NoOptionals<T> = {
    [P in keyof T]-?: T[P]
}

declare type DeepNoOptionals<T> = {
    [P in keyof T]-?: DeepNoOptionals<T[P]>
}

declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
}

// override type T exclude  K
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

// override type T with U
declare type Override<T, U> = Omit<T, keyof U> & U
