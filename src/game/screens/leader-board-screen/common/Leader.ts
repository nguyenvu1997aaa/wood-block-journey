import ShowItemAnimation from '@/game/animations/entrances/ShowItem'
import ShowPopupAnimation from '@/game/animations/entrances/ShowPopup'
import AvatarFrame from '@/game/components/AvatarFrame'
import Button from '@/game/components/Button'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { challengeFriend } from '@/modules/match/actions/gameplay'
import { shareScore } from '@/redux/actions/share'

const { KEY, FRAME } = SPRITES.DEFAULT

export interface ILeaderPayload {
    playerId: string
    rank?: number
    photo: string
    name: string
    score: string
    backgroundFrame?: string
    scoreRight?: boolean
    isHighlight?: boolean
    useChallenge?: boolean
}

class Leader extends Phaser.GameObjects.Container {
    private buttonPlay: Button
    private buttonShare: Button
    private avatar: AvatarFrame
    private rankIcon: Phaser.GameObjects.Image
    private rankText: Phaser.GameObjects.BitmapText
    private username: Phaser.GameObjects.Text
    private score: Phaser.GameObjects.Container
    private scoreText: Phaser.GameObjects.Text
    private background: Phaser.GameObjects.Image

    private showPopUp: ShowPopupAnimation
    private showItems: ShowItemAnimation

    public payload: NoOptionals<ILeaderPayload>

    constructor(scene: Phaser.Scene, payload?: ILeaderPayload) {
        super(scene)

        this.createBackground()
        this.updateSize()

        this.createAvatar()
        this.createRank()
        this.createUsername()
        this.createScore()
        this.createButtonShare()
        this.createButtonPlay()

        if (payload) {
            this.updateInfo(payload)
        }

        this.scene.add.existing(this)
    }

    public updateInfo(payload: ILeaderPayload) {
        this.payload = {
            scoreRight: true,
            isHighlight: false,
            useChallenge: false,
            backgroundFrame: '',
            rank: -1,
            ...payload,
        }
        this.updateBackground()
        this.updateAvatar()
        this.updateRank()
        this.updateUsername()
        this.updateScore()
        this.updateButton()
        this.alignScoreAndButton()
    }

