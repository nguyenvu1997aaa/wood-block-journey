let img = new Image()

const blobToHtmlImage = (blob: Blob, forceNew = true): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
        if (forceNew) img = new Image()

        img.onload = () => {
            resolve(img)
        }
        img.onerror = () => {
            resolve(null)
        }

        img.src = URL.createObjectURL(blob)
    })
}

export default blobToHtmlImage
