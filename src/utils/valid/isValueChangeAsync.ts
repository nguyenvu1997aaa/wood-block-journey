interface IOptions {
    timeout?: number
    checkInterval?: number
}

type TCheck = string | number | boolean | Function

const func = (from: TCheck, to: TCheck, options?: IOptions): Promise<boolean> => {
    const { timeout = 1000, checkInterval = 100 } = options || {}

    return new Promise((resolve) => {
        const waitValueChange = setInterval(() => {
            const aFrom = typeof from === 'function' ? from() : from
            const aTo = typeof to === 'function' ? to() : to

            if (aFrom !== aTo) return

            clearInterval(waitValueChange)
            resolve(true)
        }, checkInterval)

        if (timeout > 0) {
            setTimeout(() => {
                clearInterval(waitValueChange)
                resolve(false)
            }, timeout)
        }
    })
}

export default func
