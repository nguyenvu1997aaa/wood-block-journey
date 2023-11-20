const func = (data: unknown): string => {
    try {
        return JSON.stringify(data, null, 0)
    } catch (error) {
        return ''
    }
}

export default func
