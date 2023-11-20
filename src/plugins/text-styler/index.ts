import WebFontFile from './WebFontFile'

class TextStyler extends Phaser.Plugins.ScenePlugin implements ITextStyler {
    public addFont(payload: WebfontPayload): void {
        const file = new WebFontFile(this.scene.load, payload)
        this.scene.load.addFile(file)
    }
}

export default TextStyler
