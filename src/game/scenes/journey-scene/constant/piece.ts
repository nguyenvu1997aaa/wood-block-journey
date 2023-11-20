import SPRITES from '@/game/constants/resources/sprites'
const { FRAME: FRAME_GAME_PLAY_32 } = SPRITES.GAMEPLAY_32

// Scenes names
export const TEST_SCENE = 'TestScene'
export const BOOT_SCENE = 'BootScene'
export const LOAD_SCENE = 'LoadScene'
export const LOADING_SCENE = 'LoadingScene'
export const DASHBOARD_SCENE = 'DashboardScene'
export const GAME_OVER_SCENE = 'GameOverScene'
export const GAME_SCENE = 'GameScene'
export const PAUSE_SCENE = 'PauseScene'
export const BEST_SCORE_SCENE = 'BestScoreScene'
export const SETTINGS_SCENE = 'SettingsScene'
export const RESULT_MATCH_SCENE = 'ResultMatchScene'
export const LEADERBOARD_SCENE = 'LeaderboardScene'
export const RESCUE_SCENE = 'RescueScene'
export const NOTIFY_SCENE = 'NotifyScene'

// animation name
export const ANIMATION_MOVE = 'animation_move'
export const ANIMATION_CAPTURE = 'animation_capture'
export const ANIMATION_CAN_CAPTURE = 'animation_can_capture'

export const ANIMATION_MOVE_TO = 'animation_move_to'
export const ANIMATION_ZOOM_IN = 'animation_zoom_in'
export const ANIMATION_ZOOM_OUT = 'animation_zoom_out'

// variables
export const BOARD_CONFIG_DATA = 'board_config'
export const BOARD_DATA = 'board'
export const BOARD_CELL_LENGHT_DATA = 'board_cell_length'
export const BOARD_CELL_PADDING_DATA = 'board_cell_padding'
export const PIECES_DATA = 'pieces'
export const MIN_FPS = 18
export const MAX_FPS = 60
export const GUIDE_RUNNING_DATA = 'guide_running'
export const PIECE_DRAGGING_DATA = 'piece_dragging'
export const EFFECT_RUNNING_DATA = 'effect_running'
export const REFRESH_AMOUNT_NAME = 'amount'
export const BOMB_AMOUNT_NAME = 'amount'
export const SCENE_RUNNING = 'scene_running'

// sound name
export const SOUND_MOVE = 'sound_move'
export const SOUND_START_MOVE = 'sound_start_move'
export const SOUND_INVALID_MOVE = 'sound_invalid_move'
export const SOUND_CAPTURE_CELLS = 'sound_capture_cells'

// List fibonacci subtract 2
export const FIBONACCI = [1, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 277, 610, 887]

export const RESCUE_LIST = [
    { minCol: 0, minRow: 0, cols: 4, rows: 4 },
    { minCol: 4, minRow: 0, cols: 4, rows: 4 },
    { minCol: 0, minRow: 4, cols: 4, rows: 4 },
    { minCol: 4, minRow: 4, cols: 4, rows: 4 },
]

export const RESCUE_LIST_L5 = [
    { minCol: 0, minRow: 0, cols: 5, rows: 5 },
    { minCol: 3, minRow: 0, cols: 5, rows: 5 },
    { minCol: 0, minRow: 3, cols: 5, rows: 5 },
    { minCol: 3, minRow: 3, cols: 5, rows: 5 },
]

export const RESCUE_LIST_CROSS_5 = [
    { minCol: 0, minRow: 0, cols: 6, rows: 6 },
    { minCol: 3, minRow: 0, cols: 6, rows: 6 },
    { minCol: 0, minRow: 3, cols: 6, rows: 6 },
    { minCol: 3, minRow: 3, cols: 6, rows: 6 },
]

// depths
export const BG_GAME_DEPTH = -1
export const TEXT_DEPTH = 20
export const ICON_DEPTH = 4
export const TEXT_EFFECT_DEPTH = 4
export const PARTICLE_DEPTH = 5
export const BG_BOARD_DEPTH = 1
export const CELL_DEPTH = 2
export const BG_PIECES_DEPTH = 1
export const PIECE_DEPTH = 4
export const WRAP_PIECE_DEPTH = 5
export const BOMB_DEPTH = 5
export const JEWEL_EFFECT_DEPTH = 10
export const GUIDE_DEPTH = 3

