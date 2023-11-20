import SPRITES from '@/game/constants/resources/sprites'
import LevelScene from '..'
import { StatusLevel } from '../constant/status-level'
import LevelItem, { ILevelItem } from './LevelItem'

export interface ILevelItems {
    levelItem1?: ILevelItem
    levelItem2?: ILevelItem
    levelItem3?: ILevelItem
    levelItem4?: ILevelItem
}

const { KEY, FRAME } = SPRITES.DEFAULT

export default class levelItems extends Phaser.GameObjects.Container {
    public scene: LevelScene
    public background: Phaser.GameObjects.Image

    public levelItem1: LevelItem
    public levelItem2?: LevelItem
    public levelItem3?: LevelItem
    public levelItem4?: LevelItem

    public payload: NoOptionals<ILevelItems>

    constructor(scene: LevelScene, payload?: ILevelItems) {
        super(scene)

        this.scene = scene

        this.init()

        if (payload) {
            this.updateInfo(payload)
            console.log(this.payload)
        }

        this.scene.add.existing(this)
    }

    private init(): void {
        this.createBackground()
        this.updateSize()
        this.createLevelItem()
    }

    private createBackground(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_DARK,
        })

        this.background.setWorldSize(325, 64)

        this.background.setVisible(false)

        this.add(this.background)
    }

    private updateSize(): void {
        const { width, height } = this.background
        this.setSize(width, height)
    }

    public updateInfo(payload: ILevelItems) {
        // @ts-ignore
        this.payload = {
            levelItem2: {
                level: 0,
                status: '',
            },
            levelItem3: {
                level: 0,
                status: '',
            },
            levelItem4: {
                level: 0,
                status: '',
            },
            ...payload,
        }
        this.updateLevelItem()
    }

    private createLevelItem(): void {
        this.levelItem1 = new LevelItem(this.scene, {
            level: 1,
            status: StatusLevel.WAITING,
        })
        this.add(this.levelItem1)
        Phaser.Display.Align.In.Center(this.levelItem1, this, -120, 0)

        this.levelItem2 = new LevelItem(this.scene, {
            level: 2,
            status: StatusLevel.WAITING,
        })
        this.add(this.levelItem2)
        this.levelItem2.setVisible(false)

        Phaser.Display.Align.In.Center(this.levelItem2, this, -40, 0)

        this.levelItem3 = new LevelItem(this.scene, {
            level: 3,
            status: StatusLevel.WAITING,
        })
        this.add(this.levelItem3)
        this.levelItem3.setVisible(false)

        Phaser.Display.Align.In.Center(this.levelItem3, this, 40, 0)

        this.levelItem4 = new LevelItem(this.scene, {
            level: 4,
            status: StatusLevel.WAITING,
        })
        this.add(this.levelItem4)
        this.levelItem4.setVisible(false)
        Phaser.Display.Align.In.Center(this.levelItem4, this, 120, 0)
    }

    private updateLevelItem(): void {
        this.levelItem1.setStatus(this.payload.levelItem1.status)
        this.levelItem1.updateInfoLevel()

        this.levelItem1.setTextLevel(this.payload.levelItem1.level)
        this.levelItem1.updateText()
        if (this.levelItem2) {
            if (this.payload.levelItem2.status == '') {
                this.levelItem2.setVisible(false)
                if (this.levelItem3) this.levelItem3.setVisible(false)
                if (this.levelItem4) this.levelItem4.setVisible(false)
                return
            }
            this.levelItem2.setStatus(this.payload.levelItem2.status)
            this.levelItem2.updateInfoLevel()
            this.levelItem2.setVisible(true)

            this.levelItem2.setTextLevel(this.payload.levelItem2.level)
            this.levelItem2.updateText()
        }

        if (this.levelItem3) {
            if (this.payload.levelItem3.status == '') {
                this.levelItem3.setVisible(false)
                if (this.levelItem4) this.levelItem4.setVisible(false)
                return
            }
            this.levelItem3.setStatus(this.payload.levelItem3.status)
            this.levelItem3.updateInfoLevel()
            this.levelItem3.setVisible(true)

            this.levelItem3.setTextLevel(this.payload.levelItem3.level)
            this.levelItem3.updateText()
        }
        if (this.levelItem4) {
            if (this.payload.levelItem4.status == '') {
                this.levelItem4.setVisible(false)
                return
            }
            this.levelItem4.setStatus(this.payload.levelItem4.status)
            this.levelItem4.updateInfoLevel()
            this.levelItem4.setVisible(true)

            this.levelItem4.setTextLevel(this.payload.levelItem4.level)
            this.levelItem4.updateText()
        }
    }
}
