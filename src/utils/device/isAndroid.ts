// * Simple check if the device is android from FBInstant
const func = (): boolean => {
    const platform = FBInstant.getPlatform()
    return platform === 'ANDROID'
}

export default func
