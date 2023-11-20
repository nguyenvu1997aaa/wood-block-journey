import { getByKeyLocalStorage, writeByKeyLocalStorage } from '@/utils/localStorage'
import {
    LIVES_COUNT_DOWN_START,
    LIVES_REQUEST,
    LIVES_RESET,
    LIVES_UPDATED,
} from '../constants/ActionTypes'
import { getLastBonusLifeTime, getLives } from '../selectors/lives'

const { Match, Lives } = GameCore.Configs

export const startCountDownTimerBonusLife = () => (dispatch, getState) => {
    dispatch(handleCountDownBonusLife())

    const state = getState()
    const timeInterval = Lives.bonusDurationMins * 60 * 1000
    const currentTime = new Date().getTime()
    const lastBonusLifeTime = getLastBonusLifeTime(state)
    let remainingTime = currentTime - lastBonusLifeTime

    console.log(';remainingTime === ', remainingTime)

    if (remainingTime < timeInterval) {
        dispatch(handleRemainingTime(timeInterval - (currentTime - lastBonusLifeTime)))
    } else {
        dispatch(handleCountDownTimerBonusLife())
    }
}

const handleRemainingTime = (remainingTime) => (dispatch) => {
    setTimeout(() => {
        dispatch(increaseLife())
        dispatch(handleCountDownBonusLife())
        dispatch(handleCountDownTimerBonusLife())
    }, remainingTime)
}

const handleCountDownTimerBonusLife = () => (dispatch) => {
    const timeInterval = Lives.bonusDurationMins * 60 * 1000
    setInterval(() => {
        dispatch(increaseLife())
        dispatch(handleCountDownBonusLife())
    }, timeInterval)
}

const handleCountDownBonusLife = () => (dispatch) => {
    dispatch({
        type: LIVES_COUNT_DOWN_START,
        payload: {},
    })
}

export const loadLives = () => async (dispatch) => {
    const { player } = window.game
    const { playerId } = player.getPlayer()

    try {
        dispatch({
            type: LIVES_REQUEST,
            payload: {},
        })

        const livesDataFB = await window.FBInstant.player.getDataAsync(['lives'])?.lives
        const livesDataStorage = getByKeyLocalStorage(`${Match.LivesStore}-${playerId}`) || {}
        let { lives = Lives.livesCapacity, lastBonusLifeTime = 0 } = livesDataStorage

        if (livesDataFB) {
            lives = livesDataFB.lives || 0
            lastBonusLifeTime = livesDataFB.lastBonusLifeTime || 0
        }

        const correctData = {
            lives,
            lastBonusLifeTime,
        }

        dispatch({
            type: LIVES_UPDATED,
            payload: { data: correctData },
        })

        dispatch(startCountDownTimerBonusLife())

        await dispatch(bonusLives())
    } catch (error) {
        //
        dispatch({
            type: LIVES_RESET,
            payload: {},
        })
    }
}

export const increaseLife = () => async (dispatch, getState) => {
    try {
        const { player } = window.game
        const { playerId } = player.getPlayer()
        const state = getState()
        const currentLives = getLives(state)
        let lives = Lives.bonusLife + currentLives

        if (lives > Lives.livesCapacity) lives = Lives.livesCapacity

        const correctData = {
            lives,
            lastBonusLifeTime: new Date().getTime(),
        }

        dispatch({
            type: LIVES_UPDATED,
            payload: { data: correctData },
        })

        await window.FBInstant.player.setDataAsync({ lives: correctData })

        writeByKeyLocalStorage(`${Match.LivesStore}-${playerId}`, correctData)
    } catch (error) {
        //
    }
}

export const decreaseLife = () => async (dispatch, getState) => {
    try {
        const { player } = window.game
        const { playerId } = player.getPlayer()
        const state = getState()
        const currentLives = getLives(state)
        const lastBonusLifeTime = getLastBonusLifeTime(state)
        let lives = currentLives - Lives.bonusLife

        if (lives > Lives.livesCapacity) lives = Lives.livesCapacity
        if (lives < 0) lives = 0

        const correctData = {
            lives,
            lastBonusLifeTime,
        }

        dispatch({
            type: LIVES_UPDATED,
            payload: { data: correctData },
        })

        await window.FBInstant.player.setDataAsync({ lives: correctData })

        writeByKeyLocalStorage(`${Match.LivesStore}-${playerId}`, correctData)
    } catch (error) {
        //
    }
}

export const bonusLives = () => async (dispatch, getState) => {
    try {
        const state = getState()
        const currentLives = getLives(state) || 0
        const lastBonusLifeTime = getLastBonusLifeTime(state)

        if (!lastBonusLifeTime) {
            await dispatch(
                postDataLiveToFb({
                    lives: currentLives,
                    lastBonusLifeTime: new Date().getTime(),
                })
            )

            return
        }

        const currentTime = new Date().getTime()
        const bonusLife = Math.floor(
            (currentTime - lastBonusLifeTime) / 1000 / (Lives.bonusDurationMins * 60)
        )
        let lives = bonusLife + currentLives

        if (lives > Lives.livesCapacity) lives = Lives.livesCapacity

        const correctData = {
            lives,
            lastBonusLifeTime: lives === currentLives ? lastBonusLifeTime : new Date().getTime(),
        }

        await dispatch(postDataLiveToFb(correctData))
    } catch (error) {
        //
    }
}

export const reFillLives = () => async (dispatch) => {
    try {
        const correctData = {
            lives: Lives.livesCapacity,
            lastBonusLifeTime: new Date().getTime(),
        }

        await dispatch(postDataLiveToFb(correctData))
    } catch (error) {
        //
    }
}

const postDataLiveToFb = (correctData) => async (dispatch) => {
    const { player } = window.game
    const { playerId } = player.getPlayer()

    dispatch({
        type: LIVES_UPDATED,
        payload: { data: correctData },
    })

    await window.FBInstant.player.setDataAsync({ lives: correctData })

    writeByKeyLocalStorage(`${Match.LivesStore}-${playerId}`, correctData)
}
