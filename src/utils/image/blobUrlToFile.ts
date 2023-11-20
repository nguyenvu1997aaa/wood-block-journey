const blobUrlToFile = async (blobUrl: string, fileName: string): Promise<File | null> => {
    const blob = await fetch(blobUrl)
        .then((r) => r.blob())
        .catch(() => null)

    if (!blob) return null

    return new File([blob], fileName)
}

export default blobUrlToFile
