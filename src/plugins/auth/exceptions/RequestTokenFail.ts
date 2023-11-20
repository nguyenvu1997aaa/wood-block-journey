class RequestTokenFail extends Error {
    public payload: TObject

    constructor(message?: string, payload?: TObject) {
        super(message)

        this.name = 'RequestTokenFail'
        this.message = message || 'Request token fail'
        this.payload = payload || {}
    }
}

export default RequestTokenFail
