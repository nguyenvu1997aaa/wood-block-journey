import memoize from 'micro-memoize'

const getCode = memoize((value: string, codeMap: TObject): string => {
    const code = codeMap[value]

    if (typeof code === 'string') {
        return `${code.toUpperCase()}`
    }

    return '?'
})

const func = (data: TObject, codeMap: TObject, isRecursive = false): string => {
    let str = ''

    if (!GameCore.Utils.Valid.isObject(data)) return str

    let lastCode = ''
    let lastIndex = 1

    for (const key in data) {
        if (!GameCore.Utils.Object.hasOwn(data, key)) continue

        const value = data[key]

        if (GameCore.Utils.Valid.isObject(value)) {
            str += `:${func(value, codeMap, true)}`
            continue
        }

        if (!GameCore.Utils.Valid.isString(value)) continue

        const code = getCode(value, codeMap)

        if (code === lastCode) {
            lastIndex++
            str = str.slice(0, -2)
        } else {
            lastIndex = 1
        }

        str += `${lastIndex}${code}`

        lastCode = code
    }

    str = str.replace(/1([A-Z])/g, '$1')

    if (isRecursive) return str

    return str
}

export default func
