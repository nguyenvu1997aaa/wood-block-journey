import SPRITES from './resources/sprites'

const { FRAME } = SPRITES.GAMEPLAY_32

export const FRAME_BLOCK_GRADIENT_NORMAL: string[] = [
    `${FRAME.BLOCK_GRADIENT_PREFIX}${10}`,
    `${FRAME.BLOCK_GRADIENT_PREFIX}${9}`,
]

export const FRAME_BLOCK_GRADIENT_COMBO: string[] = []

for (let i = 1; i <= 10; i++) {
    FRAME_BLOCK_GRADIENT_COMBO.push(`${FRAME.BLOCK_GRADIENT_PREFIX}${i}`)
}
