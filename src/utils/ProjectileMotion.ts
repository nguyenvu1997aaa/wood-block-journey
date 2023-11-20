const { sin, cos } = Math

/**
 * Get x Coordinate
 * @param v0
 * @param alpha
 * @returns
 */
export const xCoord = (v0: number, alpha: number, t: number) => {
    return v0 * cos(alpha) * t
}

/**
 * Get y Coordinate
 *
 * @param v0
 * @param alpha
 * @param t
 * @param g
 */
export const yCoord = (v0: number, alpha: number, t: number, g = 10) => {
    return v0 * sin(alpha) * t - (1 / 2) * g * t ** 2
}

/**
 * Get Max Height
 *
 * @param v0
 * @param alpha
 * @param g
 * @returns
 */
export const maxH = (v0: number, alpha: number, g = 10) => {
    return (v0 ** 2 * sin(alpha) ** 2) / (2 * g)
}
