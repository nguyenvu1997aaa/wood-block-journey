import BaseManager from '@/game/managers/BaseManager'
import BaseUIObjects from './BaseUIObjects'
import WORLD_EVENTS from '@/plugins/world/constants/events'
import MANAGER from '../constants/manager'
import BaseLayout from './BaseLayout'

const { STATUS } = MANAGER

abstract class BaseLayoutManager extends BaseManager {
    public scene: Phaser.Scene

    public layout: BaseLayout
    public objects!: BaseUIObjects

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.scene = scene

        this.createObjects()
        this.createLayouts()
        this.registerEvents()
    }

    protected abstract createObjects(): void

    protected abstract createLayouts(): void

    protected registerEvents(): void {
        this.scene.world.events.on(WORLD_EVENTS.RESIZE, this.layout.alignUI, this)
        this.scene.world.events.on(WORLD_EVENTS.CHANGE_LAYOUT, this.changeLayout, this)
    }

    public init(): void {
        this.initUILogic()

        this.layout.alignUI()

        this.setState(STATUS.READY)
    }

    public start(): void {
        if (this.isRunning()) return

        this.updateUIState()

        this.setState(STATUS.RUNNING)
    }

    public stop(): void {
        if (!this.isRunning()) return

        this.setState(STATUS.STOPPED)
    }

    protected changeLayout = (): void => {
        // this.clearObjects()
        // this.createObjects()
        this.createLayouts()

        // TODO: maybe show a notification to user before reload game
        this.init()
        this.start()
    }

    // * If have more logic, you can create a new class to handle it (UIManager)
    protected abstract initUILogic(): void

    // * If have more state, you can create a new class to handle it (UIManager)
    protected abstract updateUIState(): void
}

export default BaseLayoutManager
