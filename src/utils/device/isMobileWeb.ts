// * Simple check if the device is a mobile web from FBInstant
const func = (): boolean => {
    const platform = FBInstant.getPlatform()
    return platform === 'MOBILE_WEB'
}

export default func
