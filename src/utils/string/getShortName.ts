const func = (name: string, length: number): string => {
    const nameArr = name.split(' ')
    const firstLastNameArr = nameArr.length <= 1 ? [...nameArr] : [nameArr[0], nameArr.pop()]
    const firstLastName = firstLastNameArr.join(' ')
    const lastIndexOfSpace = firstLastName.lastIndexOf(' ') || 0
    const lastIndex = lastIndexOfSpace >= 0 ? lastIndexOfSpace : length
    const shortName =
        firstLastName.length > length ? firstLastName.substring(0, lastIndex) : firstLastName
    return shortName.substring(0, length)
}
export default func
