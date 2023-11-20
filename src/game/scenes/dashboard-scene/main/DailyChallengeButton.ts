import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'
import { checkIsToday } from '@/utils/DateTime'
import { getByKeyLocalStorage } from '@/utils/localStorage'

const { KEY, FRAME } = SPRITES.DEFAULT

const { Match } = GameCore.Configs

class DailyChallengeButton extends Button {
    private suggestDailyMode: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_MINOR)

        this.button.setWorldSize(62, 53)

        this.setName('DailyChallenge')

        this.createIcon()

        this.createSuggestDailyMode()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_DAILY,
        })

        icon.setWorldSize(35, 35)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this, 0.5, -2.5)
    }

    private createSuggestDailyMode() {
        this.suggestDailyMode = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_DOT_RED,
        })

        this.suggestDailyMode.setWorldSize(17, 17)

        this.suggestDailyMode.setVisible(false)

        this.add(this.suggestDailyMode)

        Phaser.Display.Align.In.Center(this.suggestDailyMode, this, 28, -25)
    }

    public checkSuggestDailyMode() {
        const { player } = window.game
        const { playerId } = player.getPlayer()
        const journeyMatch = getByKeyLocalStorage(`${Match.JourneyMatchStore}-${playerId}`) || {}
        const updateAt = Object(journeyMatch).updateAt || 0

        if (checkIsToday(updateAt)) {
            this.suggestDailyMode.setVisible(false)
            return
        }
        this.suggestDailyMode.setVisible(true)
    }
}

export default DailyChallengeButton
