interface IDebuggerConfig {
    ShowMonitoring: boolean
    ShowInspector: boolean
    Expanded: boolean
    AutoRefresh: boolean
    InspectorAutoUpdate: boolean
    Opacity: number
}

interface IDebugger {
    configure(config?: DeepPartial<IDebuggerConfig>): Promise<void>
    hide(): void
    show(): void
    getFolder(): FolderApi
    debug(obj: TObject, name?: string): FolderApi
}

declare class Debugger extends Phaser.Plugins.BasePlugin implements IDebugger {
    configure(config?: DeepPartial<IDebuggerConfig>): Promise<void>
    hide(): void
    show(): void
    getFolder(): FolderApi
    debug(obj: TObject, name?: string): FolderApi
}
