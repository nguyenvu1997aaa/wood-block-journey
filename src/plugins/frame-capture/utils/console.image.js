/**
 * Dubiously created by Adrian Cooney
 * http://adriancooney.github.io
 * Edited: Mr.Won;
 */

/**
 * Since the console.log doesn't respond to the `display` style,
 * setting a width and height has no effect. In fact, the only styles
 * I've found it responds to is font-size, background-image and color.
 * To combat the image repeating, we have to get a create a font bounding
 * box so to speak with the unicode box characters. EDIT: See Readme.md
 *
 * @param  {int} width  The height of the box
 * @param  {int} height The width of the box
 * @return {object}     {string, css}
 */
const getBox = (width, height) => ({
    string: '+',
    style:
        'font-size: 1px; padding: ' +
        Math.floor(height / 2) +
        'px ' +
        Math.floor(width / 2) +
        'px;',
})

/**
 * Display an image in the console.
 * @param  {string} url The url of the image.
 * @param  {int} scale Scale factor on the image
 * @return {null}
 */
const logImage = (url, scale = 1) => {
    const img = new Image()

    img.onload = function () {
        const dim = getBox(this.width * scale, this.height * scale)
        console.info(
            `%c ${dim.string}`,
            `${
                dim.style
            } background: transparent url(${url}) no-repeat center center; background-size: ${
                this.width * scale
            }px ${this.height * scale}px;`
        )
    }

    img.src = url
}

export default logImage
