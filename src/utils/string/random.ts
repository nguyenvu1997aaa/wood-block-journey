const func = (len: number, startWith?: string): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*#%&!'
    let word = ''

    let wordLen = len
    if (startWith != undefined) {
        wordLen -= startWith.length
        word += startWith
    }

    for (let i = 0; i < wordLen; i++) {
        const index = Math.floor(Math.random() * letters.length)
        word += letters.charAt(index)
    }

    return word
}

export default func
