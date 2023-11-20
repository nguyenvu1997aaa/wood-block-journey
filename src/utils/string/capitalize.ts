const func = (str: string): string => {
    if (!str) return str
    return str[0].toUpperCase() + str.slice(1)
}

export default func
