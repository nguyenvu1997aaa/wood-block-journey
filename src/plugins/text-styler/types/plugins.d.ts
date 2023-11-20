type WebfontService = 'google' | 'local'
type FontType = 'opentype' | 'truetype'

interface WebfontPayload {
    type: WebfontService
    fontName: string
    fontType?: FontType
    fontWeight?: number
    character?: string
}

interface ITextStyler {
    addFont: (payload: WebfontPayload) => void
}
