class InvalidScore extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidScore'
        this.message = message || 'The score is not valid'
        this.payload = payload
    }
}

export default InvalidScore
