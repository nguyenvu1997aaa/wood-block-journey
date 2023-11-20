import ReuseScroller from '@/game/components/ReuseScroller'
import SPRITES from '@/game/constants/resources/sprites'
import JourneyScene from '../../..'
import LeaderItem, { iLeaderData } from './LeaderItem'

const { KEY, FRAME } = SPRITES.DEFAULT

class LeaderItems extends Phaser.GameObjects.Container {
    public scene: JourneyScene

    private scroller: ReuseScroller

    public scrollerValue: number

    private tweenMoveToRank: Phaser.Tweens.Tween

    constructor(scene: JourneyScene) {
        super(scene)

        this.scene = scene

        this.createReuseScroller()

        this.scene.add.existing(this)
    }

    private createReuseScroller() {
        let height = 190
        let marginTop = 0
        let marginBottom = 0

        if (this.scene.world.isLandscape()) {
            height = 150
            marginTop = -20
            marginBottom = -20
        }

        this.scroller = new ReuseScroller(this.scene, {
            classType: LeaderItem,
            listConfigs: [],
            width: 260,
            height,
            padding: 0,
            marginTop,
            marginBottom,
            maxScrollOver: 0.3,
            scrollingBackRate: 5,
            useMask: true,
        })

        // ? setTint is't working on canvas mode
        if (this.scene.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
            this.scroller.createBound(KEY, FRAME.BLANK, 40, 0xfdf3d3)
        }

        this.scroller.createMask()
        this.scroller.setPosition(0, 70)
        this.add(this.scroller)
    }

    public updateData(leaders: iLeaderData[], hasPlayerID?: string): void {
        const leadersData = []
        let count = 0

        if (leaders.length < 1) {
            return
        }

        const leadersByRank = leaders.sort((a, b) => +a.score - +b.score)

        const { player } = window.game
        const { playerId: myPlayerID } = player.getPlayer()

        let defaultRank = 0

        for (const player of leadersByRank) {
            const { playerId, score, name } = player
            count++
            let frame = FRAME.DAILY_BG_ITEM_LIGHT

            if (count % 2 == 0) {
                frame = FRAME.DAILY_BG_ITEM_DARK
            }

            const payload: iLeaderData = {
                playerId,
                name,
                score,
                rank: count,
                backgroundFrame: frame,
            }

            leadersData.push(payload)

            if (playerId == myPlayerID) defaultRank = count

            if (hasPlayerID && hasPlayerID == playerId) {
                this.runTweenMoveToRank(count)
            }
        }

        this.scroller.updateConfig(leadersData)

        let offsetY = 0
        if (this.scene.world.isLandscape()) offsetY = 20

        if (!hasPlayerID) {
            const heightChild = this.scroller.getChildren()[0].height
            this.scroller.value = -heightChild * this.showDefaultRank(defaultRank) - offsetY
        }

        this.showLeaders()
    }

    private showDefaultRank(rank: number): number {
        if (rank < 3) return 0
        return rank - 3
    }

    public runTweenMoveToRank(rank: number): void {
        const heightChild = this.scroller.getChildren()[0].height
        this.scrollerValue = -heightChild * (rank - 3)

        this.tweenMoveToRank = this.scene.tweens.addCounter({
            from: this.scroller.value,
            to: this.scrollerValue,
            duration: 1000,
            onUpdate: (tween) => {
                this.scroller.value = tween.getValue()
            },
        })

        this.scene.time.delayedCall(2500, () => {
            if (rank == 1 || rank == 2) {
                this.scroller.value = 0
            }
        })
    }

    public removeLeaders(): void {
        this.scroller.updateConfig([])
    }

    private getLeaders(): LeaderItem[] {
        return this.scroller.getChildren() as LeaderItem[]
    }

    private showLeaders(): void {
        const leaders = this.getLeaders()

        if (leaders.length < 1) {
            return
        }

        const numberOfLeaderPlayShow = Math.min(leaders.length, 6)
        const duration = 300

        for (let index = 0; index < numberOfLeaderPlayShow; index++) {
            const leader = leaders[index]

            if (!leader) continue

            leader.setVisible(true)
            // leader.runShowUpAnimation(index, duration)
        }

        const durationAllAnimation = duration + numberOfLeaderPlayShow * 100 + 50 * 5

        this.scene.time.delayedCall(durationAllAnimation, () => {
            this.scroller.setEnable(true)
        })
    }

    private getTestData(): any {
        const leadersData = [
            { playerId: '001', name: 'A', score: '001', rank: 1 },
            { playerId: '002', name: 'B', score: '002', rank: 2 },
            { playerId: '003', name: 'C', score: '003', rank: 3 },
            { playerId: '004', name: 'D', score: '004', rank: 4 },
            { playerId: '005', name: 'E', score: '005', rank: 5 },
            { playerId: '006', name: 'F', score: '006', rank: 6 },
            { playerId: '007', name: 'G', score: '007', rank: 7 },
        ]
        return leadersData
    }
}

export default LeaderItems
