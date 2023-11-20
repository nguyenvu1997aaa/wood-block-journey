import hasOwn from './hasOwn'

const func = (data: TObject): Record<string, string> => {
    const inverse: Record<string, string> = {}

    Object.keys(data).forEach((k) => {
        if (!hasOwn(data, k)) return

        const key = data[k]
        if (typeof key !== 'string') return

        inverse[key] = k
    })

    return inverse
}

export default func
