import SlideInAnimation from '@/game/animations/entrances/SlideIn'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import { challengeFriend, startMatchingGroupModeGame } from '@/modules/match/actions/gameplay'
import { shareLeaderboards } from '@/redux/actions/share'
import getLanguageCode from '@/utils/getLanguageCode'
import LeaderBlock, { ILeaderPayload } from './LeaderBlock'

export interface ILeadersBarPayload {
    playerId: string
    leaders: ILeaderPayload[]
}

const { FRAME } = SPRITES.DEFAULT

class LeadersBar extends Phaser.GameObjects.Container {
    public scene: Phaser.Scene

    private payload: ILeadersBarPayload

    public leaderBlocks: Phaser.GameObjects.Group

    public entrancesAnimation: SlideInAnimation

    private listLeaderBlocks: LeaderBlock[]

    constructor(scene: Phaser.Scene, payload?: ILeadersBarPayload) {
        super(scene)

        this.scene = scene

        this.setName('LeadersBar')
        this.listLeaderBlocks = []

        this.createLeaderBlocks()
        this.createEntrancesAnimation()

        if (payload) {
            this.updateInfo(payload)
        }

        this.scene.add.existing(this)
    }

    public updateInfo(payload: ILeadersBarPayload) {
        this.payload = payload
        let isHasNewObj = false
        const { playerId, leaders } = this.payload
        const Text = this.scene.lang.Text

        leaders.forEach((data) => {
            const leaderBlock = this.leaderBlocks.getFirstDead(true) as LeaderBlock

            leaderBlock.updateInfo(data)

            if (data.score === -1) {
                leaderBlock.setFrameButtonPlay(FRAME.BUTTON_RANDOM)
                leaderBlock.onClick = this.handleMatchingGroup
            } else if (data.playerId === this.payload.playerId) {
                leaderBlock.onClick = this.handleShareLeaderboard
            } else {
                leaderBlock.setFrameButtonPlay(FRAME.BUTTON_PLAY)
                leaderBlock.onClick = this.handleChallengeFriend(data.playerId)
            }

            this.add(leaderBlock)

            leaderBlock.setVisible(true)
            leaderBlock.setActive(true)

            if (this.listLeaderBlocks.indexOf(leaderBlock) < 0) {
                isHasNewObj = true
            }
        })
        this.alignBlocks()

        if (isHasNewObj) {
            this.listLeaderBlocks = this.leaderBlocks
                .getChildren()
                .filter((o) => o.active) as LeaderBlock[]
            this.createEntrancesAnimation()
        }

        this.runAnimation()
    }

    public killAndHideAll() {
        this.removeAll(false)
        this.leaderBlocks.getChildren().forEach((child) => this.leaderBlocks.killAndHide(child))
    }

    public runAnimation(): void {
        this.leaderBlocks.setAlpha(0)
        this.entrancesAnimation.play()
    }

    private createEntrancesAnimation(): void {
        this.entrancesAnimation = new SlideInAnimation({
            targets: this.listLeaderBlocks,
            delay: this.scene.tweens.stagger(50, { start: 400 }),
            props: {
                y: { from: 100, to: 0 },
                alpha: { from: 0, to: 1 },
            },
        })
    }

    private alignBlocks(): void {
        const space = 75
        const length = this.leaderBlocks.getLength()

        const posX = -(space * ((length - 1) / 2))
        this.leaderBlocks.setX(posX, space)
    }

    private createLeaderBlocks(): void {
        this.leaderBlocks = this.scene.add.group({ classType: LeaderBlock })
    }

    private handleChallengeFriend =
        (playerId: string): Function =>
        (): void => {
            this.scene.storage.dispatch(challengeFriend(playerId))
        }

    private handleShareLeaderboard = (): void => {
        this.scene.audio.playSound(SOUND_EFFECT.BUTTON_CLICK)

        this.scene.storage.dispatch(shareLeaderboards())
    }

    private handleMatchingGroup = async () => {
        const { player, storage, game, lang } = this.scene

        try {
            game.globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                message: lang.Text.LOADING,
                loading: true,
            })

            const currPlayer = player.getPlayer()

            let tag = 'global'
            const langCode = getLanguageCode(currPlayer.locale)

            if (langCode === 'en') {
                tag = 'en'
            }

            if (langCode === 'in') {
                tag = 'in'
            }

            const contextId = await this.scene.facebook.matchPlayer(tag)

            game.globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)

            if (!contextId) return

            storage.dispatch(startMatchingGroupModeGame())
        } catch (error) {
            game.globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
        }
    }
}

export default LeadersBar
