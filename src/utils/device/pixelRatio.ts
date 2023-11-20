const func = (): number => {
    return Math.round(window.devicePixelRatio) || 1
}

export default func
