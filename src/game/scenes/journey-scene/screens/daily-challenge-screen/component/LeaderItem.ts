import AvatarFrame from '@/game/components/AvatarFrame'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

export interface iLeaderData {
    playerId: string
    name: string
    score: number
    rank: number
    backgroundFrame?: string
}

class LeaderItem extends Phaser.GameObjects.Container {
    public payload: NoOptionals<iLeaderData>

    private background: Phaser.GameObjects.Image
    private avatar: AvatarFrame
    private rankIcon: Phaser.GameObjects.Image
    private rankText: Phaser.GameObjects.BitmapText
    private username: Phaser.GameObjects.Text
    private textTime: Phaser.GameObjects.BitmapText

    constructor(scene: Phaser.Scene, payload?: iLeaderData) {
        super(scene)

        this.createBackground()
        this.updateSize()

        this.createRank()
        this.createUsername()
        this.createTimeBlock()

        if (payload) {
            this.updateInfo(payload)
        }

        this.scene.add.existing(this)
    }

    public updateInfo(payload: iLeaderData) {
        this.payload = {
            backgroundFrame: '',
            ...payload,
        }
        this.updateBackground()
        this.updateRank()
        this.updateUsername()
        this.updateTime()
    }

    private createBackground(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.DAILY_BG_ITEM_DARK,
        })

        this.background.setWorldSize(254, 38)

        this.add(this.background)
    }

    private updateBackground(): void {
        const backgroundFrame = this.payload.backgroundFrame

        this.background.setVisible(true)
        this.background.setFrame(backgroundFrame || FRAME.DAILY_BG_ITEM_DARK)
        this.background.setWorldSize(254, 38)
    }

    private updateSize(): void {
        const { width, height } = this.background
        this.setSize(width, height)
    }

    private createRank(): void {
        const rank = 1

        this.createRankIcon(rank)
        this.createRankText(rank)
    }

    public updateRank(): void {
        const { rank } = this.payload

        if (rank < 0) {
            this.rankIcon.setVisible(false)
            this.rankText.setVisible(true)
            this.rankText.setText('99+')
            return
        }

        this.updateRankIcon(rank)
        this.updateRankText(rank)
    }

    private createRankIcon(rank: number): void {
        const frame = this.getRankIconFrame(rank)

        this.rankIcon = this.scene.make.image({
            key: KEY,
            frame,
        })

        this.rankIcon.setWorldSize(28, 24)

        this.add(this.rankIcon)

        Phaser.Display.Align.In.LeftCenter(this.rankIcon, this.background, -15)
    }

    private getRankIconFrame(rank: number): string {
        let frame = FRAME.ICON_CUP_GOLD

        switch (rank) {
            case 1:
                frame = FRAME.ICON_CUP_GOLD
                break
            case 2:
                frame = FRAME.ICON_CUP_SILVER
                break
            case 3:
                frame = FRAME.ICON_CUP_COPPER
                break
        }
        return frame
    }

    private updateRankIcon(rank: number): void {
        if (rank <= 3) {
            this.rankText.setVisible(false)
            this.rankIcon.setVisible(true)

            const frame = this.getRankIconFrame(rank)

            this.rankIcon.setFrame(frame)

            return
        }

        this.rankText.setVisible(true).setText(String(rank))
        this.rankIcon.setVisible(false)
    }

    private createRankText(rank: number): void {
        this.rankText = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(32),
            text: `${rank}`,
            origin: { x: 0.5, y: 0.5 },
        })

        this.add(this.rankText)

        Phaser.Display.Align.In.Center(this.rankText, this.rankIcon, 0, 1)
    }

    private updateRankText(rank: number): void {
        if (rank <= 3) {
            this.rankText.setVisible(false)
            return
        }

        this.rankText.setVisible(true)

        this.rankText.setText(`${rank}`)

        this.rankText.setFont(FONTS.NUMBER_DARK.KEY)
    }

    private getShortName(name: string): string {
        const shortName = name.substring(0, 7)
        return shortName.split(' ')[0] || shortName
    }

    private createUsername(): void {
        this.username = this.scene.make.text({
            text: this.getShortName('Sang Le'),
            style: {
                fontFamily: FONTS.FONT_FAMILY_ARIAL,
                fontSize: `${this.scene.fontSize(36)}px`,
                fontStyle: '700',
            },
        })

        this.username.setTint(0x73391a)

        this.add(this.username)

        Phaser.Display.Align.In.Center(this.username, this.background, -44)
    }

    private updateUsername(): void {
        const { name } = this.payload
        this.username.setText(this.getShortName(name))

        this.username.setTint(0x73391a)
    }

    private createTimeBlock(): void {
        const container = this.scene.make.container({})

        // Background
        const bg = this.scene.make.image({
            key: KEY,
            frame: FRAME.DAILY_BG_TIME,
        })

        bg.setWorldSize(85, 24)

        container.add(bg)

        // Icon
        const iconClock = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_CLOCK,
        })

        iconClock.setWorldSize(17, 17)

        container.add(iconClock)

        Phaser.Display.Align.In.LeftCenter(iconClock, bg, -5)

        // Text time
        this.textTime = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(27),
            text: `0`,
            origin: { x: 0.5, y: 0.5 },
        })

        container.add(this.textTime)

        Phaser.Display.Align.In.Center(this.textTime, bg, 10, 1.5)

        this.add(container)

        Phaser.Display.Align.In.Center(container, this.background, 70)
    }

    private updateTime(): void {
        const { score } = this.payload

        this.textTime.setText(this.secondsToHms(score))
    }

    private secondsToHms(duration: number): string {
        const s = Math.round((duration / 1000) % 60)
        const m = Math.floor((duration / (1000 * 60)) % 60)
        const h = Math.floor((duration / (1000 * 60 * 60)) % 24)

        const hDisplay = ('0' + `${h}`).slice(-2)
        const mDisplay = ('0' + `${m}`).slice(-2)
        const sDisplay = ('0' + `${s}`).slice(-2)

        return hDisplay + ':' + mDisplay + ':' + sDisplay
    }
}

export default LeaderItem
