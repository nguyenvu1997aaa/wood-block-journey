import BadRequest from '@/exceptions/BadRequest'
import RequestTimeout from '@/exceptions/RequestTimeout'
import { sleepAsync } from '@/utils/DateTime'

const { AppId, Network } = GameCore.Configs

interface RequestConfig extends RequestInit {
    timeout?: number
}

const validateResponse = (response: Response) => {
    if (response.ok) return
    throw new BadRequest(null, { response })
}

const defaultConfig = () => {
    const token = window.game.auth.getToken()

    return {
        token,
        timeout: Network.Timeout,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
}

const requester =
    (host: string, url: string, config: RequestConfig, data?: TObject) =>
    async (): Promise<TObject | null> => {
        try {
            const fullUrl = `${host}/apps/${AppId}/${url}`

            const controller = new AbortController()
            config.signal = controller.signal

            const timeout = setTimeout(() => {
                controller.abort()
            }, config.timeout)

            if (GameCore.Utils.Valid.isObject(data)) {
                config.body = JSON.stringify(data)
            }

            // fullUrl.searchParams.append('token', token);

            // console.info('Requester: request', { fullUrl, config });

            const response = await fetch(fullUrl, config)

            clearTimeout(timeout)

            validateResponse(response)

            // console.info('Requester: response', { response });

            const json = (await response.json()) || {}

            // console.info('Requester: result', { json });
            return json
        } catch (error) {
            if (error instanceof BadRequest) return null

            if (error instanceof Object && GameCore.Utils.Object.hasOwn(error, 'name')) {
                if (error.name === 'AbortError') {
                    throw new RequestTimeout(null)
                }
            }

            throw error
        }
    }

const handleRequest = async (
    asyncFunc: ReturnType<typeof requester>,
    retry: number
): Promise<TObject | null> => {
    try {
        return asyncFunc()
    } catch (error) {
        if (error instanceof RequestTimeout && retry > 0) {
            try {
                await sleepAsync(600)
                return await handleRequest(asyncFunc, retry - 1)
            } catch (error) {
                return {}
            }
        }

        if (error instanceof RequestTimeout) return {}

        console.warn(error)
        return {}
    }
}

export const get = async (
    url: string,
    configs: RequestConfig = {},
    host: string,
    retry = Network.Retries
) => {
    try {
        const config = {
            ...defaultConfig(),
            ...configs,
            method: 'GET',
        }

        const request = requester(host, url, config)
        return await handleRequest(request, retry)
    } catch (error) {
        console.warn(error)
        return {}
    }
}

export const post = async (
    url: string,
    data: TObject,
    configs: RequestConfig = {},
    host: string,
    retry = Network.Retries
) => {
    try {
        const config = {
            ...defaultConfig(),
            ...configs,
            method: 'POST',
        }

        const request = requester(host, url, config, data)
        return await handleRequest(request, retry)
    } catch (error) {
        console.warn(error)
        return {}
    }
}
