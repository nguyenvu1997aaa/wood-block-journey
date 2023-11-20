class InvalidMatchId extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidMatchId'
        this.message = message || 'Invalid match id'
        this.payload = payload
    }
}

export default InvalidMatchId
