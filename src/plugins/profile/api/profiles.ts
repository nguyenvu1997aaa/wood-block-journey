import { get } from '@/api/clients/instance'

const { ApiHost } = GameCore.Configs

export const getPlayersAsync = async (payload: TObject) => {
    const params = GameCore.Utils.String.params(payload)

    const result = await get(`players?${params}`, {}, ApiHost)
    return result?.data || []
}
