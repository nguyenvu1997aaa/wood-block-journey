class RequestTimeout extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'RequestTimeout'
        this.message = message || 'This request is timeout'
        this.payload = payload
    }
}

export default RequestTimeout
