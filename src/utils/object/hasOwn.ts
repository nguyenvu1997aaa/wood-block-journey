const func = <O extends Object, K extends PropertyKey>(
    obj: O,
    key: K
): obj is O & Record<K, unknown> => {
    return Object.prototype.hasOwnProperty.call(obj, key)
}

export default func