// Direction type
export const CENTER = 'center'
export const VERTICAL = 'vertical'
export const HORIZONTAL = 'horizontal'
export const LEFT = 'left'
export const RIGHT = 'right'
export const TOP = 'top'
export const BOTTOM = 'bottom'
export const VERTICAL_LEFT = 'vertical_left'
export const VERTICAL_RIGHT = 'vertical_right'
export const HORIZONTAL_LEFT = 'horizontal_left'
export const HORIZONTAL_RIGHT = 'horizontal_right'

// Align position
export const ALIGN_CENTER = 'center'
export const ALIGN_BOTTOM_CENTER = 'bottom_center'

// Bitmap Text colors
export const BMT_YELLOW = 0xffc107
export const BMT_BLUE = 0x03a9f4
export const BMT_RED = 0xff5722
export const BMT_SILVER = 0x9e9e9e
export const BMT_PINK_1 = 0xcaa5a7
export const BMT_c2 = 0xffd6d8
export const BMT_PINK = 0xcc9bd1
export const BMT_YELLOW_2 = 0xffe28a
export const BMT_BLUE_2 = 0x4fbfff
export const BMT_RED_2 = 0xf17b5e

// Match modes
export const MATCH_MODE_SINGLE = 'single'
export const MATCH_MODE_CHALLENGE_FRIENDS = 'challenge-friends'
export const MATCH_MODE_TOURNAMENTS = 'tournaments'
export const MATCH_MODE_MATCHING_GROUP = 'matching-group'

// Background types
export const RECTANGLE_BACKGROUND = 'RectangleBackground'

// Fen code
export const BLUE = 'gem/gem'
export const BLUE_2 = 'gem/gem'
export const BLUE_3 = 'gem/gem'
export const GREEN = 'gem/gem'
export const ORANGE = 'gem/gem'
export const PINK = 'gem/gem'
export const PINK_2 = 'gem/gem'
export const RED = 'gem/gem'
export const YELLOW = 'gem/gem'
export const TRANSPARENT = 'gem/gem_transparent'

export const GEM = 'gem/gem'
export const FEN_GEM = 'g'

export const DIAMOND_10 = 'gem/diamond/diamond-10'
export const DIAMOND_11 = 'gem/diamond/diamond-11'
export const DIAMOND_12 = 'gem/diamond/diamond-12'
export const DIAMOND_13 = 'gem/diamond/diamond-13'
export const DIAMOND_14 = 'gem/diamond/diamond-14'
export const DIAMOND_15 = 'gem/diamond/diamond-15'

export const FEN_DIAMOND_10 = 'd10'
export const FEN_DIAMOND_11 = 'd11'
export const FEN_DIAMOND_12 = 'd12'
export const FEN_DIAMOND_13 = 'd13'
export const FEN_DIAMOND_14 = 'd14'
export const FEN_DIAMOND_15 = 'd15'

export const RUBY_20 = 'gem/ruby/ruby-20'

export const FEN_RUBY_20 = 'r20'

export const SAPPHIRE_30 = 'gem/sapphire/sapphire-30'

export const FEN_SAPPHIRE_30 = 's30'

export const FEN_BLUE = 'b'
export const FEN_BLUE_2 = 'c'
export const FEN_BLUE_3 = 'd'
export const FEN_ORANGE = 'o'
export const FEN_GREEN = 'g'
export const FEN_PINK = 'p'
export const FEN_PINK_2 = 'q'
export const FEN_RED = 'r'
export const FEN_YELLOW = 'y'
export const FEN_L = 'l'
export const FEN_L_1 = 'l1'
export const FEN_L_3 = 'l3'
export const FEN_LINE_2 = 'e2'
export const FEN_LINE_3 = 'e3'
export const FEN_LINE_4 = 'e4'
export const FEN_LINE_5 = 'e5'
export const FEN_SQUARE_1 = 's1'
export const FEN_SQUARE_2 = 's2'
export const FEN_SQUARE_3 = 's3'
export const FEN_TRAPEZOID = 'tz'
export const FEN_TRIANGLE = 'ta'
export const FEN_VERTICAL = 'v'
export const FEN_HORIZONTAL = 'h'
export const FEN_LEFT = 'dl'
export const FEN_RIGHT = 'dr'
export const FEN_TOP = 'dt'
export const FEN_BOTTOM = 'db'
export const FEN_VERTICAL_LEFT = 'vl'
export const FEN_VERTICAL_RIGHT = 'vr'
export const FEN_HORIZONTAL_LEFT = 'hl'
export const FEN_HORIZONTAL_RIGHT = 'hr'
export const FEN_PLUS = 'pl'
export const FEN_T_PIECE = 'tp'
export const FEN_CROSS_PIECE_2 = 'cr2'
export const FEN_CROSS_PIECE_3 = 'cr3'
export const FEN_CROSS_PIECE_4 = 'cr4'
export const FEN_CROSS_PIECE_5 = 'cr5'
export const FEN_U_PIECE = 'up'

