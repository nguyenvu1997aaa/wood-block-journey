class CurrentTournamentScoreIsNotBest extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'CurrentTournamentScoreIsNotBest'
        this.message = message || 'The new score is not best'
        this.payload = payload
    }
}

export default CurrentTournamentScoreIsNotBest
