const func = (hash: string): string => {
    try {
        return atob(hash)
    } catch (error) {
        return ''
    }
}

export default func