// Effect and Particle
export const Circle = 'Circle'
export const Ellipse = 'Ellipse'
export const Line = 'Line'
export const Point = 'Point'
export const Polygon = 'Polygon'
export const Rectangle = 'Rectangle'
export const Triangle = 'Triangle'

export const FRAMES_BY_LEVEL = [
    { level: 1, frames: [], width: 480, height: 189 },
    { level: 2, frames: [SPRITES.EFFECTS.FRAME.TEXT_COOL], width: 480, height: 189 },
    { level: 3, frames: [SPRITES.EFFECTS.FRAME.TEXT_GOOD], width: 579, height: 189 },
    { level: 4, frames: [SPRITES.EFFECTS.FRAME.TEXT_EXCELLENT], width: 906, height: 189 },
    { level: 5, frames: [SPRITES.EFFECTS.FRAME.TEXT_EXCELLENT], width: 906, height: 189 },
    { level: 6, frames: [SPRITES.EFFECTS.FRAME.TEXT_EXCELLENT], width: 906, height: 189 },
]

export const EXPLODE_BY_LEVEL = [
    { level: 1, scale: 0.5, speed: 0.5, quantity: 0.5 },
    { level: 2, scale: 0.6, speed: 0.6, quantity: 0.6 },
    { level: 3, scale: 0.7, speed: 0.7, quantity: 0.7 },
    { level: 4, scale: 0.8, speed: 0.8, quantity: 0.8 },
    { level: 5, scale: 0.9, speed: 0.9, quantity: 0.9 },
    { level: 6, scale: 1, speed: 1, quantity: 1 },
]

export const DEFAULT_BOUNCE = {
    scaleStart: 1,
    scales: [
        { scale: -0.1, duration: 50 },
        { scale: 0.2, duration: 200 },
        { scale: -0.1, duration: 50 },
    ],
    resetProperties: {
        resetOrigin: true,
        resetScale: true,
    },
}

export const DEFAULT_TOUCH_UP_DOWN = {
    scaleStart: 1,
    scalesUp: [{ scale: -0.1, duration: 150 }],
    scalesDown: [{ scale: 0.1, duration: 150 }],
    resetProperties: {
        resetOrigin: true,
        resetScale: true,
    },
}

export const POPUP_EFFECT = {
    zoomIn: {
        delay: 0,
        timeZoomIn: 150,
        timeZoomInMedium: 150,
        timeZoomInMediumDelay: 0,
        scaleMedium: 1,
        scale: 1.1,
    },
    zoomOut: {
        delay: 100,
        duration: 150,
        alpha: 1,
    },
}

export const DEFAULT_TYPE_TOUCH_EFFECT = 'click'
export const POINTER_UP_DOWN_TYPE_TOUCH_EFFECT = 'pointer'

// Piece Types
export const L_TYPE = 'l'
export const L_1_TYPE = 'l_1'
export const L_3_TYPE = 'l_3' // cols and rows is 3
export const LINE_2_TYPE = 'line_2'
export const LINE_3_TYPE = 'line_3'
export const LINE_4_TYPE = 'line_4'
export const LINE_5_TYPE = 'line_5'
export const SQUARE_1_TYPE = 'square_1'
export const SQUARE_2_TYPE = 'square_2'
export const SQUARE_3_TYPE = 'square_3' // cols and rows is 3
export const TRAPEZOID_TYPE = 'trapezoid'
export const TRIANGLE_TYPE = 'triangle'
export const T_PIECE_TYPE = 't_piece'
export const PLUS_PIECE_TYPE = 'plus_piece'
export const CROSS_PIECE_2_TYPE = 'cross_piece_2'
export const CROSS_PIECE_3_TYPE = 'cross_piece_3'
export const CROSS_PIECE_4_TYPE = 'cross_piece_4'
export const CROSS_PIECE_5_TYPE = 'cross_piece_5'
export const U_PIECE_TYPE = 'u_piece'

