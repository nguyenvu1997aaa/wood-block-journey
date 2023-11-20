// * Simple check if the device is ios from FBInstant
const func = (): boolean => {
    const platform = FBInstant.getPlatform()
    return platform === 'IOS'
}

export default func
