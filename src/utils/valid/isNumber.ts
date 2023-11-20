const func = (data: unknown): data is number => typeof data === 'number'

export default func