export const PIECE_TYPES = [
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
    T_PIECE_TYPE,
    PLUS_PIECE_TYPE,
    CROSS_PIECE_2_TYPE,
    CROSS_PIECE_3_TYPE,
    CROSS_PIECE_4_TYPE,
    CROSS_PIECE_5_TYPE,
    U_PIECE_TYPE,
]

// Rate
export const PIECE_TYPES_RATE = [
    { type: L_TYPE, rate: 3 },
    { type: L_1_TYPE, rate: 4 },
    { type: L_3_TYPE, rate: 2 },
    { type: LINE_2_TYPE, rate: 16 },
    { type: LINE_3_TYPE, rate: 12 },
    { type: LINE_4_TYPE, rate: 8 },
    { type: LINE_5_TYPE, rate: 4 },
    { type: SQUARE_1_TYPE, rate: 16 },
    { type: SQUARE_2_TYPE, rate: 8 },
    { type: TRIANGLE_TYPE, rate: 4 },
    { type: TRAPEZOID_TYPE, rate: 4 },
    { type: T_PIECE_TYPE, rate: 2 },
    { type: PLUS_PIECE_TYPE, rate: 1 },
    { type: CROSS_PIECE_2_TYPE, rate: 4 },
    { type: CROSS_PIECE_3_TYPE, rate: 2 },
    { type: CROSS_PIECE_4_TYPE, rate: 1 },
    { type: U_PIECE_TYPE, rate: 2 },
]

export const PIECE_RATE_CAPTURE_LINES_5 = 8
export const PIECE_RATE_CAPTURE_LINES_4 = 8

// Tint colors
export const WHITE_TINT = 0xffffff
export const WHITE_2_TINT = 0xeeeeee
export const BLACK_TINT = 0x000000
export const YELLOW_TINT = 0xffc107
export const YELLOW_2_TINT = 0xffeb3b
export const BLUE_TINT = 0x03a9f4
export const RED_TINT = 0xff5722
export const GRAY_TINT = 0x9e9e9e

// Piece data
export const L_TOP = [
    [1, 0],
    [1, 0],
    [1, 1],
]

export const L_TOP_REVERSE = [
    [0, 1],
    [0, 1],
    [1, 1],
]

export const L_1_TOP = [
    [1, 0],
    [1, 1],
]

export const L_3_TOP = [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
]

export const L_RIGHT = [
    [1, 1, 1],
    [1, 0, 0],
]

export const L_RIGHT_REVERSE = [
    [1, 1, 1],
    [0, 0, 1],
]

export const L_1_RIGHT = [
    [1, 1],
    [1, 0],
]

export const L_3_RIGHT = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
]

export const L_BOTTOM = [
    [1, 1],
    [0, 1],
    [0, 1],
]

export const L_BOTTOM_REVERSE = [
    [1, 1],
    [1, 0],
    [1, 0],
]

export const L_1_BOTTOM = [
    [1, 1],
    [0, 1],
]

export const L_3_BOTTOM = [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
]

export const L_LEFT = [
    [0, 0, 1],
    [1, 1, 1],
]

export const L_LEFT_REVERSE = [
    [1, 0, 0],
    [1, 1, 1],
]

export const L_1_LEFT = [
    [0, 1],
    [1, 1],
]

export const L_3_LEFT = [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
]

export const LINE_2_VERTICAL = [[1], [1]]

export const LINE_2_HORIZONTAL = [[1, 1]]

export const LINE_3_VERTICAL = [[1], [1], [1]]

export const LINE_3_HORIZONTAL = [[1, 1, 1]]

export const LINE_4_VERTICAL = [[1], [1], [1], [1]]

export const LINE_4_HORIZONTAL = [[1, 1, 1, 1]]

export const LINE_5_VERTICAL = [[1], [1], [1], [1], [1]]

export const LINE_5_HORIZONTAL = [[1, 1, 1, 1, 1]]

export const SQUARE_1 = [[1]]
export const SQUARE_2 = [
    [1, 1],
    [1, 1],
]
export const SQUARE_3 = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
]

export const TRAPEZOID_VERTICAL_LEFT = [
    [1, 0],
    [1, 1],
    [0, 1],
]

