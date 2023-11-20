class AdError extends Error {
    public code: string

    constructor(code: string, message: string) {
        super(message)

        this.code = code
        this.message = message
    }
}

export default AdError
