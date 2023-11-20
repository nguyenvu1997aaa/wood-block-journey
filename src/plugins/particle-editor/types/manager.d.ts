type ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
interface IParticleEditorConfig {
    ShowMonitoring: boolean
    ShowInspector: boolean
    Expanded: boolean
    AutoRefresh: boolean
    InspectorAutoUpdate: boolean
    Opacity: number
}

interface IParticleEditor {
    configure(config?: DeepPartial<IParticleEditorConfig>): Promise<void>
    hide(): void
    show(): void
    setParticleEmitter(name: string, emitter: ParticleEmitter): void
    addParticleEmitter(name: string, emitter: ParticleEmitter): void
}

declare class ParticleEditor extends Phaser.Plugins.BasePlugin implements IParticleEditor {
    configure(config?: DeepPartial<IParticleEditorConfig>): Promise<void>
    hide(): void
    show(): void
    setParticleEmitter(name: string, emitter: ParticleEmitter): void
    addParticleEmitter(name: string, emitter: ParticleEmitter): void
}
