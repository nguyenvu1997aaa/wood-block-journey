import DEPTH_OBJECTS from '@/game/constants/depth'
import { debounce } from 'ts-debounce'

export interface IScrollConfig {
    width: number
    height: number
    marginTop?: number
    marginBottom?: number
    acceleration?: number
    maxScrollOver?: number // can scroll over max = maxScrollOver * height
    scrollSmooth?: number
    scrollingBackRate?: number
    useMask?: boolean
}

class Scroller extends Phaser.GameObjects.Container {
    public config: NoOptionals<IScrollConfig>
    public isEnable: boolean
    protected maxHeight: number
    protected isScrolling: boolean

    private boundTop: Phaser.GameObjects.Image
    private boundBottom: Phaser.GameObjects.Image
    private maskGraphics: Phaser.GameObjects.Graphics

    protected objects: Phaser.GameObjects.Group

    protected _value = 0
    protected velocity = 0
    protected isScrollingSmooth: boolean
    protected lastScrollY: number[]
    protected isScrollingBack: boolean
    protected scrollingBackTo: number
    protected lastScrollYCount = 0

    private hitArea: Phaser.GameObjects.Rectangle

    private onScrollEvents: Function[] = []

    // config scroll
    protected get marginTop(): number {
        return this.config.marginTop
    }

    protected get marginBottom(): number {
        return this.config.marginBottom
    }

    protected get acceleration(): number {
        return this.config.acceleration
    }

    protected get maxScrollOver(): number {
        return this.config.maxScrollOver
    }

    protected get scrollSmooth(): number {
        return this.config.scrollSmooth
    }

    protected get scrollingBackRate(): number {
        return this.config.scrollingBackRate
    }

    constructor(scene: Phaser.Scene, config: IScrollConfig) {
        super(scene)

        this.config = {
            marginTop: 0,
            marginBottom: 0,
            acceleration: 1400,
            maxScrollOver: 0.15,
            scrollSmooth: 40,
            scrollingBackRate: 5,
            useMask: true,
            ...config,
        }

        const { width, height } = config

        this.isEnable = false
        this.maxHeight = 0
        this.lastScrollY = new Array(3).fill(0)

        this.setSize(width, height)

        this.createGroup()
        this.createInput()
        this.createEvents()

        this.scene.add.existing(this)
    }

    public onScroll(f: (scroller: Scroller, value: number, delta: number) => void) {
        this.onScrollEvents.push(f)
    }

    public get value(): number {
        return this._value
    }

    public set value(v: number) {
        const delta = v - this._value
        this._value = v
        this.updateObject(delta)
    }

    public gotoTop() {
        this.value = this.config.marginTop
    }

    public reset() {
        this.maxHeight = 0
        this.isScrolling = false
        this.isScrollingBack = false
        this.isScrollingSmooth = false
        this.gotoTop()
        this.setEnable(false)
    }

    // ! DEBUG
    public createDebug(): void {
        const box = this.drawDebugBox(0xff0000, 0.8)
        console.log(box?.x, box?.y, box?.displayWidth, box?.displayHeight)
    }

    public setEnable(enable: boolean): void {
        this.isEnable = enable

        if (enable) {
            this.setInteractive({
                draggable: true,
                useHandCursor: true,
            })
        } else {
            this.disableInteractive()
        }
    }

    public addItem(object: Phaser.GameObjects.GameObject): void {
        this.addAt(object)
        this.objects.add(object)

        const { y, height } = object
        const calcHeight = y + height + this.marginBottom - this.height / 2

        this.maxHeight = Math.max(this.maxHeight, calcHeight, 0)

        this.updateObjectVisible()
    }

    public addItems(objects: Phaser.GameObjects.GameObject[]): void {
        this.addAt(objects)
        this.objects.addMultiple(objects)

        const sizes = objects.map((o) => o.y + o.height + this.marginBottom - this.height / 2)
        this.maxHeight = Math.max(this.maxHeight, Math.max(...sizes), 0)

        this.updateObjectVisible()
    }

    public clearItem(): void {
        this.objects.clear(true, true)
        this.reset()
    }

