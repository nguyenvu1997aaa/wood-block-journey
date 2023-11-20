import { post } from '@/api/clients/instance'

const { ApiHost } = GameCore.Configs

export const updatePlayerProfileAsync = async (payload: TObject) => {
    const result = await post('players?platform=ms-games', payload, {}, ApiHost, 10)
    return result?.data || {}
}

export const increaseUserGuideDisplays = async (playerId: string) => {
    const result = await post(`players/${playerId}/user-guide-displays/inc`, {}, {}, ApiHost)
    return result?.data || {}
}
