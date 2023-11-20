import watchState from 'redux-watch'
import configureStore from './configure'

class Storage extends Phaser.Plugins.BasePlugin implements IStorage {
    private store: ReduxStore
    private initiator: IStateInitiator

    public init(): void {
        this.store = configureStore({})
    }

    public setInitiator(initiator: IStateInitiator) {
        this.initiator = initiator
    }

    public async syncStore(): Promise<void> {
        this.initiator.initContext()
        await this.initiator.initPlayer()
    }

    public dispatch = (action: IAction) => {
        return this.store.dispatch(action)
    }

    public getState = (): IState => {
        return this.store.getState()
    }

    public subscribe = (callback: Function) => {
        return this.store.subscribe(callback)
    }

    public watch = (selector: Function, callback: Function): Function => {
        const watchData = watchState(() => {
            const state = this.getState()
            return selector(state)
        })

        return this.subscribe(
            watchData((data: unknown): void => {
                callback(data)
            })
        )
    }
}

export default Storage
