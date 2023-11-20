const imageScale = GameCore.Utils.Image.getImageScale()

const SPRITES = {
    TUTORIAL: {
        KEY: 'tutorial-resources',
        TEXTURE: `./assets/textures/${imageScale}x/tutorial-resources.png`,
        JSON: `./assets/textures/${imageScale}x/tutorial-resources.json`,
        FRAME: {
            HAND: 'hand',
            BLANK: 'blank',
            BUTTON_BROWN: 'brown',
        },
    },

    DEFAULT: {
        KEY: 'default-resources',
        TEXTURE: `./assets/textures/${imageScale}x{langcode}/default-resources.png`,
        JSON: `./assets/textures/${imageScale}x{langcode}/default-resources.json`,
        URL: `./assets/textures/${imageScale}x{langcode}/`,
        FRAME: {
            BLANK: 'blank',
            LOGO: 'logo',
            TEXT_LOADING: 'loading',
            BORDER_BOTTOM_PANEL: 'border-bottom-panel',
            BOTTOM_PANEL: 'bottom-panel',
            BOTTOM_LINE: 'bottom-line',
            GLARE: 'glare',
            TITLE_YOUR_SCORE: 'title-your-score',
            BG_YOUR_SCORE: 'bg-your-score',
            LEAF: 'leaf',
            BEST_SCORE_FRAME: 'best-score-frame',
            BEST_SCORE_FRAME_LONG: 'best-score-frame-long',
            FOOTER: 'footer',
            SCORE_PANEL: 'score-panel',
            SCORE_PANEL_DARK: 'score-panel-dark',
            BG_PROGRESS_CIRCLE: 'bg-progress-circle',
            BG_TEXT_TARGET_PANEL: 'text-target-panel',
            WOOD_PANEL: 'wood-panel',
            BORDER_DAILY: 'border-daily',
            BG_STREAK: 'bg-streak',
            BG_COMBO: 'bg-combo',

            // Background
            LEVEL_PLAYED: 'bg/level-played',
            LEVEL_PLAYING: 'bg/level-playing',
            LEVEL_LOCKED: 'bg/level-locked',
            BG_DARK: 'bg/bg-dark',
            BG_TOP: 'bg/bg-top',
            BG_MIDDLE: 'bg/bg-middle',
            BG_BOTTOM: 'bg/bg-bottom',

            // Preloader
            PRELOADER: 'preloader/dual-ring',

            // Leaderboard
            LEADERBOARD_TAB_ON: 'leaderboards/tab-on',
            LEADERBOARD_TAB_OFF: 'leaderboards/tab-off',
            LEADERBOARD_BG_TOP: 'leaderboards/bg-top',
            LEADERBOARD_BG_MIDDLE: 'leaderboards/bg-middle',
            LEADERBOARD_BG_BOTTOM: 'leaderboards/bg-bottom',
            LEADERBOARD_BG_ITEM: 'leaderboards/bg-item',
            LEADERBOARD_BORDER_LEFT: 'leaderboards/border-left',
            LEADERBOARD_BORDER_RIGHT: 'leaderboards/border-right',
            PREFIX_LEADERBOARD_BG_ITEM: 'leaderboards/bg-item-',
            PREFIX_LEADERBOARD_BG_ITEM_0: 'leaderboards/bg-item-0',

            // Avatar
            AVATAR_BORDER: 'avatar/border',
            AVATAR_BORDER_BIG: 'avatar/border-big',
            AVATAR_BORDER_CHALLENGE: 'avatar/border-challenge',
            AVATAR_BACKGROUND: 'avatar/background',

            // Popup
            POPUP_TOP: 'popup/top',
            POPUP_TOP_DARK: 'popup/top-dark',
            POPUP_MID: 'popup/middle',
            POPUP_BOTTOM: 'popup/bottom',
            POPUP_CONTENT_BACKGROUND: 'popup/background',
            POPUP_SCORE_PANEL: 'popup/score-panel',

            // Icons
            ICON_ADS: 'icons/flat-ad',
            ICON_CUP_GOLD: 'icons/cup-gold',
            ICON_CUP_SILVER: 'icons/cup-silver',
            ICON_CUP_COPPER: 'icons/cup-bronze',
            ICON_SOUND: 'icons/sound',
            ICON_VIBRATE: 'icons/vibrate',
            ICON_MUSIC: 'icons/music',
            ICON_RANK: 'icons/rank',
            ICON_PLAY: 'icons/play',
            ICON_I_PLAY: 'icons/i-play',
            ICON_PLAY_GREEN: 'icons/play-green',
            ICON_SHARE: 'icons/share',
            ICON_INVITE: 'icons/invite',
            ICON_FLAG: 'icons/milestone',
            ICON_BROWN_JOURNEY: 'icons/brown-journey',
            ICON_WHITE_JOURNEY: 'icons/white-journey',
            ICON_SWORD: 'icons/sword',
            ICON_SWORD_BLUE: 'icons/sword-blue',
            ICON_SETTING: 'icons/setting',
            ICON_REPLAY: 'icons/replay',
            ICON_RETRY: 'icons/retry',
            ICON_HOME: 'icons/home',
            ICON_BACK: 'icons/back',
            ICON_BATTLE: 'icons/battle',
            ICON_CUP: 'icons/cup',
            ICON_SHARE_BLUE: 'icons/share-blue',
            ICON_CROWN: 'icons/crown',
            ICON_CROWN_BIG: 'icons/crown-big',
            ICON_CLOCK: 'icons/clock',
            ICON_DAILY: 'icons/icon-daily',
            ICON_JOURNEY: 'icons/icon-journey',
            ICON_JOURNEY_2: 'icon-journey',
            ICON_DOT_RED: 'icons/dot',
            ICON_STAR: 'icons/star',
            ICON_PLUS: 'icons/plus',
            ICON_CHECK: 'icons/check',

            // Buttons
            BUTTON_CLOSE: 'buttons/close',
            BUTTON_RED: 'buttons/red',
            BUTTON_BLUE: 'buttons/blue',
            BUTTON_BLUE_SMALL: 'buttons/blue-small',
            BUTTON_BLUE_MEDIUM: 'buttons/blue-medium',
            BUTTON_GREEN: 'buttons/green',
            BUTTON_GREEN_BIG: 'buttons/green-big',
            BUTTON_DARK_BLUE: 'buttons/dark-blue',
            BUTTON_DARK_BLUE_BIG: 'buttons/dark-blue-big',
            BUTTON_BROWN: 'buttons/brown',
            BUTTON_GREEN_LARGE: 'buttons/green-large',
            BUTTON_PLAY: 'buttons/play',
            BUTTON_RANDOM: 'buttons/random',
            BUTTON_CHALLENGE_LIGHT: 'buttons/challenge_light',
            BUTTON_SHARE_DARK: 'buttons/share',
            BUTTON_MINOR: 'buttons/minor',
            BUTTON_CIRCLE: 'buttons/circle-button',
            BUTTON_TOGGLE_OFF: 'buttons/toggle-off',
            BUTTON_TOGGLE_ON: 'buttons/toggle-on',
            BUTTON_DARK_BLUE_SMALL: 'buttons/dark-blue-small',

            BUTTON_DOT_BLUE: 'buttons/dot-blue',
            BUTTON_DOT_GREEN: 'buttons/dot-green',
            BUTTON_SKIP: 'buttons/skip',

            // Daily challenge
            DAILY_BORDER: 'daily-challenge/border',
            DAILY_BACKGROUND: 'daily-challenge/bg',
            DAILY_TITLE_PANEL: 'daily-challenge/title-panel',
            DAILY_BORDER_TOP: 'daily-challenge/top-panel',
            DAILY_BORDER_MIDDLE: 'daily-challenge/middle-panel',
            DAILY_BORDER_BOTTOM: 'daily-challenge/bottom-panel',
            DAILY_BG_ITEM_LIGHT: 'daily-challenge/bg-item-light',
            DAILY_BG_ITEM_DARK: 'daily-challenge/bg-item-dark',
            DAILY_BG_TIME: 'daily-challenge/time-panel',

            // Texts
            NO_THANK_TEXT: 'texts/no-thank',
            TEXT_SECOND_CHANGE: 'texts/second-chance',
            TEXT_VS: 'texts/vs',
            TEXT_LOSE: 'texts/lose',
            TEXT_WIN: 'texts/win',
            TEXT_DRAW: 'texts/draw',
            TEXT_CONTINUE: 'texts/continue',
            TEXT_LEADER_BOARD: 'texts/leader-board',
            TEXT_WORLD: 'texts/world',
            TEXT_WORLD_DISABLE: 'texts/world-disable',
            TEXT_FRIENDS: 'texts/friends',
            TEXT_FRIENDS_DISABLE: 'texts/friends-disable',
            TEXT_PLAY_WITH: 'texts/play-with',
            TEXT_PLAY_WITH_BLUE: 'texts/play-with-blue',
            TEXT_JOURNEY: 'texts/text-journey',
            TEXT_SETTING: 'texts/setting',
            TEXT_OFF: 'texts/off',
            TEXT_ON: 'texts/on',
            TEXT_REPLAY: 'texts/replay',
            TEXT_YOUR_SCORE: 'texts/your-score',
            TEXT_WAITING_OPPONENT: 'texts/waiting-for-opponent',
            TEXT_SINGLE: 'texts/play-single',
            TEXT_RETRY: 'texts/text-retry',
            TEXT_LEVEL_FAIL: 'texts/level-failed',
            TEXT_CONGRATULATION: 'texts/congratulations',
            TEXT_NEXT_LEVEL: 'texts/text-next-level',
            TEXT_START_OVER: 'texts/start-over',
            TEXT_SHARE_BLUE: 'texts/text-share',
            TEXT_PLAY: 'texts/play',
            TEXT_MISSION: 'texts/mission',
            TEXT_NEXT_MILESTONE: 'texts/next-milestone',
            TEXT_FIRST_MILESTONE: 'texts/first-milestone',
            TEXT_COLLECT: 'texts/collect',
            TEXT_TARGET_SCORE: 'texts/target-score',
            TEXT_YES: 'texts/yes',
            TEXT_NO: 'texts/no',
            TEXT_TUTORIAL: 'texts/text-tutorial',
            TEXT_DAILY_CHALLENGE: 'texts/daily-challenge',
            TEXT_START: 'texts/start',
            TEXT_RESULT: 'texts/result',
            TEXT_RANKING: 'texts/text-ranking',
            TEXT_NEW_BEST: 'texts/new-best',

            TEXT_INVITE_FRIENDS: 'texts/invite-friends',
            TEXT_KEEP_PLAYING: 'texts/keep-playing',
            TEXT_OUT_OF_LIVE: 'texts/out-of-live',
            TEXT_REFILL_LIVES: 'texts/refill-lives',

            // Lives
            LIVES_HEART: 'lives/heart',
            LIVES_TIME_BLOCK: 'lives/time-block',
            LIVES_TIME_BLOCK_2: 'lives/time-block-2',

            // UI Ngang
            PANEL_BEST_SCORE: 'ui-ngang/khung-best-score',
            PANEL_MISSION: 'ui-ngang/khung-mission',
            PANEL_NEXT_BLOCK: 'ui-ngang/khung-next-block',
            PANEL_SCORE: 'ui-ngang/khung-score',
            TEXT_NEXT_BLOCK: 'ui-ngang/text-next-block',
            TEXT_SCORE: 'ui-ngang/text-score',
            TEXT_MISSION_LANDSCAPE: 'ui-ngang/text-mission',
        },
    },

    EFFECTS: {
        KEY: 'effects-resources',
        PATH: `./assets/textures/${imageScale}x{langcode}/effects-resources.png`,
        JSON: `./assets/textures/${imageScale}x{langcode}/effects-resources.json`,
        FRAME: {
            BLANK: 'blank',

            GLOW_CIRCLE: 'glow-circle',
            GLARE_CROSS: 'glare-cross',
            DUST: 'dust',
            DUST_YELLOW: 'dust-yellow',

            // FX
            FX_STAR: 'star',
            FX_STAR_YELLOW: 'star-yellow',

            // Confetti
            FX_CONFETTI_SMALL_1: 'confetti/small-1',
            FX_CONFETTI_SMALL_2: 'confetti/small-2',
            FX_CONFETTI_SMALL_3: 'confetti/small-3',
            FX_CONFETTI_SMALL_4: 'confetti/small-4',
            FX_CONFETTI_HEXAGON: 'confetti/hexagon-',

            FX_CONFETTI_RIBBON: 'ribbon',

            // Text
            TEXT_COOL: 'text/text_cool',
            TEXT_EXCELLENT: 'text/text_excellent',
            TEXT_GOOD: 'text/text_good',

            FX_COMET: 'comet',
            FX_SPARK: 'spark',
            FX_CIRCLE: 'circle',
            FX_CIRCLE_LIGHT: 'circle-light',
            FX_GLOW_LIGHT: 'glow-light',
            FX_GLOW_SMALL: 'glow-small',
            FX_STAR_WHITE: 'star-white',

            // Fireworks
            FX_FIREWORKS_SMALL: 'fireworks/small',
            FX_FIREWORKS_BIG_0: 'fireworks/big-explosive-0',
            FX_FIREWORKS_BIG_1: 'fireworks/big-explosive-1',
            FX_FIREWORKS_SOAR_LINE: 'fireworks/soar-line',
            FX_FIREWORKS_SOAR_CIRCLE: 'fireworks/soar-circle',

            PREFIX_ANIMATION_RIBBON_CONFETTI_A: 'ribbon/falling-confetti/confetti-a/confetti-a-',
            PREFIX_ANIMATION_RIBBON_CONFETTI_B: 'ribbon/falling-confetti/confetti-b/confetti-b-',
            PREFIX_ANIMATION_RIBBON_CONFETTI_C: 'ribbon/falling-confetti/confetti-c/confetti-c-',
            PREFIX_ANIMATION_RIBBON_CONFETTI_D: 'ribbon/falling-confetti/confetti-d/confetti-d-',

            // Star
            ANIMATION_STAR_X: 'star-x/star-',
            ANIMATION_STAR_Y: 'star-y/star-',
        },
    },

    ANIMATION_SCENE: {
        KEY: 'effects-resources',
        PATH: `./assets/textures/${imageScale}x/`,
        JSON: `./assets/textures/${imageScale}x/animation-scene-resources.json`,
        FRAME: {
            BLANK: 'blank',

            COIN: 'coins/coin',
            COIN_SMALL: 'coins/coin-small',
            COIN_SMALL_GREY: 'coins/coin-small-grey',

            FX_SPARK_YELLOW: 'yellow-spark',

            // Ribbon
            FX_CONFETTI_RIBBON: 'ribbon/ribbon',
        },
    },

    GAMEPLAY: {
        KEY: 'gameplay-resources',
        TEXTURE: `./assets/textures/${imageScale}x/gameplay-resources.png`,
        JSON: `./assets/textures/${imageScale}x/gameplay-resources.json`,
        FRAME: {
            BLANK: 'blank',

            BG_SCORE: 'bg-score',
            BG_MAIN_SCORE: 'bg-main-score',
            BOARD: 'board',
            VIOLET_GLOW: 'violet-glow',
            MASK: 'mask',
            FLAG: 'flag',
            DUST: 'dust',
            CUP_GLARE: 'cup-glare',
            HAND: 'hand',

            // Avatar
            AVATAR_BORDER: 'avatars/border',
            AVATAR_BACKGROUND: 'avatars/background',

            // Icons
            ICON_SETTING: 'icons/setting',
            ICON_CUP: 'icons/cup',
            ICON_CHECK: 'icons/check',
            ICON_STAR: 'icons/star',
            ICON_STAR_1: 'icons/star-1',
            ICON_HOME: 'icons/home',
            ICON_ADD_FRIEND: 'icons/add-friends',
            ICON_BATTLE: 'icons/battle',

            // Text
            TEXT_NEXT_LEVEL: 'text/next-level',

            // Button
            BUTTON_WOOD_SMALL: 'buttons/wood-small',
            BUTTON_SKIP: 'buttons/button-skip',

            // Progress
            PROGRESS_BG_LEFT: 'progress/bg-left',
            PROGRESS_BG_MID: 'progress/bg-mid',
            PROGRESS_BG_RIGHT: 'progress/bg-right',
            PROGRESS_BAR_LEFT: 'progress/bar-left',
            PROGRESS_BAR_MID: 'progress/bar-mid',
            PROGRESS_BAR_RIGHT: 'progress/bar-right',
            PROGRESS_BAR_RIGHT_WHITE: 'progress/bar-right-white',
        },
    },

    GAMEPLAY_32: {
        KEY: 'gameplay-32-resources',
        TEXTURE: `./assets/textures/${imageScale}x/gameplay-32-resources.png`,
        JSON: `./assets/textures/${imageScale}x/gameplay-32-resources.json`,
        FRAME: {
            // Gem
            GEM: 'gem/gem',
            GEM_LIGHT: 'gem/gem_light',
            GEM_SILVER: 'gem/gem_silver',
            GEM_TRANSPARENT: 'gem/gem_transparent',
            GEM_WHITE: 'gem/gem_white',
            GEM_GLARE: 'gem/gem_glare',
            GEM_HIGHT_LIGHT: 'gem/gem_highlight',

            GEM_DIAMOND_10: 'gem/diamond/diamond-10',
            GEM_DIAMOND_11: 'gem/diamond/diamond-11',
            GEM_DIAMOND_12: 'gem/diamond/diamond-12',
            GEM_DIAMOND_13: 'gem/diamond/diamond-13',
            GEM_DIAMOND_14: 'gem/diamond/diamond-14',
            GEM_DIAMOND_15: 'gem/diamond/diamond-15',

            GEM_DIAMOND_10_LIGHT: 'gem/diamond/diamond-10_light',
            GEM_DIAMOND_11_LIGHT: 'gem/diamond/diamond-11_light',
            GEM_DIAMOND_12_LIGHT: 'gem/diamond/diamond-12_light',
            GEM_DIAMOND_13_LIGHT: 'gem/diamond/diamond-13_light',
            GEM_DIAMOND_14_LIGHT: 'gem/diamond/diamond-14_light',
            GEM_DIAMOND_15_LIGHT: 'gem/diamond/diamond-15_light',

            GEM_RUBY_20: 'gem/ruby/ruby-20',

            GEM_SAPPHIRE_30: 'gem/sapphire/sapphire-30',

            BLOCK_GRADIENT_PREFIX: 'gem/block_gradient/block_color',
        },
    },
    DEMO_SPINE: {
        KEY: 'demo-spine',
        jsonPATH: './assets/spines/demo/demo.json',
        atlasPATH: './assets/spines/demo/demo.atlas',
    },
}

export type gameEffect = typeof SPRITES.EFFECTS.FRAME
export type demoEffect = typeof SPRITES.ANIMATION_SCENE.FRAME & gameEffect

if (GameCore.Utils.Valid.isDebugger()) {
    SPRITES.EFFECTS.FRAME = {
        ...SPRITES.ANIMATION_SCENE.FRAME,
        ...SPRITES.EFFECTS.FRAME,
    }
}

export default SPRITES
