import { Pane } from 'tweakpane'
import { ProfilerBladeAPI } from '../types/tweakpanel'

class ProfilerTab {
    public pane: Pane
    public name: string
    public blade: ProfilerBladeAPI

    constructor(name: string, pane: Pane) {
        this.pane = pane
        this.name = name
        this.blade = pane.addBlade({
            view: 'profiler',
            label: name,
        }) as ProfilerBladeAPI
    }
}

export default ProfilerTab
