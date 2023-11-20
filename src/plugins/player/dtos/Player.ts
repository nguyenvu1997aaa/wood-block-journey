import IMAGES from '@/game/constants/resources/images'

class PlayerDtos {
    private playerId: string
    private name: string
    private photo: string
    private locale: string

    constructor(playerId: string, name: string, photo?: string | null, locale?: string | null) {
        this.playerId = playerId
        this.name = name
        this.photo = photo || IMAGES.AVATAR.FILE
        this.locale = locale || 'en_US'
    }

    toObject(): TPlayer {
        return {
            playerId: this.playerId,
            name: this.name,
            photo: this.photo,
            locale: this.locale,
        }
    }
}

export default PlayerDtos
