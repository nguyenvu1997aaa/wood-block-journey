import { post } from './clients/instance'

const { ApiUrl } = GameCore.Configs.Notification

export const updatePlayerProfileNotificationAsync = async (payload: TObject) => {
    const { playerId } = payload
    const result = await post(`players/${playerId}`, payload, {}, ApiUrl, 10)
    return result?.data || {}
}
