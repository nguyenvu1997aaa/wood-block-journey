const unique = <V>(value: V, index: number, self: V[]): boolean => {
    return self.indexOf(value) === index && value !== null && value !== undefined
}

const func = <A>(array: A[]): A[] => {
    return array.filter(unique)
}

export default func
