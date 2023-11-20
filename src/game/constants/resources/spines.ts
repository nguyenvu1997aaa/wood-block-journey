const SPINES = {
    LOGO: {
        KEY: 'spine-logo',
        JSON: './assets/spine/logo/logo.json',
        ATLAS: './assets/spine/logo/logo.atlas',
        ANIMATIONS: {
            START_GROW: 'start_grow',
            IDLE_GROW: 'idle_grow',
        },
    },
    BEST_SCORE: {
        KEY: 'best-score',
        JSON: './assets/spine/best-score{langcode}/newbest-trim.json',
        ATLAS: './assets/spine/best-score{langcode}/newbest-trim.atlas',
        ANIMATIONS: {
            ANIM: 'anim5',
        },
    },
}

export default SPINES
