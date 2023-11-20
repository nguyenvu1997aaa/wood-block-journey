class InvalidOpponentId extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidOpponentId'
        this.message = message || 'This opponentId is not valid'
        this.payload = payload
    }
}

export default InvalidOpponentId
