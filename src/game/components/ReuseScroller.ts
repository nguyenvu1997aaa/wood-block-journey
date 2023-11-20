import Scroller, { IScrollConfig } from './Scroller'

abstract class UpdateAbleObject extends Phaser.GameObjects.GameObject {
    constructor(scene: Phaser.Scene) {
        super(scene, 'UpdateAbleObject')
    }
    updateInfo: Function
}

export interface IReuseScrollConfig extends IScrollConfig {
    classType: typeof UpdateAbleObject
    listConfigs: TObject[]
    padding?: number
}

export default class ReuseScroller extends Scroller {
    private classType: typeof UpdateAbleObject
    private listConfigs: unknown[]
    private padding: number
    private startObjectIndex: number
    private endObjectIndex: number
    private listObjects: (UpdateAbleObject | undefined)[]

    constructor(scene: Phaser.Scene, config: IReuseScrollConfig) {
        super(scene, config)

        this.classType = config.classType
        this.listConfigs = config.listConfigs
        this.padding = config.padding ? config.padding : 0

        this.objects.classType = this.classType

        this.updateConfig(this.listConfigs)
    }

    public reset() {
        super.reset()
        this.killAndHideAll()
    }

    public getChildren(): Phaser.GameObjects.GameObject[] {
        return this.listObjects.filter(
            (o) => o != undefined && o.active
        ) as Phaser.GameObjects.GameObject[]
    }

    private get objHeight() {
        const listObjects = this.objects.getChildren()
        if (listObjects.length == 0) return (this.maxHeight = 0)

        return listObjects[0].height
    }

    public updateConfig(configs: unknown[]) {
        this.reset()

        this.listConfigs = configs
        this.listObjects = new Array(configs.length).fill(undefined)

        this.addObjectIndex(0, 0)

        const countObject = this.getEndObjectIndex()
        this.addObjectIndex(1, countObject)

        this.startObjectIndex = this.getStartObjectIndex()
        this.endObjectIndex = this.getEndObjectIndex()
        this.updateMaxHeight()
        this.value = this.marginTop
    }

    private killAndHideAll() {
        if (this.listObjects instanceof Array) {
            this.listObjects.map((o) => {
                if (o === undefined) return
                this.objects.killAndHide(o)
            })
            this.objects.getChildren().forEach((o) => this.objects.killAndHide(o))
        }
    }

    protected setItemPosition(item: UpdateAbleObject, index: number) {
        const objHeight = item.height
        item.setPosition(0, objHeight / 2 + (objHeight + this.padding) * index - this.height / 2)
    }

    protected updateMaxHeight() {
        return (this.maxHeight = Math.max(
            this.listConfigs.length * (this.objHeight + this.padding) -
                this.padding +
                this.marginBottom -
                this.height,
            0
        ))
    }

    protected updateObject(delta: number) {
        this.objects.incY(delta)

        const newStartObjectIndex = this.getStartObjectIndex()
        const newEndObjectIndex = this.getEndObjectIndex()

        if (newStartObjectIndex != this.startObjectIndex) {
            if (newStartObjectIndex > this.startObjectIndex) {
                this.killObjectIndex(this.startObjectIndex, newStartObjectIndex - 1)
            } else {
                this.addObjectIndex(newStartObjectIndex, this.startObjectIndex - 1)
            }

            this.startObjectIndex = newStartObjectIndex
        }

        if (newEndObjectIndex != this.endObjectIndex) {
            if (newEndObjectIndex < this.endObjectIndex) {
                this.killObjectIndex(newEndObjectIndex + 1, this.endObjectIndex)
            } else {
                this.addObjectIndex(this.endObjectIndex + 1, newEndObjectIndex)
            }

            this.endObjectIndex = newEndObjectIndex
        }
    }

    private killObjectIndex(i1: number, i2: number) {
        for (let i = i1; i <= i2; i++) {
            const obj = this.listObjects[i]
            if (obj) {
                this.objects.killAndHide(obj)
                this.listObjects[i] = undefined
            }
        }
    }

    private addObjectIndex(i1: number, i2: number) {
        for (let i = i1; i <= i2; i++) {
            const { padding, listConfigs } = this
            if (i >= listConfigs.length) return

            const item = this.objects.getFirstDead(true)

            const iHeight = item.height
            const posY = iHeight / 2 + (iHeight + padding) * i + this.value - this.height / 2

            item.updateInfo(listConfigs[i])
            item.setPosition(0, posY)
            item.setActive(true)
            item.setVisible(true)

            this.addAt(item)
            this.listObjects[i] = item
        }
    }

    private getStartObjectIndex() {
        const { objHeight, padding } = this
        return Math.max(Math.floor((0 - this.value) / (objHeight + padding)), 0)
    }

    private getEndObjectIndex() {
        const { objHeight, padding, listConfigs } = this

        const iHeight = objHeight + padding
        return Math.min(Math.floor((this.height - this.value) / iHeight), listConfigs.length)
    }
}