export const TRAPEZOID_VERTICAL_RIGHT = [
    [0, 1],
    [1, 1],
    [1, 0],
]

export const TRAPEZOID_HORIZONTAL_LEFT = [
    [1, 1, 0],
    [0, 1, 1],
]

export const TRAPEZOID_HORIZONTAL_RIGHT = [
    [0, 1, 1],
    [1, 1, 0],
]

export const TRIANGLE_LEFT = [
    [0, 1],
    [1, 1],
    [0, 1],
]

export const TRIANGLE_RIGHT = [
    [1, 0],
    [1, 1],
    [1, 0],
]

export const TRIANGLE_TOP = [
    [0, 1, 0],
    [1, 1, 1],
]

export const TRIANGLE_BOTTOM = [
    [1, 1, 1],
    [0, 1, 0],
]

export const T_PIECE_LEFT = [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
]

export const T_PIECE_RIGHT = [
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
]

export const T_PIECE_TOP = [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
]

export const T_PIECE_BOTTOM = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
]

export const PLUS_PIECE_DATA = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
]

export const CROSS_PIECE_LEFT_2_DATA = [
    [1, 0],
    [0, 1],
]

export const CROSS_PIECE_RIGHT_2_DATA = [
    [0, 1],
    [1, 0],
]

export const CROSS_PIECE_LEFT_3_DATA = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
]

export const CROSS_PIECE_RIGHT_3_DATA = [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
]

export const CROSS_PIECE_LEFT_4_DATA = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]

export const CROSS_PIECE_RIGHT_4_DATA = [
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 0, 0, 0],
]

export const CROSS_PIECE_LEFT_5_DATA = [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
]

export const CROSS_PIECE_RIGHT_5_DATA = [
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
]

export const U_PIECE_LEFT = [
    [1, 1],
    [0, 1],
    [1, 1],
]

export const U_PIECE_RIGHT = [
    [1, 1],
    [1, 0],
    [1, 1],
]

export const U_PIECE_TOP = [
    [1, 0, 1],
    [1, 1, 1],
]

export const U_PIECE_BOTTOM = [
    [1, 1, 1],
    [1, 0, 1],
]

export const FRAME_GEM_TILED_MAP = {
    1: FRAME_GAME_PLAY_32.GEM,

    10: FRAME_GAME_PLAY_32.GEM_DIAMOND_10,
    11: FRAME_GAME_PLAY_32.GEM_DIAMOND_11,
    12: FRAME_GAME_PLAY_32.GEM_DIAMOND_12,
    13: FRAME_GAME_PLAY_32.GEM_DIAMOND_13,
    14: FRAME_GAME_PLAY_32.GEM_DIAMOND_14,
    15: FRAME_GAME_PLAY_32.GEM_DIAMOND_15,
}

