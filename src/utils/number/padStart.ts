/**
 * @param value
 * @param maxLength
 * @param fillChar - a character - default is '0'
 * @returns a string value
 *
 * example: padStart(15, 5) => '00015'
 */
 const padStart = (value: number, maxLength: number, fillChar = '0'): string => {
    let res = value.toString()
    const valueLength = res.length
    for (let i = 0; i < maxLength - valueLength; i++) {
        res = fillChar + res
    }
    return res
}

export default padStart
