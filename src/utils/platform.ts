export const getPlatForm = () => {
    const { facebook } = window.game

    if (!facebook) {
        return null
    }

    return facebook.platform?.toLowerCase() || ''
}

export const isIos = () => {
    const platform = getPlatForm()

    if (platform === 'ios') return true

    return false
}

export const isAndroid = () => {
    const platform = getPlatForm()

    if (platform === 'android') return true

    return false
}

export const isDesktop = () => {
    const platform = getPlatForm()

    if (platform == 'web') return true

    return false
}
