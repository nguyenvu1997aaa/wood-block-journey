class InvalidTileMap extends Error {
    constructor(message, payload) {
        super(message, payload)

        this.name = 'InvalidTileMap'
        this.message = message || 'This tile is not valid'
        this.payload = payload
    }
}

export default InvalidTileMap
