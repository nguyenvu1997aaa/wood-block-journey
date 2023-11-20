import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import Avatar from './Avatar'

const { KEY, FRAME } = SPRITES.DEFAULT

export interface ILeaderPayload {
    playerId: string
    photo: string
    score: number
    rank: number
    name: string
}

export interface ILeadersData {
    [key: string]: ILeaderPayload
}

class LeaderBlock extends Phaser.GameObjects.Container {
    public scene: Phaser.Scene
    private avatar: Avatar
    private payload: ILeaderPayload
    private buttonPlay: Phaser.GameObjects.Image
    private playerScore: Phaser.GameObjects.BitmapText

    constructor(scene: Phaser.Scene, payload?: ILeaderPayload) {
        super(scene)

        this.scene = scene

        this.createAvatar()
        this.createPlayerScore()
        this.createButtonPlay()

        if (payload) {
            this.updateInfo(payload)
        }

        this.scene.add.existing(this)
    }

    private createPlayerScore(): void {
        this.playerScore = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(30),
            origin: { x: 0.5, y: 0.5 },
            text: '',
        })

        Phaser.Display.Align.In.BottomCenter(this.playerScore, this.avatar, 0, 10)

        this.add(this.playerScore)
    }

    public updateInfo(payload: ILeaderPayload) {
        this.payload = payload
        this.updateAvatar()
        this.updatePlayerScore()
    }

    public set onClick(callback: Function) {
        this.setSize(66, 100)
        this.setInteractive({
            useHandCursor: true,
        })
        this.off(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN)
        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)
        // this.scene.input.enableDebug(this)
    }

    public setScore(text: string): void {
        this.playerScore.setText(text)
    }

    private createAvatar(): void {
        this.avatar = new Avatar(this.scene)

        Phaser.Display.Align.In.Center(this.avatar, this, 0, -20)

        this.add(this.avatar)
    }

    public updateAvatar(): void {
        const { playerId, photo } = this.payload
        this.avatar.loadPhoto(playerId, photo, 50)
    }

    private updatePlayerScore(): void {
        const { score } = this.payload
        let scoreText = `${score}`

        if (score < 0) {
            scoreText = '0'
        }

        this.playerScore.setText(scoreText)
    }

    private createButtonPlay(): void {
        this.buttonPlay = this.scene.make.image({
            key: KEY,
            frame: FRAME.BUTTON_PLAY,
        })

        this.buttonPlay.setWorldSize(56, 43)

        this.add(this.buttonPlay)

        Phaser.Display.Align.In.BottomCenter(this.buttonPlay, this.avatar, 0, 62)

        this.add(this.buttonPlay)
    }

    public setFrameButtonPlay(frame: string): void {
        this.buttonPlay.setFrame(frame)

        this.buttonPlay.setWorldSize(56, 43)
    }

    public hideButtonPlay() {
        this.buttonPlay.setVisible(false)
    }
}

export default LeaderBlock
