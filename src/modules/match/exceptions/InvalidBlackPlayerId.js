class InvalidBlackPlayerId extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidBlackPlayerId'
        this.message = message || 'Invalid black player id'
        this.payload = payload
    }
}

export default InvalidBlackPlayerId
