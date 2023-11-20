import isObject from '../valid/isObject'

const isNotClear = (value: unknown): boolean => value === undefined || value === null

const func = <O extends Record<string, unknown>>(object: O): O => {
    if (!isObject(object)) return object

    for (const key in object) {
        if (isNotClear(object[key])) {
            delete object[key]
        }

        const value = object[key]
        if (isObject(value)) {
            object[key] = func(value)
        }
    }

    return object
}

export default func
