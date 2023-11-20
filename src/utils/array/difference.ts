const func = <S>(source: S[], target: unknown[]): S[] => {
    return source.filter((x) => !target.includes(x))
}

export default func
