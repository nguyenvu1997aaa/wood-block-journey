export const toUpperCamelCase = (str: string) => {
    const text = str.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    return text.substr(0, 1).toUpperCase() + text.substr(1)
}

export const toCamelCase = (str: string) => {
    const text = str.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    return text.substr(0, 1).toLowerCase() + text.substr(1)
}
