import * as action from './redux/actions/auth'
import * as selector from './redux/selectors/auth'

class AuthManager extends Phaser.Plugins.BasePlugin implements IAuthManager {
    private get state(): IState {
        return this.game.storage.getState()
    }

    // Actions
    public async requestToken(): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(action.requestToken())
    }

    // Selectors
    public getToken(): string {
        return selector.getAuthToken(this.state)
    }
}

export default AuthManager
