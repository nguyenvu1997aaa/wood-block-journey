import Player from '@/plugins/player/dtos/Player'
import IMAGES from '@/game/constants/resources/images'

export const SampleOpponent = new Player('10', 'Your Friend', IMAGES.AVATAR.FILE).toObject()
