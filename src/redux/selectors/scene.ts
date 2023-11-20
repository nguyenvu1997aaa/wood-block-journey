import { createSelector } from 'reselect'

const getCurrentSceneKeyState = (state: IState) => state.scene.currentSceneKey

export const getCurrentSceneKey = createSelector(
    [getCurrentSceneKeyState],
    (currentSceneKey) => currentSceneKey
)
