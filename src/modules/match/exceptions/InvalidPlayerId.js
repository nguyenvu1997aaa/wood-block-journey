class InvalidPlayerId extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidPlayerId'
        this.message = message || 'The playerId is not valid'
        this.payload = payload
    }
}

export default InvalidPlayerId
