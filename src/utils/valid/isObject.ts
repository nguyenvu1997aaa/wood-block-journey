const func = (data: unknown): data is TObject => {
    const isValidObject = typeof data === 'object' || typeof data === 'function'
    const isArray = Array.isArray(data)

    return data !== null && isValidObject && !isArray
}

export default func
