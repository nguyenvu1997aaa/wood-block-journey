const base64ToFile = (base64: string, filename: string): File | null => {
    const arr = base64.split(',')

    const regex = arr[0].match(/:(.*?);/)
    if (!regex) return null

    const mime = regex[1]
    const bstr = atob(arr[arr.length - 1])

    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
}

export default base64ToFile
