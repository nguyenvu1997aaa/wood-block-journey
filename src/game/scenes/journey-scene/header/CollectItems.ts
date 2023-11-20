import { IPosition } from '@/constants/ICommon'
import SPRITES from '@/game/constants/resources/sprites'
import { isObject } from 'lodash'
import JourneyScene from '..'
import { FRAME_GEM_TILED_MAP } from '../constant/piece'
import CollectItem from './CollectItem'

const { KEY, FRAME } = SPRITES.GAMEPLAY

interface iJsonAmount {
    [key: string]: number
}

export default class CollectItems extends Phaser.GameObjects.Container {
    public scene: JourneyScene
    private target: string
    private targetKeys: string[] = []
    private jsonPosition: {
        [key: string]: IPosition
    } = {}
    private jsonAmount: {
        [key: string]: number
    } = {}
    private jsonTarget: {
        [key: string]: number
    } = {}
    private jsonCollectItem: {
        [key: string]: CollectItem
    } = {}
    private textMission: Phaser.GameObjects.Image
    public background: Phaser.GameObjects.Image
    private listCollectItems: CollectItem[] = []

    constructor(scene: JourneyScene) {
        super(scene)

        this.scene = scene

        this.createBackground()

        // this.createText()
    }

    private createBackground(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_MAIN_SCORE,
        })

        this.background.setWorldSize(187, 48)

        this.add(this.background)

        Phaser.Display.Align.In.Center(this.background, this, 0, -1)
    }

    private calcPosition(amount: number): number[] {
        const result = []
        const mainWidth = 200
        let padding = mainWidth / (amount + 1)

        if (this.scene.world.isLandscape()) {
            const mainHeight = 255
            padding = mainHeight / (amount + 1)
        }

        const increasePadding = (padding * (amount - 1)) / 2

        for (let i = 0; i < amount; i++) {
            result.push(padding * i - increasePadding)
        }

        return result
    }

    private parseTargetToJson(): void {
        if (isObject(this.target)) return

        const jsonTarget = JSON.parse(this.target)
        const keys = Object.keys(jsonTarget)
        const position = this.calcPosition(keys.length)

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            // @ts-ignore
            const frame = FRAME_GEM_TILED_MAP[key]

            this.targetKeys.push(frame)

            this.jsonAmount[frame] = 0
            this.jsonTarget[frame] = jsonTarget[key]
            this.jsonPosition[frame] = {
                x: position[i],
                y: 68,
            }

            if (this.scene.world.isLandscape()) {
                this.jsonPosition[frame] = {
                    x: 68,
                    y: position[i],
                }
            }

            let collectItem = this.listCollectItems[i]

            if (!collectItem) {
                collectItem = new CollectItem(this.scene)

                this.add(collectItem)

                this.listCollectItems.push(collectItem)
            }

            collectItem.updateCurrentPosition(this.jsonPosition[frame])
            collectItem.setVisible(true)

            if (this.scene.world.isLandscape()) {
                collectItem.setY(position[i])
            } else {
                collectItem.setX(position[i])
            }

            collectItem.setFrame(frame)
            collectItem.setText(0, jsonTarget[key])

            this.jsonCollectItem[frame] = collectItem
        }

        console.log('this.targetKeys === ', this.targetKeys)
    }

    public hideListCollectItems(): void {
        this.listCollectItems.forEach((item) => {
            item.setVisible(false)
            item.reset()
        })
    }

    public showListCollectItems(): void {
        this.listCollectItems.forEach((item) => {
            item.reset()
            item.playAnimShowMe()
        })
    }

    public showCollectItemByKey(key: string): void {
        const collectItem = this.listCollectItems.filter((item) => {
            return item.getFrame() === key
        })

        if (!collectItem || collectItem.length === 0) return

        const amount = this.jsonAmount[key]
        const amountTarget = this.jsonTarget[key]

        if (amount >= amountTarget) {
            collectItem[0].completeMission()
        } else {
            collectItem[0].reset()
        }

        collectItem[0].playAnimShowMe()
    }

    public start(): void {
        this.parseTargetToJson()
    }

    public setTargets(targets: string): void {
        this.target = targets.replaceAll('{', '{"').replaceAll(', ', ', "').replaceAll(':', '":')
    }

    public collectItem(keyFrame: string): void {
        if (!(keyFrame in this.jsonAmount)) return

        this.jsonAmount[keyFrame]++

        const amount = this.jsonAmount[keyFrame]
        const target = this.jsonTarget[keyFrame]

        if (amount === target) this.jsonCollectItem[keyFrame].completeMission()

        this.jsonCollectItem[keyFrame].setText(amount, target)
    }

    public checkCompleteMission(): boolean {
        const keys = Object.keys(this.jsonTarget)

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]

            if (this.jsonTarget[key] > this.jsonAmount[key]) {
                return false
            }
        }

        return true
    }

    public reset(): void {
        this.hideListCollectItems()
        this.targetKeys = []
        this.jsonAmount = {}
        this.jsonTarget = {}
        this.jsonCollectItem = {}
        this.jsonPosition = {}
    }

    public getPositionCollectionItem(key: string): IPosition {
        return this.jsonPosition[key]
    }

    public getTargetKeys(): string[] {
        return this.targetKeys
    }

    public getJsonAmount(): iJsonAmount {
        return this.jsonAmount
    }

    public getJsonTarget(): iJsonAmount {
        return this.jsonTarget
    }

    public getCollectItemByKey(key: string): CollectItem {
        return this.jsonCollectItem[key]
    }

    public updateJsonAmountByFen(jsonAmount: iJsonAmount): void {
        this.jsonAmount = JSON.parse(JSON.stringify(jsonAmount))

        const keys = Object.keys(this.jsonTarget)

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const collectionItem = this.jsonCollectItem[key]

            if (this.jsonTarget[key] > this.jsonAmount[key]) {
                collectionItem.reset()
            } else {
                collectionItem.completeMission()
            }

            collectionItem.setText(this.jsonAmount[key], this.jsonTarget[key])
        }
    }

    public resetTextAmount(): void {
        const keys = Object.keys(this.jsonTarget)

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]

            const collectItem = this.listCollectItems[i]

            if (!collectItem) {
                continue
            }

            collectItem.setText(0, this.jsonTarget[key])
        }
    }
}
