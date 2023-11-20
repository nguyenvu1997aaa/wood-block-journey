import { combineReducers } from 'redux'

import sceneReducer from './scene'
import contextReducer from './context'
import messagesReducer from './messages'

import authReducer from '@/plugins/auth/redux/reducers'
import playerReducer from '@/plugins/player/redux/reducers'
import profileReducer from '@/plugins/profile/redux/reducers'
import matchModuleReducer from '@/modules/match/reducers'
import tournamentModuleReducer from '@/modules/tournament/reducers'
import leaderboardsModuleReducer from '@/modules/leader-boards/reducers'
import missionsModuleReducer from '@/modules/missions/reducers'
import dailyTasksModuleReducer from '@/modules/daily-tasks/reducers'
import dailyRewardsModuleReducer from '@/modules/daily-rewards/reducers'
import dailyChallengeModuleReducer from '@/modules/daily-challenge/reducers'
import livesModuleReducer from '@/modules/lives/reducers'

const rootReducer = combineReducers({
    scene: sceneReducer,
    context: contextReducer,
    messages: messagesReducer,
    ...authReducer,
    ...playerReducer,
    ...profileReducer,
    ...matchModuleReducer,
    ...tournamentModuleReducer,
    ...leaderboardsModuleReducer,
    ...missionsModuleReducer,
    ...dailyTasksModuleReducer,
    ...dailyRewardsModuleReducer,
    ...dailyChallengeModuleReducer,
    ...livesModuleReducer,
})

export default rootReducer
