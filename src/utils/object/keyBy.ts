import hasOwn from './hasOwn'

const func = <O extends Record<string, unknown>>(list: O[], key: string): { [key: string]: O } => {
    if (!Array.isArray(list)) return {}

    const result: { [key: string]: O } = {}

    list.forEach((object) => {
        if (!hasOwn(object, key)) return
        const value = object[key]

        if (typeof value !== 'string') return
        result[value] = object
    })

    return result
}

export default func