    public getChildren(): Phaser.GameObjects.GameObject[] {
        return this.objects.getChildren().filter((o) => o.active)
    }

    public createBound(key: string, frame: string, height: number, tint?: number): void {
        this.boundTop = this.scene.make.image({ key, frame })
        this.boundBottom = this.scene.make.image({ key, frame })

        if (tint) {
            this.boundTop.setTint(tint)
            this.boundBottom.setTint(tint)
        }

        this.boundTop.setAlpha(0, 0, 0, 0)
        this.boundBottom.setAlpha(0, 0, 0, 0)

        this.boundTop.setDepth(DEPTH_OBJECTS.PRIORITY)
        this.boundBottom.setDepth(DEPTH_OBJECTS.PRIORITY)

        const displayWidth = this.width
        const displayHeight = height

        const { x, y } = this.getWorldPosition()

        this.boundTop.setDisplaySize(displayWidth, displayHeight)
        this.boundBottom.setDisplaySize(displayWidth, displayHeight)

        this.boundTop.setY(-this.displayHeight / 2 + displayHeight / 2 + y - this.y - 1)
        this.boundBottom.setY(this.displayHeight / 2 - displayHeight / 2 + y - this.y + 1)

        this.boundTop.setX(x - this.x)
        this.boundBottom.setX(x - this.x)

        this.add([this.boundTop, this.boundBottom])
    }

