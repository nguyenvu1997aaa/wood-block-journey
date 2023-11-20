import { requestDailyTasks } from './actions/tasks'
import TASKS from './constants/Tasks'
import CollectDiamondsListener from './events/CollectDiamondsListener'
import PassLevelsListener from './events/PassLevelsListener'
import ReachScoreListener from './events/ReachScoreListener'

class ModuleDailyTasks {
    private game: Phaser.Game
    private eventsListener: TObject

    constructor(game: Phaser.Game) {
        this.game = game
        this.init()
    }

    // Method
    public getEventListener(id: string) {
        return this.eventsListener[id]
    }

    private init = async (): Promise<void> => {
        this.eventsListener = {}

        await this.initData()

        this.initEvents()
    }

    private initData = async (): Promise<void> => {
        await this.game.storage.dispatch(requestDailyTasks())
    }

    private initEvents(): void {
        this.eventsListener[TASKS.PASS_LEVELS.ID] = new PassLevelsListener(this.game)
        this.eventsListener[TASKS.REACH_SCORE.ID] = new ReachScoreListener(this.game)
        this.eventsListener[TASKS.COLLECT_DIAMONDS.ID] = new CollectDiamondsListener(this.game)
    }
}

export default ModuleDailyTasks
