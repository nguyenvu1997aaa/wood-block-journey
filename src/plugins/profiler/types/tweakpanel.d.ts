import { BladeApi } from 'tweakpane'
import { BladeController, View } from '@tweakpane/core'

export interface ProfilerBladeAPI extends BladeApi<BladeController<View>> {
    measure(name: string, callback: any): void
}
