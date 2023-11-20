const func = (key: unknown): key is PropertyKey => {
    return ['string', 'number', 'symbol'].indexOf(typeof key) > -1
}

export default func