    public createMask(): void {
        this.maskGraphics?.destroy()

        this.maskGraphics = this.scene.make.graphics({
            fillStyle: { color: 0x0000ff, alpha: 1 },
            visible: true,
        })

        this.maskGraphics.setName('MaskGraphics')

        const displayWidth = this.width
        const displayHeight = this.height

        this.maskGraphics.fillRoundedRect(
            0 - displayWidth / 2,
            0 - displayHeight / 2,
            displayWidth,
            displayHeight,
            0
        )

        if (this.config.useMask) {
            this.setMask(this.maskGraphics.createGeometryMask())
        }

        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.updateMask, this)
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.updateMask, this)
    }

    private updateMask() {
        const { x, y } = this.getWorldPosition()
        this.maskGraphics.setPosition(x, y)
    }

    protected createGroup(): void {
        this.objects = this.scene.make.group({})
    }

    protected updateObject(delta: number) {
        this.objects.incY(delta)
        this.updateObjectVisible()
    }

    protected updateObjectVisible() {
        const listObject = this.objects.getChildren()

        for (let i = 0; i < listObject.length; i++) {
            const obj = listObject[i]
            if (obj.y + obj.height < -this.height / 2 || obj.y - obj.height > this.height / 2) {
                obj.setVisible(false)
            } else {
                obj.setVisible(true)
            }
        }
    }

    private createInput(): void {
        this.setInteractive({
            draggable: true,
            useHandCursor: true,
        })

        this.on(Phaser.Input.Events.POINTER_WHEEL, this.onMouseScroll)
        this.on(Phaser.Input.Events.GAMEOBJECT_DRAG, this.onTouchScroll)
        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onTouchDown)
        this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.onTouchEnd, this)
    }

    private createEvents(): void {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update)
    }

    public update = (time: number, delta: number): void => {
        if (this.isScrollingSmooth && this.velocity) {
            this.scrollingSmooth(delta)
        }

        if (this.isScrollingBack) {
            this.scrollingBack(delta)
        }
    }

    private callOnScrollEvents(value: number, delta: number) {
        for (const f of this.onScrollEvents) {
            f(this, value, delta)
        }
    }

    private scrollingBack(delta: number) {
        const d = ((this.scrollingBackTo - this.value) * delta * this.scrollingBackRate) / 1000
        this.value += d

        if (Math.abs(this.scrollingBackTo - this.value) < 0.5) {
            this.value = this.scrollingBackTo
            this.stopScrollingBack()
        }

        this.callOnScrollEvents(this.value, d)
    }

    private startScrollingBack(y: number) {
        this.isScrollingBack = true
        this.scrollingBackTo = y
    }

    private stopScrollingBack() {
        this.isScrollingBack = false
    }

    private scrollingSmooth(delta: number) {
        const d = (this.velocity * delta) / 1000
        this.value += d

        const calcVelocity = Math.abs(this.velocity) / this.velocity
        this.velocity -= (calcVelocity * this.acceleration * delta) / 1000

        if (Math.abs(this.velocity) < (this.acceleration * delta) / 1000) {
            this.stopScrollSmooth()
        }

        if (this.isReachTop()) {
            this.startScrollingBack(this.marginTop)
            this.stopScrollSmooth()
        }

        if (this.isReachBottom()) {
            this.startScrollingBack(-this.maxHeight)
            this.stopScrollSmooth()
        }

        this.callOnScrollEvents(this.value, d)
    }

    private startScrollSmooth(v: number): void {
        this.isScrollingSmooth = true
        if (!v) return

        if (v * this.velocity > 0) {
            this.velocity += v
        } else {
            this.velocity = v
        }
    }

    private stopScrollSmooth() {
        this.isScrollingSmooth = false
        this.isScrolling = false
        this.velocity = 0
    }

    public isReachTop(): boolean {
        return this.value > this.marginTop
    }

    public isReachBottom(): boolean {
        return -this.value > this.maxHeight
    }

    private checkReachBound = (): boolean => {
        return this.isReachTop() || this.isReachBottom()
    }

    private onMouseScroll = debounce(
        (pointer: unused, deltaX: unused, deltaY: number): void => {
            if (!this.isEnable) return
            this.isScrolling = true

            const isReach = this.checkReachBound()

            if (isReach) {
                this.lastScrollY = this.lastScrollY.map(() => 0)
                this.isScrolling = false
                return
            }

            this.stopScrollingBack()
            this.startScrollSmooth((-deltaY * this.scrollSmooth) / 15)
        },
        100,
        { isImmediate: true, maxWait: 100 }
    )

    private onTouchScroll = (pointer: Phaser.Input.Pointer): void => {
        if (!this.isEnable) return

        if (this.velocity) {
            this.stopScrollSmooth()
        }

        this.stopScrollingBack()
        this.isScrolling = true

        const zoomRatio = this.scene.game.world.getZoomRatio()
        const { position, prevPosition } = pointer

        const posY = (position.y - prevPosition.y) / zoomRatio
        const maxOver = this.height * this.maxScrollOver

        let scrollOverRate = 1
        this.lastScrollY[++this.lastScrollYCount % this.lastScrollY.length] = posY

        if (this.isReachTop() && posY >= 0) {
            const rate = (maxOver - (this.value - this.marginTop)) / maxOver
            scrollOverRate = Math.min(scrollOverRate, rate)
        }

        if (this.isReachBottom() && posY <= 0) {
            const rate = (maxOver - (-this.maxHeight - this.value)) / maxOver
            scrollOverRate = Math.min(scrollOverRate, rate)
        }

        const d = posY * scrollOverRate

        const heightOver = this.maxScrollOver * this.height
        if (this.value + d > this.marginTop + heightOver) {
            this.value = this.marginTop + heightOver
        } else if (this.value + d < -this.maxHeight - heightOver) {
            this.value = -this.maxHeight - heightOver
        } else {
            this.value += d
        }

        this.callOnScrollEvents(this.value, d)
    }

    private onTouchDown = (): void => {
        if (!this.isEnable) return

        if (this.velocity) {
            this.stopScrollSmooth()
        }

        this.stopScrollingBack()
    }

    private onTouchEnd = (): void => {
        if (this.isReachTop()) {
            this.startScrollingBack(this.marginTop)
            this.stopScrollSmooth()
        }

        if (this.isReachBottom()) {
            this.startScrollingBack(-this.maxHeight)
            this.stopScrollSmooth()
        }

        if (!this.isScrolling) return

        const calcPosY = this.lastScrollY.reduce((a, b) => a + b) / this.lastScrollY.length
        this.startScrollSmooth(calcPosY * this.scrollSmooth)

        this.lastScrollY = this.lastScrollY.map(() => 0)
    }
}

export default Scroller
