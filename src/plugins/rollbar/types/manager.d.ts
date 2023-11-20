type LogArgument = string | Error | object | Callback | Date | any[] | undefined
type OnSendCallBack = (isUncaught: boolean, args: LogArgument[], item: object) => void

interface IAutoInstrument {
    dom: boolean
    navigation: boolean
}

interface IPayload {
    environment: string
    client?: {
        javascript: {
            code_version?: string
            source_map_enabled?: boolean
        }
    }
    server?: {
        root?: string
        branch?: string
    }
    person?: {
        id: string
        name?: string
    }
    player?: unknown
    match?: unknown
    other?: unknown
}

// take from Rollbar.Configuration
interface IRollbarConfig {
    payload: IPayload
    accessToken: string
    checkIgnore?: (_isUncaught: boolean, args: LogArgument[], _item: object) => boolean
    onSendCallback?: (isUncaught: boolean, args: LogArgument[], payload: object) => void
    autoInstrument: IAutoInstrument
    nodeSourceMaps: boolean
    scrubTelemetryInputs: boolean
    captureUncaught: boolean
    captureUnhandledRejections: boolean
}

declare class RollbarPlugin extends Phaser.Plugins.BasePlugin {
    setup(): void
    configure(config: DeepPartial<IRollbarConfig>): void
    sendException(error: unknown, payload?: TObject): void
}
