import MANAGER from '../constants/manager'

const { STATUS } = MANAGER

abstract class BaseManager {
    private state: string
    public scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    public init(): void {
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

    protected setState(state: string): void {
        this.state = state
    }

    // Check status
    public isReady(): boolean {
        return this.state === STATUS.READY
    }

    public isRunning(): boolean {
        return this.state === STATUS.RUNNING
    }

    public isStopped(): boolean {
        return this.state === STATUS.STOPPED
    }
}

export default BaseManager
