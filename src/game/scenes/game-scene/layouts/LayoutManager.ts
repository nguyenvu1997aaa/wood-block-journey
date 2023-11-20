import BaseManager from '@/game/managers/BaseManager'
import GameScene from '@/game/scenes/game-scene'
import MANAGER from '../../../gameplay/constants/manager'
import UIObjects from './UIObjects'
import LandscapeLayout from './LandscapeLayout'
import PortraitLayout from './PortraitLayout'
import BaseLayout from './BaseLayout'
import WORLD_EVENTS from '@/plugins/world/constants/events'

const { STATUS } = MANAGER

class LayoutManager extends BaseManager {
    public scene: GameScene

    public layout: BaseLayout
    public objects: UIObjects

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        this.createObjects()
        this.createLayouts()
        this.registerEvents()
    }

    private createObjects(): void {
        this.objects = new UIObjects(this.scene)
    }

    /**
     * If the device is in landscape mode, use the LandscapeLayout, otherwise use the PortraitLayout
     */
    private createLayouts(): void {
        if (this.scene.world.isLandscape()) {
            this.layout = new LandscapeLayout(this.scene)
        } else {
            this.layout = new PortraitLayout(this.scene)
        }

        this.layout.setUIObjects(this.objects)
    }

    private registerEvents(): void {
        this.scene.world.events.on(WORLD_EVENTS.RESIZE, this.layout.alignUI, this)
    }

    public init(): void {
        this.initUILogic()

        this.layout.alignUI()

        this.objects.main.board.woodenEffect.init()
        this.objects.footer.pieces.init()

        this.setState(STATUS.READY)
    }

    public start(): void {
        if (this.isRunning()) return

        this.setState(STATUS.RUNNING)
    }

    public stop(): void {
        if (!this.isRunning()) return

        this.setState(STATUS.STOPPED)
    }

    // * If have more logic, you can create a new class to handle it (UIManager)
    private initUILogic(): void {
        if (!GameCore.Utils.Valid.isDebugger()) return
    }

    // * If have more state, you can create a new class to handle it (UIManager)
}

export default LayoutManager
