export const func = (str: string): string => {
    try {
        // TODO: btoa is deprecated
        return btoa(str)
    } catch (error) {
        return ''
    }
}

export default func
