/**
 * Eruda config
 * eruda.init({
 *    container: el,
 *    tool: ['console', 'elements'],
 *    useShadowDom: true,
 *    autoScale: true,
 *    defaults: {
 *        displaySize: 50,
 *        transparency: 0.9,
 *        theme: 'Monokai Pro'
 *    }
});
 */
interface IErudaConfig {
    tool?: string[]
    useShadowDom?: boolean
    autoScale?: boolean
    defaults: {
        displaySize?: number
        transparency?: number
        theme: string
    }
}

interface IPosition {
    x: number
    y: number
}

type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
}

interface IEruda {
    configure(config: IErudaConfig): Promise<void>
    destroy(): void
    hide(): void
    show(tab?: string): void
    position(pos?: IPosition): void
}

class Eruda extends Phaser.Plugins.BasePlugin implements IConsole {
    configure(config: IErudaConfig): Promise<void>
    destroy(): void
    hide(): void
    show(tab?: string): void
    position(pos?: IPosition): void
}
