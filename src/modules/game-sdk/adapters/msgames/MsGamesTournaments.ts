import Tournament from '../../sdk/tournament'

class MsGamesTournament extends Tournament {
    public createAsync(_payload: GameSDK.CreateTournamentPayload): Promise<GameSDK.Tournament> {
        return Promise.reject(new Error('Unsupported'))
    }

    public shareAsync(_payload: GameSDK.ShareTournamentPayload): Promise<void> {
        return Promise.reject(new Error('Unsupported'))
    }

    public joinAsync(_tournamentID: string): Promise<void> {
        return Promise.reject(new Error('Unsupported'))
    }

    public postScoreAsync(_score: number): Promise<void> {
        return Promise.reject(new Error('Unsupported'))
    }

    public getTournamentsAsync(): Promise<GameSDK.Tournament[]> {
        return Promise.reject(new Error('Unsupported'))
    }
}

export default MsGamesTournament
