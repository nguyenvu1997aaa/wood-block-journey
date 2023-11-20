class LoadResourceFail extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'LoadResourceFail'
        this.message = message || 'Load resource fail'
        this.payload = payload
    }
}

export default LoadResourceFail
