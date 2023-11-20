const func = (data: unknown): data is boolean => typeof data === 'boolean'

export default func
