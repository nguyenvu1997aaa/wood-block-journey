interface IAdaptivePerformance {
    configure(payload: IAdaptivePerformancePayload)
    active(): void
}

interface IAdaptivePerformancePayload extends PerformanceOptions {
    pixelRatio: number
    minQuality: number
    maxQuality: number
    qualityAdjustStep: number
    trackingSceneKeys: string[]
}
