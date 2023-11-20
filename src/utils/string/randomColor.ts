const letters = '0123456789ABCDEF'

const func = (prefix = '0x'): string => {
    let color = prefix
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

export default func
