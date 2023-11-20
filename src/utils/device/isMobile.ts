// * Simple check if the device is a mobile
const func = (): boolean => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export default func
