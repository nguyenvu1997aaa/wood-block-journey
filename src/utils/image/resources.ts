/**
 * Return `1` if use texture 1x.
 *
 * Return `2` if use texture 2x.
 * @returns {number} `1` or `2`
 */
const getImageScale = (): number => {
    if (GameCore.Utils.Device.isDesktop()) return 2

    const pixelRatio = GameCore.Utils.Device.pixelRatio()
    return pixelRatio > 1 ? 2 : 1
}

export default getImageScale
