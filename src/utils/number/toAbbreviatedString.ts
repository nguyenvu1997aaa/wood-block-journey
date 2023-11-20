/**
 * @interface IAbbreviatedConfig
 * @param {number} fractionalDigits - number length in fraction digit - default is 0
 * @param {number} startAbbreviate - start calculate to abbreviated string, from 0 - 10000, default is 1000
 * @param {number} abbreviateStep - number of digits for each suffix step, default is 3 (jump to next suffix for each power of 1000)
 * @param {number} maxLength - max length of string
 * @param {boolean} removeLastZero - if you want to remove zero after dot, default is True
 * @param {number} suffixes - custom suffixes you want - default = ['', 'k', 'm', 'b', 't']
 */
interface IAbbreviatedConfig {
    fractionalDigits?: number
    startAbbreviate?: number
    abbreviateStep?: number
    maxLength?: number
    removeLastZero?: boolean
    suffixes?: string[]
}

/**
 * Convert long number into abbreviated string
 *
 * 1234 -> 1k, 1000000 -> 1m
 *
 * default config:
 *```typescript
 *      {
 *          fractionalDigits: 0,
 *          startAbbreviate: 1000,
 *          abbreviateStep: 3,
 *          maxLength: -1, // -1 is inf
 *          removeLastZero: true,
 *          suffixes: ['', 'k', 'm', 'b', 't'],
 *      }
 * ```
 * @param {number} value
 * @param {IAbbreviatedConfig} config
 * @returns abbreviated string of value
 *
 * @example
 * toAbbreviatedString(1234) => 1k
 * toAbbreviatedString(
 *      510000,
 *      {
 *          fractionalDigits: 5,
 *          startAbbreviate: 500,
 *          maxLength: 5,
 *          removeLastZero: true
 *      }
 * ) => 0.51m
 * toAbbreviatedString(
 *      5100000,
 *      {
 *          startAbbreviate: 500,
 *          abbreviateStep: 4,
 *          suffixes: ['','e','f']
 *      }
 * ) => 510e
 */
const toAbbreviatedString = (value: number, config?: IAbbreviatedConfig): string => {
    const {
        fractionalDigits = 0,
        startAbbreviate = 1000,
        abbreviateStep = 3,
        maxLength = -1,
        removeLastZero = true,
        suffixes = ['', 'k', 'm', 'b', 't', 'q'],
    } = config || {}
    const correctMaxLength = maxLength === -1 ? 99999999 : maxLength
    if (value >= startAbbreviate) {
        const temp = Math.floor(value / 10 ** abbreviateStep)
        const suffixNum = Math.floor((temp.toString().length - 1) / abbreviateStep) + 1
        const shortValue = value / (10 ** abbreviateStep) ** suffixNum

        const fractionalString = shortValue.toFixed(fractionalDigits)
        const numberLength = correctMaxLength - suffixes[suffixNum].length
        const numberString = fractionalString.substring(0, numberLength)

        return (removeLastZero ? removeZero(numberString) : numberString) + suffixes[suffixNum]
    }
    const fractionalString = value.toFixed(fractionalDigits)
    const numberLength = correctMaxLength - suffixes[0].length
    const numberString = fractionalString.substring(0, numberLength)

    return removeLastZero ? removeZero(numberString) : numberString + suffixes[0]
}

const removeZero = (value: string) => {
    if (value.indexOf('.') < 0) return value
    for (let i = value.length - 1; i >= 0; i--) {
        if (value[i] == '.') return value.substring(0, i)
        if (value[i] != '0') return value.substring(0, i + 1)
    }
    return value
}

export default toAbbreviatedString
