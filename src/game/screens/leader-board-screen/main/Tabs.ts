import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class Tabs extends Phaser.GameObjects.Container {
    public scene: Phaser.Scene

    public tabWorld: Button
    public tabFriends: Button

    private textFriends: Phaser.GameObjects.Image
    private textWorld: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.scene = scene

        this.createTabFriends()
        this.createTabWorld()
    }

    public selectTabFriends(): void {
        this.tabFriends.button.setFrame(FRAME.LEADERBOARD_TAB_ON)
        this.tabWorld.button.setFrame(FRAME.LEADERBOARD_TAB_OFF)
    }

    public selectTabWorld(): void {
        this.tabFriends.button.setFrame(FRAME.LEADERBOARD_TAB_OFF)
        this.tabWorld.button.setFrame(FRAME.LEADERBOARD_TAB_ON)
    }

    private createTabFriends(): void {
        this.tabFriends = new Button(this.scene, KEY, FRAME.LEADERBOARD_TAB_OFF)

        this.tabFriends.button.setWorldSize(112, 34)

        this.textFriends = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_FRIENDS,
        })

        this.tabFriends.setName('FriendsTab')

        this.textFriends.setWorldSize(69, 14)

        this.tabFriends.add(this.textFriends)

        Phaser.Display.Align.In.Center(this.textFriends, this.tabFriends)

        Phaser.Display.Align.In.Center(this.tabFriends, this, -69)

        this.add(this.tabFriends)
    }

    private createTabWorld(): void {
        this.tabWorld = new Button(this.scene, KEY, FRAME.LEADERBOARD_TAB_OFF)

        this.tabWorld.button.setWorldSize(112, 34)
        this.tabWorld.button.flipX = true

        this.textWorld = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_WORLD,
        })

        this.tabWorld.setName('WorldTab')

        this.textWorld.setWorldSize(60, 14)

        this.tabWorld.add(this.textWorld)

        Phaser.Display.Align.In.Center(this.textWorld, this.tabWorld)

        Phaser.Display.Align.In.Center(this.tabWorld, this, 69)

        this.add(this.tabWorld)
    }

    public enableTabFriend(): void {
        this.textFriends.setFrame(FRAME.TEXT_FRIENDS)
        this.textFriends.setWorldSize(69, 14)
    }

    public disableTabFriend(): void {
        this.textFriends.setFrame(FRAME.TEXT_FRIENDS_DISABLE)
        this.textFriends.setWorldSize(69, 14)
    }

    public enableTabWorld(): void {
        this.textWorld.setFrame(FRAME.TEXT_WORLD)
        this.textWorld.setWorldSize(60, 14)
    }

    public disableTabWorld(): void {
        this.textWorld.setFrame(FRAME.TEXT_WORLD_DISABLE)
        this.textWorld.setWorldSize(60, 14)
    }
}

export default Tabs
