class WideFrameRenderFail extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'WideFrameRenderFail'
        this.message = message || 'Wide frame render fail'
        this.payload = payload
    }
}

export default WideFrameRenderFail
