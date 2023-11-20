import ReuseScroller from '@/game/components/ReuseScroller'
import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenKeys } from '@/game/constants/screens'
import GAME_LEVELS from '@/game/gameplay/constants/GameLevels'
import { getJourneyMatchLevel } from '@/modules/match/selectors/match'
import LevelScene from '..'
import { StatusLevel } from '../constant/status-level'
import LevelItem from './LevelItem'
import levelItems, { ILevelItems } from './LevelItems'

const { KEY, FRAME } = SPRITES.DEFAULT

class MainLevelScreen extends Phaser.GameObjects.Container {
    public scene: LevelScene

    public backgroundContent: Phaser.GameObjects.Image
    public backgroundContainer: Phaser.GameObjects.Container
    public scroller: ReuseScroller

    constructor(scene: LevelScene) {
        super(scene)

        this.scene = scene

        this.init()

        this.createReuseScroller()

        this.scene.add.existing(this)
    }

    private init(): void {
        this.createBackgroundContent()
        this.createBackground()
    }

    private createBackground = (): void => {
        this.backgroundContainer = this.scene.make.container({})
        const { height } = this.scene.gameZone
        const scrollHeight = 415
        const remainHeight = (height - 385) / 2 + 20

        const top = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_TOP,
        })

        top.setWorldSize(375, remainHeight)

        const bottom = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_BOTTOM,
        })

        bottom.setWorldSize(375, remainHeight)

        const middle = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_MIDDLE,
        })

        middle.setWorldSize(375, scrollHeight)

        this.backgroundContainer.add([top, middle, bottom])

        Phaser.Display.Align.In.Center(middle, this.backgroundContainer, 0, 0)
        Phaser.Display.Align.In.Center(
            top,
            middle,
            0,
            -middle.displayHeight / 2 - top.displayHeight / 2
        )
        Phaser.Display.Align.In.Center(
            bottom,
            middle,
            0,
            middle.displayHeight / 2 + bottom.displayHeight / 2
        )

        Phaser.Display.Align.In.Center(this.backgroundContainer, this.scene.gameZone, 0, -24)

        this.backgroundContainer.setDepth(DEPTH_OBJECTS.BACKGROUND)

        this.setSizeBackground(top.displayHeight + middle.displayHeight + bottom.displayHeight)
    }

    private createReuseScroller() {
        this.scroller = new ReuseScroller(this.scene, {
            classType: levelItems,
            listConfigs: [],
            width: 325,
            height: 385,
            padding: 0,
            marginTop: 0,
            marginBottom: 0,
            maxScrollOver: 0.3,
            scrollingBackRate: 5,
            useMask: true,
        })

        this.scroller.setVisible(false)

        // ? setTint is't working on canvas mode
        if (this.scene.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
            this.scroller.createBound(
                SPRITES.DEFAULT.KEY,
                SPRITES.DEFAULT.FRAME.BLANK,
                40,
                0x175227
            )
        }

        this.scroller.createMask()
        this.scroller.setPosition(0, -5)

        this.add(this.scroller)
    }

    public setSizeBackground(height: number): void {
        const width =
            (height * this.backgroundContent.displayWidth) / this.backgroundContent.displayHeight

        this.backgroundContent.setWorldSize(width, height)
    }

    public updateData() {
        const state = this.scene.storage.getState()
        let level = getJourneyMatchLevel(state)

        if (level === 0) level = 1

        const levelItemData: ILevelItems[] = []
        const listGroupLevel: ILevelItems = {
            levelItem1: { status: '', level: 0 },
        }

        let listGroupLevelRemain: ILevelItems = {
            levelItem1: { status: '', level: 0 },
        }

        for (let levelIdx = 1; levelIdx < GAME_LEVELS.length; levelIdx++) {
            let status = ''

            if (levelIdx > level) {
                status = StatusLevel.WAITING
            } else if (levelIdx < level) {
                status = StatusLevel.PASSED
            } else {
                status = StatusLevel.READY
            }

            let key = ''

            switch (levelIdx % 4) {
                case 1:
                    key = 'levelItem1'
                    break
                case 2:
                    key = 'levelItem2'
                    break

                case 3:
                    key = 'levelItem3'
                    break

                case 0:
                    key = 'levelItem4'
                    break
            }

            //@ts-ignore
            listGroupLevel[key] = {
                level: levelIdx,
                status,
            }

            //@ts-ignore
            listGroupLevelRemain[key] = {
                level: levelIdx,
                status,
            }

            if (levelIdx % 4 === 0) {
                levelItemData.push({ ...listGroupLevel })
                //@ts-ignore
                listGroupLevelRemain = {
                    levelItem1: { status: '', level: 0 },
                }
            }
        }

        if ((GAME_LEVELS.length - 1) % 4 > 0) {
            levelItemData.push({ ...listGroupLevelRemain })
        }

        this.scroller.updateConfig(levelItemData)

        const heightChild = this.scroller.getChildren()[0].height
        this.scroller.value = -heightChild * this.showDefaultLevel(level)

        if (level > GAME_LEVELS.length) {
            const { globalScene } = this.scene.game
            return
            globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                message: 'UPDATING NEW LEVELS...',
                duration: 3000,
            })
        }

        this.showLeaders()
    }

    private showDefaultLevel(level: number): number {
        const levelFloor = Math.floor((level - 1) / 4)
        const maxLevelFloor = Math.floor((GAME_LEVELS.length - 1) / 4)

        if (maxLevelFloor - levelFloor < 3) return maxLevelFloor - 5
        if (levelFloor < 3) return 0

        return levelFloor - 2
    }

    public removeLevelItems(): void {
        this.scroller.updateConfig([])
    }

    public resetScroller(): void {
        this.scroller.destroy()
        this.createReuseScroller()
    }

    private getLevelItems(): LevelItem[] {
        return this.scroller.getChildren() as LevelItem[]
    }

    private showLeaders(): void {
        const levelItems = this.getLevelItems()
        if (levelItems.length < 1) {
            return
        }

        const max = levelItems.length > 8 ? 8 : levelItems.length

        for (let index = 0; index < max; index++) {
            const levelItem = levelItems[index]
            if (!levelItem) return

            levelItem.setVisible(true)
        }

        // const duration = 300

        // this.scene.time.delayedCall(duration * (max - 2), () => {
        //     this.scroller.setEnable(true)
        // })

        this.scroller.setEnable(true)
    }

    private createBackgroundContent(): void {
        this.backgroundContent = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_DARK,
        })

        this.backgroundContent.setWorldSize(340, 399)

        this.add(this.backgroundContent)
    }
}

export default MainLevelScreen
