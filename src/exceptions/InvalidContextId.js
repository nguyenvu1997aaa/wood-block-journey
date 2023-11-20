class InvalidContextId extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidContextId'
        this.message = message || 'This contextId is not valid'
        this.payload = payload
    }
}

export default InvalidContextId
