import * as actions from './redux/actions/profiles'
import * as selector from './redux/selectors/profiles'

class ProfileManager extends Phaser.Plugins.BasePlugin implements IProfileManager {
    private get state(): IState {
        return this.game.storage.getState()
    }

    // Actions
    public async requestProfiles(playerIds: string[]): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.requestProfileData(playerIds))
    }

    // Selector
    public getProfiles(): IProfilesData {
        return selector.getProfilesData(this.state)
    }
}

export default ProfileManager
