const func = (payload: TObject): string => {
    // convert payload to params
    const params = Object.keys(payload).reduce((accumulator, key) => {
        const value = payload[key]
        if (value !== undefined) {
            accumulator.push(`${key}=${value}`)
        }
        return accumulator
    }, [] as string[])

    // return params joined with &
    return params.join('&')
}

export default func
