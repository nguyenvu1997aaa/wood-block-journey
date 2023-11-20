const DEBUG = import.meta.env.SNOWPACK_PUBLIC_DEBUG

const func = (): boolean => {
    const isEnableDebug = DEBUG === 'true'

    return isEnableDebug
}

export default func
