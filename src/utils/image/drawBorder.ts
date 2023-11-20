interface IPayloadBorder {
    scene: Phaser.Scene
    key: string
    newKey?: string
    width?: number
    height?: number
    radius: number
}

/**
 * Update a image in a texture source of Phaser to a border image
 * Payload has properties: {@link IPayloadBorder}
 * Which radius is from 0 to 100 percent
 */
const drawBorder = (payload: IPayloadBorder): boolean => {
    const { scene, key, newKey, radius } = payload
    let { width, height } = payload

    const source = scene.textures.get(key).getSourceImage() as HTMLImageElement

    if (!source) return false
    if (!width) width = source.width
    if (!height) height = source.height
    if (!newKey) {
        scene.textures.removeKey(key)
    }
    const photo = scene.textures.createCanvas(newKey || key, width, height)

    const ctx = photo.context
    const size = Math.min(width, height)
    const mdRadius = ((size / 100) * radius) / 2

    const x = 0
    const y = 0
    ctx.beginPath()

    // Draw image with round corner
    ctx.moveTo(x + mdRadius, y)
    ctx.lineTo(x + width - mdRadius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + mdRadius)
    ctx.lineTo(x + width, y + height - mdRadius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - mdRadius, y + height)
    ctx.lineTo(x + mdRadius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - mdRadius)
    ctx.lineTo(x, y + mdRadius)
    ctx.quadraticCurveTo(x, y, x + mdRadius, y)
    ctx.closePath()
    ctx.clip()

    photo.draw(0, 0, source)

    return true
}

export default drawBorder
