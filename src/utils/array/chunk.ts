const func = <A>(array: A[], size = 1): A[][] => {
    return Array.from({ length: Math.ceil(array.length / size) }, (v, i) => {
        return array.slice(i * size, i * size + size)
    })
}

export default func
