class InvalidWhitePlayerId extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidWhitePlayerId'
        this.message = message || 'Invalid white player id'
        this.payload = payload
    }
}

export default InvalidWhitePlayerId
