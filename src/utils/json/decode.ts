const func = (string: string): unknown => {
    try {
        return JSON.parse(string)
    } catch (error) {
        return null
    }
}

export default func
