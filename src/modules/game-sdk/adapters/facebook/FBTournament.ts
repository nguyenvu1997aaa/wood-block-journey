import Tournament from '../../sdk/tournament'

class FBTournament extends Tournament {
    public createAsync(payload: GameSDK.CreateTournamentPayload): Promise<GameSDK.Tournament> {
        return this.sdk.createAsync(payload)
    }

    public shareAsync(payload: GameSDK.ShareTournamentPayload): Promise<void> {
        return this.sdk.shareAsync(payload)
    }

    public joinAsync(tournamentID: string): Promise<void> {
        return this.sdk.joinAsync(tournamentID)
    }

    public postScoreAsync(score: number): Promise<void> {
        return this.sdk.postScoreAsync(score)
    }

    public getTournamentsAsync(): Promise<GameSDK.Tournament[]> {
        return this.sdk.getTournamentsAsync()
    }
}

export default FBTournament
