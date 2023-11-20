import SPRITES, { demoEffect } from '@/game/constants/resources/sprites'

const { KEY, FRAME: Demo } = SPRITES.EFFECTS

const FRAME = Demo as demoEffect

const ANIMATIONS = {
    CONFETTI_HEXAGON: {
        KEY: 'confetti-hexagon-animation',
        TEXTURE: KEY,
        PREFIX: FRAME.FX_CONFETTI_HEXAGON,
        FRAME_RATE: 8,
        END: 5,
        ZERO_PAD: 0,
    },
    CONFETTI_STAR_X: {
        KEY: 'confetti-star-x',
        TEXTURE: KEY,
        PREFIX: FRAME.ANIMATION_STAR_X,
        FRAME_RATE: 4,
        END: 4,
        ZERO_PAD: 0,
    },
    CONFETTI_STAR_Y: {
        KEY: 'confetti-star-y',
        TEXTURE: KEY,
        PREFIX: FRAME.ANIMATION_STAR_Y,
        FRAME_RATE: 4,
        END: 4,
        ZERO_PAD: 0,
    },
    RIBBON_A: {
        KEY: 'animation-ribbon-a',
        TEXTURE: KEY,
        PREFIX: FRAME.PREFIX_ANIMATION_RIBBON_CONFETTI_A,
        FRAME_RATE: 16,
        END: 3,
        ZERO_PAD: 0,
    },
    RIBBON_B: {
        KEY: 'animation-ribbon-b',
        TEXTURE: KEY,
        PREFIX: FRAME.PREFIX_ANIMATION_RIBBON_CONFETTI_B,
        FRAME_RATE: 16,
        END: 4,
        ZERO_PAD: 0,
    },
    RIBBON_C: {
        KEY: 'animation-ribbon-c',
        TEXTURE: KEY,
        PREFIX: FRAME.PREFIX_ANIMATION_RIBBON_CONFETTI_C,
        FRAME_RATE: 16,
        END: 4,
        ZERO_PAD: 0,
    },
    RIBBON_D: {
        KEY: 'animation-ribbon-d',
        TEXTURE: KEY,
        PREFIX: FRAME.PREFIX_ANIMATION_RIBBON_CONFETTI_D,
        FRAME_RATE: 16,
        END: 4,
        ZERO_PAD: 0,
    },
}

export default ANIMATIONS
