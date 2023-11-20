import { SCENE_KEY_UPDATE } from '@/constants/ActionTypes'

export const updateActiveSceneKey = (sceneKey: string) => ({
    type: SCENE_KEY_UPDATE,
    payload: { sceneKey },
})
