class InvalidOpponentId extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidOpponentId'
        this.message = message || 'Invalid opponent id'
        this.payload = payload
    }
}

export default InvalidOpponentId
