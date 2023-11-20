const func = (radix = 16): string => {
    const s = (i: number) => Math.floor(i).toString(radix)

    const time = s(Date.now() / 1000)
    return time + ' '.repeat(radix).replace(/./g, () => s(Math.random() * radix))
}

export default func
