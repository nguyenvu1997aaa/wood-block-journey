const func = <F>(input: F): input is F => typeof input === 'function'

export default func
