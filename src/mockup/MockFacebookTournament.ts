import { FacebookTournament } from '@/FBInstantExtra'

const { LeaderboardId } = GameCore.Configs.LeadersBoard

class TournamentMock implements FBInstant.Tournament {
    private id: number
    private title: string
    private contextId: string
    private payload: string
    private endTime: number

    constructor(id: number) {
        this.id = id
        this.title = `${this.id}'s Tournament`
        this.contextId = '000-' + this.id

        this.payload = JSON.stringify({
            playerId: '1213456',
            playerName: 'Player',
            leaderboardId: LeaderboardId,
        })

        // * End time is max in 7 days
        // ? format: getEndTime of sdk fb

        const days = id > 7 ? 7 : id
        this.endTime = Math.round((Date.now() + 1000 * 60 * 60 * 24 * days) / 1000)
    }

    public getID(): number {
        return this.id
    }

    public getTitle(): string {
        return this.title
    }

    public getPayload(): string | null {
        return this.payload
    }

    public getEndTime(): number {
        return this.endTime
    }

    public getContextID(): string {
        return this.contextId
    }
}

class MockFacebookTournament extends FacebookTournament {
    private tournaments: FBInstant.Tournament[]
    private tournamentData: Record<string, FBInstant.Tournament>

    constructor() {
        super()

        this.tournaments = new Array(1).fill(null).map((_, index) => new TournamentMock(index + 1))

        this.tournamentData = {}

        this.tournaments.map((tournament) => {
            this.tournamentData[`${tournament.getID()}`] = tournament
        })
    }

    public async createAsync(
        _payload: FBInstant.CreateTournamentPayload
    ): Promise<FBInstant.Tournament> {
        return new Promise((resolve) => {
            const id = this.tournaments.length + 1
            const newTournament = new TournamentMock(id)

            this.tournaments.push(newTournament)
            this.tournamentData[id] = newTournament

            resolve(newTournament)
        })
    }

    public async shareAsync(_payload: FBInstant.ShareTournamentPayload): Promise<void> {
        return new Promise((resolve) => resolve())
    }

    public async joinAsync(tournamentID: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const isExist = tournamentID in this.tournamentData

            if (isExist) {
                resolve()
                return
            }

            reject(new Error('Tournament not found'))
        })
    }

    public async getTournamentsAsync(): Promise<FBInstant.Tournament[]> {
        const tournaments = [...this.tournaments]
        return tournaments
    }
}

export default MockFacebookTournament
