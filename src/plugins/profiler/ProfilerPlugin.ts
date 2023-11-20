import { Pane } from 'tweakpane'
import * as TweakpaneProfilerBladePlugin from '@0b5vr/tweakpane-plugin-profiler'
import ProfilerTab from './components/ProfilerTab'

class ProfilerPlugin extends Phaser.Plugins.BasePlugin implements IProfilerPlugin {
    private pane: Pane
    private element: HTMLElement

    private profilerBlades: IProfilerBlades

    public async configure(): Promise<void> {
        this.pane = new Pane({
            title: 'Profiler',
        })

        this.profilerBlades = {}

        this.element = this.pane.element
        this.pane.registerPlugin(TweakpaneProfilerBladePlugin)
    }

    public measureCode(payload: IProfilePayload): void {
        console.info('🚀 > measureCode', payload)

        const { name, folder, callback, parentName } = payload

        if (!GameCore.Utils.Valid.isFunction(callback)) return

        if (parentName) {
            const profile = this.profilerBlades[parentName]
            console.info('🚀 > parent', profile)

            if (profile) {
                this.measure(parentName, name, callback)
            }

            return
        }

        if (!this.profilerBlades[name]) {
            if (!folder) return
            this.createProfileBlade(name, folder)
        }

        this.measure(name, name, callback)
    }

    private measure(profile: string, name: string, callback: unknown) {
        console.info('🚀 > profile', profile)
        console.info('🚀 > name', name)

        const profiler = this.profilerBlades[profile]
        if (!profiler) return

        console.info('🚀 > profiler', profiler)

        profiler.blade.measure(name, callback)
    }

    private createProfileBlade(profile: string, folder: string): void {
        console.info('🚀 > createProfileBlade', profile)
        const newBlade = new ProfilerTab(folder, this.pane)
        this.profilerBlades[profile] = newBlade
    }

    public removeFolder(name: string): void {
        if (!this.profilerBlades[name]) return

        const blade = this.profilerBlades[name]

        this.pane.remove(blade.blade)

        this.profilerBlades[name] = null
    }
}

export default ProfilerPlugin
