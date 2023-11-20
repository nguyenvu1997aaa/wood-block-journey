class InvalidMatchStatus extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidMatchStatus'
        this.message = message || 'The match status is not valid'
        this.payload = payload
    }
}

export default InvalidMatchStatus
