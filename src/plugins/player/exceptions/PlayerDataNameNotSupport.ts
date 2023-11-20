class PlayerDataNameNotSupport extends Error {
    public payload: TObject

    constructor(message?: string, payload?: TObject) {
        super(message)

        this.name = 'PlayerDataNameNotSupport'
        this.message = message || 'The name of player data is not supported'
        this.payload = payload || {}
    }
}

export default PlayerDataNameNotSupport
