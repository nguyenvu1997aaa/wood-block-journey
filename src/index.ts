import 'phaser'

import './GameCore'

import { initSentry, sendException } from './utils/Sentry'

initSentry()

import MagicGame from '@/game'
import gameConfig from '@/game/configs/gameConfig'

const initGame = () => {
    try {
        const game = new MagicGame(gameConfig)
        window.game = game
    } catch (error) {
        sendException(error)
    }
}

const waitFBInitiatedTimer = setInterval(() => {
    if (!window.__analyticsInitiated) return

    window.__fbGameReady = false

    clearInterval(waitFBInitiatedTimer)
    clearInterval(window.__fbInstantLoadingTimer)

    GameSDK.setLoadingProgress(30)

    gtag('event', 'app_initialize', {
        send_to: ['GA'],
    })

    initGame()
}, 50)