export const PIECE_TYPES_TILED_MAP = {
    // I2: LINE_2_VERTICAL,
    1: {
        type: SQUARE_1_TYPE,
        direction: null,
        isReverse: false,
        data: SQUARE_1,
    },

    I2: {
        type: LINE_2_TYPE,
        direction: VERTICAL,
        isReverse: false,
        data: LINE_2_VERTICAL,
    },

    // I3: LINE_3_VERTICAL,
    I3: {
        type: LINE_3_TYPE,
        direction: VERTICAL,
        isReverse: false,
        data: LINE_3_VERTICAL,
    },

    // I4: LINE_4_VERTICAL,
    I4: {
        type: LINE_4_TYPE,
        direction: VERTICAL,
        isReverse: false,
        data: LINE_4_VERTICAL,
    },

    // I5: LINE_5_VERTICAL,
    I5: {
        type: LINE_5_TYPE,
        direction: VERTICAL,
        isReverse: false,
        data: LINE_5_VERTICAL,
    },

    // II2: LINE_2_HORIZONTAL,
    II2: {
        type: LINE_2_TYPE,
        direction: HORIZONTAL,
        isReverse: false,
        data: LINE_2_HORIZONTAL,
    },

    // II3: LINE_3_HORIZONTAL,
    II3: {
        type: LINE_3_TYPE,
        direction: HORIZONTAL,
        isReverse: false,
        data: LINE_3_HORIZONTAL,
    },

    // II4: LINE_4_HORIZONTAL,
    II4: {
        type: LINE_4_TYPE,
        direction: HORIZONTAL,
        isReverse: false,
        data: LINE_4_HORIZONTAL,
    },

    // II5: LINE_5_HORIZONTAL,
    II5: {
        type: LINE_5_TYPE,
        direction: HORIZONTAL,
        isReverse: false,
        data: LINE_5_HORIZONTAL,
    },

    // J1: L_TOP_REVERSE,
    J1: {
        type: L_TYPE,
        direction: TOP,
        isReverse: true,
        data: L_TOP,
    },

    // J2: L_LEFT_REVERSE,
    J2: {
        type: L_TYPE,
        direction: LEFT,
        isReverse: true,
        data: L_LEFT_REVERSE,
    },

    // J3: L_BOTTOM_REVERSE,
    J3: {
        type: L_TYPE,
        direction: BOTTOM,
        isReverse: true,
        data: L_BOTTOM_REVERSE,
    },

    // J4: L_RIGHT_REVERSE,
    J4: {
        type: L_TYPE,
        direction: RIGHT,
        isReverse: true,
        data: L_RIGHT_REVERSE,
    },

    // L1: L_TOP,
    L1: {
        type: L_TYPE,
        direction: TOP,
        isReverse: false,
        data: L_TOP,
    },

    // L2: L_RIGHT,
    L2: {
        type: L_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: L_RIGHT,
    },

    // L3: L_BOTTOM,
    L3: {
        type: L_TYPE,
        direction: BOTTOM,
        isReverse: false,
        data: L_BOTTOM,
    },

    // L4: L_LEFT,
    L4: {
        type: L_TYPE,
        direction: LEFT,
        isReverse: false,
        data: L_LEFT,
    },

    // O: SQUARE_2,
    O: {
        type: SQUARE_2_TYPE,
        direction: null,
        isReverse: false,
        data: SQUARE_2,
    },

    // 'polyplet-left-2': CROSS_PIECE_LEFT_2_DATA,
    'polyplet-left-2': {
        type: CROSS_PIECE_2_TYPE,
        direction: LEFT,
        isReverse: false,
        data: CROSS_PIECE_LEFT_2_DATA,
    },

    // 'polyplet-left-3': CROSS_PIECE_LEFT_3_DATA,
    'polyplet-left-3': {
        type: CROSS_PIECE_3_TYPE,
        direction: LEFT,
        isReverse: false,
        data: CROSS_PIECE_LEFT_3_DATA,
    },

    // 'polyplet-left-4': CROSS_PIECE_LEFT_4_DATA,
    'polyplet-left-4': {
        type: CROSS_PIECE_4_TYPE,
        direction: LEFT,
        isReverse: false,
        data: CROSS_PIECE_LEFT_4_DATA,
    },

    // 'polyplet-left-5': CROSS_PIECE_LEFT_5_DATA,
    'polyplet-left-5': {
        type: CROSS_PIECE_5_TYPE,
        direction: LEFT,
        isReverse: false,
        data: CROSS_PIECE_LEFT_5_DATA,
    },

    // 'polyplet-right-2': CROSS_PIECE_RIGHT_2_DATA,
    'polyplet-right-2': {
        type: CROSS_PIECE_2_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: CROSS_PIECE_RIGHT_2_DATA,
    },

    // 'polyplet-right-3': CROSS_PIECE_RIGHT_3_DATA,
    'polyplet-right-3': {
        type: CROSS_PIECE_3_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: CROSS_PIECE_RIGHT_3_DATA,
    },

    // 'polyplet-right-4': CROSS_PIECE_RIGHT_4_DATA,
    'polyplet-right-4': {
        type: CROSS_PIECE_4_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: CROSS_PIECE_RIGHT_4_DATA,
    },

    // 'polyplet-right-5': CROSS_PIECE_RIGHT_5_DATA,
    'polyplet-right-5': {
        type: CROSS_PIECE_5_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: CROSS_PIECE_RIGHT_5_DATA,
    },

    // S1: TRAPEZOID_HORIZONTAL_RIGHT,
    S1: {
        type: TRAPEZOID_TYPE,
        direction: HORIZONTAL_RIGHT,
        isReverse: false,
        data: TRAPEZOID_HORIZONTAL_RIGHT,
    },

    // S2: TRAPEZOID_VERTICAL_LEFT,
    S2: {
        type: TRAPEZOID_TYPE,
        direction: VERTICAL_LEFT,
        isReverse: false,
        data: TRAPEZOID_VERTICAL_LEFT,
    },

    // T1: TRIANGLE_TOP,
    T1: {
        type: TRIANGLE_TYPE,
        direction: TOP,
        isReverse: false,
        data: TRIANGLE_TOP,
    },

    // T2: TRIANGLE_RIGHT,
    T2: {
        type: TRIANGLE_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: TRIANGLE_RIGHT,
    },

    // T3: TRIANGLE_BOTTOM,
    T3: {
        type: TRIANGLE_TYPE,
        direction: BOTTOM,
        isReverse: false,
        data: TRIANGLE_BOTTOM,
    },

    // T4: TRIANGLE_LEFT,
    T4: {
        type: TRIANGLE_TYPE,
        direction: LEFT,
        isReverse: false,
        data: TRIANGLE_LEFT,
    },

    // TT1: T_PIECE_BOTTOM,
    TT1: {
        type: T_PIECE_TYPE,
        direction: BOTTOM,
        isReverse: false,
        data: T_PIECE_BOTTOM,
    },

    // TT2: T_PIECE_LEFT,
    TT2: {
        type: T_PIECE_TYPE,
        direction: LEFT,
        isReverse: false,
        data: T_PIECE_LEFT,
    },

    // TT3: T_PIECE_TOP,
    TT3: {
        type: T_PIECE_TYPE,
        direction: TOP,
        isReverse: false,
        data: T_PIECE_TOP,
    },

    // TT4: T_PIECE_RIGHT,
    TT4: {
        type: T_PIECE_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: T_PIECE_RIGHT,
    },

    // U1: U_PIECE_TOP,
    U1: {
        type: U_PIECE_TYPE,
        direction: TOP,
        isReverse: false,
        data: U_PIECE_TOP,
    },

    // U2: U_PIECE_RIGHT,
    U2: {
        type: U_PIECE_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: U_PIECE_RIGHT,
    },

    // U3: U_PIECE_BOTTOM,
    U3: {
        type: U_PIECE_TYPE,
        direction: BOTTOM,
        isReverse: false,
        data: U_PIECE_BOTTOM,
    },

    // U4: U_PIECE_LEFT,
    U4: {
        type: U_PIECE_TYPE,
        direction: LEFT,
        isReverse: false,
        data: U_PIECE_LEFT,
    },

    // V1: L_1_RIGHT,
    V1: {
        type: L_1_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: L_1_RIGHT,
    },

    // V2: L_1_BOTTOM,
    V2: {
        type: L_1_TYPE,
        direction: BOTTOM,
        isReverse: false,
        data: L_1_BOTTOM,
    },

    // V3: L_1_TOP,
    V3: {
        type: L_1_TYPE,
        direction: TOP,
        isReverse: false,
        data: L_1_TOP,
    },

    // V4: L_1_LEFT,
    V4: {
        type: L_1_TYPE,
        direction: LEFT,
        isReverse: false,
        data: L_1_LEFT,
    },

    // VV1: L_3_RIGHT,
    VV1: {
        type: L_3_TYPE,
        direction: RIGHT,
        isReverse: false,
        data: L_3_RIGHT,
    },

    // VV2: L_3_BOTTOM,
    VV2: {
        type: L_3_TYPE,
        direction: BOTTOM,
        isReverse: false,
        data: L_3_BOTTOM,
    },

    // VV3: L_3_TOP,
    VV3: {
        type: L_3_TYPE,
        direction: TOP,
        isReverse: false,
        data: L_3_TOP,
    },

    // VV4: L_3_LEFT,
    VV4: {
        type: L_3_TYPE,
        direction: LEFT,
        isReverse: false,
        data: L_3_LEFT,
    },

    // X: PLUS_PIECE_DATA,
    X: {
        type: PLUS_PIECE_TYPE,
        direction: null,
        isReverse: false,
        data: PLUS_PIECE_DATA,
    },

    // Z1: TRAPEZOID_HORIZONTAL_LEFT,
    Z1: {
        type: TRAPEZOID_TYPE,
        direction: HORIZONTAL_LEFT,
        isReverse: false,
        data: TRAPEZOID_HORIZONTAL_LEFT,
    },

    // Z2: TRAPEZOID_VERTICAL_RIGHT,
    Z2: {
        type: TRAPEZOID_TYPE,
        direction: VERTICAL_RIGHT,
        isReverse: false,
        data: TRAPEZOID_VERTICAL_RIGHT,
    },
}
