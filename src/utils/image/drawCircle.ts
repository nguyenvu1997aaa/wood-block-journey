interface IPayloadCircle {
    scene: Phaser.Scene
    key: string
    newKey?: string
}

/**
 * Update a image in a texture source of Phaser to a circle image
 * Payload has properties: {@link IPayloadCircle}
 * Which radius is from 0 to 100 percent
 */
const drawCircle = (payload: IPayloadCircle): boolean => {
    const { scene, key, newKey } = payload
    const source = scene.textures.get(key).getSourceImage() as HTMLImageElement
    if (!source) return false
    const size = Math.min(source.width, source.height)
    if (!newKey) {
        scene.textures.removeKey(key)
    }
    const photo = scene.textures.createCanvas(newKey || key, size, size)

    const ctx = photo.context

    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false)
    ctx.clip()

    photo.draw((source.width - size) / 2, (source.height - size) / 2, source)
    return true
}

export default drawCircle
