/**
 * @param value value
 * @param maxLength
 * @param fillChar - a character - default is '0'
 * @returns string
 * example: padEnd(15, 5) => '15000'
 */
const padEnd = (value: number, maxLength: number, fillChar = '0'): string => {
    let res = value.toString()
    const valueLength = res.length
    for (let i = 0; i < maxLength - valueLength; i++) {
        res = res + fillChar
    }
    return res
}

export default padEnd