    private createBackground(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.LEADERBOARD_BG_ITEM,
        })

        this.background.setWorldSize(312, 60)

        this.background.setVisible(false)

        this.add(this.background)
    }

    private updateBackground(): void {
        const backgroundFrame = this.payload.backgroundFrame

        if (!backgroundFrame) {
            this.background.setVisible(false)
            return
        }

        this.background.setVisible(true)
        this.background.setFrame(this.payload.backgroundFrame || FRAME.LEADERBOARD_BG_ITEM)
        this.background.setWorldSize(312, 60)
    }

    private updateSize(): void {
        const { width, height } = this.background
        this.setSize(width, height)
    }

    private createAvatar(): void {
        this.avatar = new AvatarFrame(this.scene, {
            key: KEY,
            frame: FRAME.AVATAR_BORDER,
            background: FRAME.AVATAR_BACKGROUND,
            width: 40,
            height: 40,
            radius: 30,
            borderWidth: 5,
        })

        this.add(this.avatar)

        Phaser.Display.Align.In.LeftCenter(this.avatar, this, -40)
    }

    private updateAvatar(): void {
        const { playerId, photo } = this.payload
        this.avatar.loadPhoto(playerId, photo)
    }

    private createRank(): void {
        const rank = 1

        this.createRankIcon(rank)
        this.createRankText(rank)
    }

    private updateRank(): void {
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

    private createRankIcon(rank: number): void {
        const frame = this.getRankIconFrame(rank)

        this.rankIcon = this.scene.make.image({
            key: KEY,
            frame,
        })

        this.rankIcon.setWorldSize(28, 24)

        this.add(this.rankIcon)

        Phaser.Display.Align.In.LeftCenter(this.rankIcon, this.background, -6)
    }

    private updateRankIcon(rank: number): void {
        if (rank > 3) {
            this.rankIcon.setVisible(false)
            return
        }

        this.rankIcon.setVisible(true)

        const frame = this.getRankIconFrame(rank)

        this.rankIcon.setWorldSize(28, 24)

        this.rankIcon.setFrame(frame)
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

    private updateRankUndefined(): void {
        this.rankIcon.setVisible(false)

        this.rankText.setVisible(true)

        this.rankText.setText(`?`)

        const { isHighlight } = this.payload

        if (isHighlight) {
            this.rankText.setFont(FONTS.NUMBER_LIGHT.KEY)
        } else {
            this.rankText.setFont(FONTS.NUMBER_DARK.KEY)
        }
    }

    private getShortName(name: string): string {
        const maxLength = 15
        if (name.length > maxLength) {
            return name.substring(0, maxLength - 3) + '...'
        } else {
            return name
        }
    }

    private createUsername(): void {
        const name = 'FRIEND NAME'

        this.username = this.scene.make.text({
            text: this.getShortName(name),
            style: {
                fontFamily: FONTS.FONT_FAMILY_ARIAL,
                fontSize: `${this.scene.fontSize(40)}px`,
                fontStyle: '700',
            },
        })

        this.username.setTint(0x723717)
        this.username.setHighQuality()

        Phaser.Display.Align.To.RightCenter(this.username, this.avatar, 10, 0)

        this.add(this.username)
    }

    private updateUsername(): void {
        const { name } = this.payload
        const { lang } = this.scene.game

        const correctName = name != 'Anonymous' ? name : lang.Text.Anonymous

        this.username.setText(this.getShortName(correctName))
        this.username.setTint(0x73391a)
    }

    private createScore(): void {
        const score = '132500'

        this.score = this.scene.add.container()

        this.scoreText = this.scene.make.text({
            text: score,
            style: {
                fontFamily: FONTS.FONT_FAMILY_ARIAL,
                fontSize: `${this.scene.fontSize(36)}px`,
                fontStyle: '500',
            },
        })

        this.scoreText.setOrigin(0.5)

        this.score.add([this.scoreText])

        this.add(this.score)

        Phaser.Display.Align.In.Center(this.score, this.avatar, 160, 0)
    }

    private updateScore(): void {
        const { score } = this.payload

        this.scoreText.setText(score)

        this.scoreText.setTint(0x73391a)
    }

    private createButtonPlay(): void {
        this.buttonPlay = new Button(this.scene, KEY, FRAME.BUTTON_CHALLENGE_LIGHT, 54, 36)
        this.buttonPlay.setName('ChallengeFriend')

        Phaser.Display.Align.In.RightCenter(this.buttonPlay, this, -18, 2)

        this.buttonPlay.onClick = this.handleChallengeFriend

        this.add(this.buttonPlay)
    }

    private createButtonShare(): void {
        this.buttonShare = new Button(this.scene, KEY, FRAME.BUTTON_SHARE_DARK, 54, 36)
        this.buttonShare.setName('Share')

        Phaser.Display.Align.In.RightCenter(this.buttonShare, this, -18, 2)

        this.buttonShare.onClick = this.handleShare

        this.add(this.buttonShare)
    }

    private updateButton(): void {
        const { isHighlight, useChallenge } = this.payload

        if (!useChallenge) {
            this.buttonShare.setVisible(false)
            this.buttonPlay.setVisible(false)
            return
        }

        if (isHighlight) {
            this.buttonShare.setVisible(true)
            this.buttonPlay.setVisible(false)
        } else {
            this.buttonShare.setVisible(false)
            this.buttonPlay.setVisible(true)
        }
    }

    private alignScoreAndButton(): void {
        const { useChallenge } = this.payload

        if (!useChallenge) {
            Phaser.Display.Align.In.Center(this.score, this.avatar, 200, 0)

            return
        }

        Phaser.Display.Align.In.Center(this.score, this.avatar, 150, 0)
    }

    private handleChallengeFriend = (): void => {
        const { playerId } = this.payload
        this.scene.storage.dispatch(challengeFriend(playerId))
    }

    private handleShare = (): void => {
        this.scene.storage.dispatch(shareScore())
    }

    private runShowPopUpAnimation(delay: number, duration: number): void {
        this.scene.tweens.killTweensOf(this)

        this.showPopUp = new ShowPopupAnimation({
            targets: [this],
            delay,
            duration,
            props: {
                y: { start: this.y + 70, to: this.y },
            },
        })

        this.showPopUp.play()
    }

    private runShowItemAnimation(delay: number, duration: number): void {
        const targets = this.getAll()
        this.scene.tweens.killTweensOf(targets)
        this.showItems = new ShowItemAnimation({
            targets,
            duration,
            delay: this.scene.tweens.stagger(50, { start: delay + 50 }),
            props: {
                scale: {
                    duration: 1000,
                    getStart: (el) => el.scale * 0.8,
                    getEnd: (el) => el.scale,
                    ease: Phaser.Math.Easing.Elastic.Out,
                    easeParams: [0.1, 0.45],
                },
            },
        })

        this.showItems.play()
    }

    public runShowUpAnimation(index = 0, duration = 300) {
        const delay = index * 100

        // this.setVisible(false);
        this.runShowPopUpAnimation(delay, duration)
        this.runShowItemAnimation(delay, duration)
    }

    public setFrameBackground(frame: string) {
        this.background.setFrame(frame)
    }

    public setUserNameLight(): void {
        this.username.setTint(0xfde8c8)
    }

    public setRankLight(): void {
        this.rankText.setFont(FONTS.NUMBER_LIGHT.KEY)
    }

    public setScoreLight(): void {
        this.scoreText.setTint(0xfde8c8)
    }
}

export default Leader
