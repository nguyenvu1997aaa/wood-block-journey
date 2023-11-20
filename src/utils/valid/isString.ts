const func = (data: unknown): data is string => typeof data === 'string'

export default func
