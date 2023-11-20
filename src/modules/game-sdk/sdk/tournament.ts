abstract class Tournament implements GameSDK.Tournaments {
    public sdk: GameSDK.Tournaments
    public constructor(sdk: GameSDK.Tournaments) {
        this.sdk = sdk
    }

    public abstract createAsync(
        payload: GameSDK.CreateTournamentPayload
    ): Promise<GameSDK.Tournament>

    public abstract shareAsync(payload: GameSDK.ShareTournamentPayload): Promise<void>

    public abstract joinAsync(tournamentID: string): Promise<void>

    public abstract postScoreAsync(score: number): Promise<void>

    public abstract getTournamentsAsync(): Promise<GameSDK.Tournament[]>
}

export default Tournament
