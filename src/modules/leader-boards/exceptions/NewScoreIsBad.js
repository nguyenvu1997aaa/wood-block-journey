class NewScoreIsBad extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'NewScoreIsBad'
        this.message = message || 'The new score is bad'
        this.payload = payload
    }
}

export default NewScoreIsBad
