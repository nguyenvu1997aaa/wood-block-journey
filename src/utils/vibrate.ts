import { sleepAsync } from './DateTime'

export const isSupportVibrateApi = () => {
    const Device = GameCore.Utils.Device
    const { vibrate } = window.navigator

    return (
        (Device.isAndroid() && typeof vibrate === 'function') ||
        (Device.isMobileWeb() && typeof vibrate === 'function') ||
        Device.isIOS()
    )
}

const vibrate = (value: number) => {
    try {
        if (!isSupportVibrateApi()) return false

        const Device = GameCore.Utils.Device

        if (Device.isAndroid() || Device.isMobileWeb()) {
            vibrateAndroid(value)
        }
    } catch (error) {
        // sendException(error);
    }
}

const vibrateIos = async (value: number) => {
    const number = Math.round(value / 80)

    let count = 0

    const hapticHandle = async () => {
        try {
            await FBInstant.performHapticFeedbackAsync()
        } catch {
            console.log('can not haptic')
        }
    }

    while (count < number) {
        const hapticPromise = hapticHandle()
        const sleepPromise = sleepAsync(80)
        count += 1
        await Promise.all([hapticPromise, sleepPromise])
    }
}

const vibrateAndroid = (value: number) => {
    window.navigator.vibrate(0)
    window.navigator.vibrate(value)
}

export default vibrate
