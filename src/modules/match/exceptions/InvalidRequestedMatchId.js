class InvalidRequestedMatchId extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidRequestedMatchId'
        this.message = message || 'The matchId in match data not matched with requested matchId'
        this.payload = payload
    }
}

export default InvalidRequestedMatchId
