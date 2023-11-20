import memoize from 'micro-memoize'

const getValue = memoize(<V extends TObject>(code: string, valueMap: V): string => {
    if (typeof code === 'string') {
        const data = valueMap[code.toLowerCase()]
        if (typeof data === 'string') return data
    }

    return '?'
})

const findGroups = memoize((str: string): string[] => {
    let group = null
    const groups = []

    const findGroup = /:([A-Z0-9?]+)/gm

    while ((group = findGroup.exec(str)) !== null) {
        groups.push(group[1])
    }

    return groups
})

const findHash = memoize((str: string): string[] => {
    let codes = null
    const hash = []

    const findHash = /([0-9]+[A-Z?]{1}|[A-Z?]{1})/gm

    while ((codes = findHash.exec(str)) !== null) {
        const code = codes[0]

        if (code.length >= 2) {
            const { length } = code
            const loop = code.slice(0, length - 1)
            const key = code[length - 1]

            const list = new Array(+loop).fill(key)

            hash.push(...list)
            continue
        }

        hash.push(code)
    }

    return hash
})

const func = <C extends TObject>(hash: string, codeMap: C): Record<number, C> => {
    const str = hash

    const valueMap = GameCore.Utils.Object.invert(codeMap)

    const data: Record<number, C> = {}

    let codeIndex = 0
    let groupIndex = 0

    const groups = findGroups(str)

    groups.forEach((hashList) => {
        codeIndex = 0
        groupIndex++

        if (!data[groupIndex]) {
            data[groupIndex] = {} as C
        }

        const hash = findHash(hashList)

        hash.forEach((code) => {
            codeIndex++

            data[groupIndex][codeIndex] = getValue(code, valueMap)
        })
    })

    return data
}

export default func
