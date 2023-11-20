import ReuseScroller from '@/game/components/ReuseScroller'
import SPRITES from '@/game/constants/resources/sprites'
import {
    LEADERBOARD_TYPE_FRIEND,
    LEADERBOARD_TYPE_GLOBAL,
} from '@/modules/leader-boards/constants/LeaderboardsTypes'
import Leader, { ILeaderPayload } from './Leader'

const { FRAME } = SPRITES.DEFAULT

class Leaders extends Phaser.GameObjects.Container {
    private currentPlayerId: string

    private scroller: ReuseScroller

    constructor(scene: Phaser.Scene) {
        super(scene)

        const { player } = this.scene
        this.currentPlayerId = player.getPlayerId()

        this.createReuseScroller()

        this.scene.add.existing(this)
    }

    private createReuseScroller() {
        let height = 335
        let marginTop = 0

        if (this.scene.world.isLandscape()) {
            height = 290
            marginTop = -20
        }

        this.scroller = new ReuseScroller(this.scene, {
            classType: Leader,
            listConfigs: [],
            width: 310,
            height,
            padding: 0,
            marginTop,
            marginBottom: 0,
            maxScrollOver: 0.3,
            scrollingBackRate: 5,
            useMask: true,
        })

        // ? setTint is't working on canvas mode
        if (this.scene.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
            this.scroller.createBound(
                SPRITES.DEFAULT.KEY,
                SPRITES.DEFAULT.FRAME.BLANK,
                40,
                0xfdf3d3
            )
        }

        this.scroller.createMask()
        this.scroller.setPosition(0, 0)
        this.add(this.scroller)
    }

    public updateData(data: ILeaderPayload, tabId: string): void {
        const leaders = Object.values(data) || []

        if (leaders.length < 1) {
            return
        }

        const leadersByRank = leaders.sort((a, b) => +b.score - +a.score)

        const leadersData = []
        let count = 0
        const { lang } = this.scene.game

        for (const player of leadersByRank) {
            const { playerId, photo, score, name, rank } = player

            if (!playerId) continue

            const isPlayer = this.currentPlayerId === playerId
            const scoreRight = tabId === LEADERBOARD_TYPE_GLOBAL
            const useChallenge = tabId === LEADERBOARD_TYPE_FRIEND

            const payload: ILeaderPayload = {
                playerId,
                photo,
                name,
                rank,
                score,
                scoreRight,
                useChallenge,
                isHighlight: false,
                backgroundFrame: `${FRAME.PREFIX_LEADERBOARD_BG_ITEM}${count}`,
            }

            leadersData.push(payload)

            count++

            if (count >= 2) count = 0
        }

        this.scroller.updateConfig(leadersData)

        this.showLeaders()
    }

    public removeLeaders(): void {
        this.scroller.updateConfig([])
    }

    private getLeaders(): Leader[] {
        return this.scroller.getChildren() as Leader[]
    }

    private showLeaders(): void {
        const leaders = this.getLeaders()

        if (leaders.length < 1) {
            // this.scene.isSwitchable = true
            // this.scene.board.showMessage(true, this.scene.lang.Text.LEADERBOARD_EMPTY)
            return
        }

        const numberOfLeaderPlayShow = Math.min(leaders.length, 6)
        const duration = 300

        for (let index = 0; index < numberOfLeaderPlayShow; index++) {
            const leader = leaders[index]
            if (!leader) continue

            leader.setVisible(true)
            leader.runShowUpAnimation(index, duration)
        }

        const durationAllAnimation = duration + numberOfLeaderPlayShow * 100 + 50 * 5

        this.scene.time.delayedCall(durationAllAnimation, () => {
            // this.scene.isSwitchable = true
            this.scroller.setEnable(true)
        })
    }
}

export default Leaders
