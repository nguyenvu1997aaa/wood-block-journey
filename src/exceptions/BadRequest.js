class BadRequest extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'BadRequest'
        this.message = message || 'This request is bad'
        this.payload = payload
    }
}

export default BadRequest
