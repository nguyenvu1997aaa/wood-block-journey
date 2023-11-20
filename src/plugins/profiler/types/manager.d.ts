interface IProfilePayload {
    name: string
    folder?: string
    callback: any
    parentName?: string
}

interface IProfilerPlugin {
    configure(): Promise<void>

    measureCode(payload: IProfilePayload): void

    removeFolder(name: string): void
}

interface IProfilerBlades {
    [key: string]: ProfilerTab
}
