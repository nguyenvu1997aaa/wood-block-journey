export default class TargetMissionManager {
    private targetType: string // score or diamond
    private targetValue: string

    constructor() {
        this.init()
    }

    private init(): void {
        //
    }

    public setTargetType(type: string): void {
        this.targetType = type
    }

    public setTargetValue(targetValue: string): void {
        this.targetValue = targetValue
    }

    public getTargetType(): string {
        return this.targetType
    }

    public getTargetValue(): string {
        return this.targetValue
    }
}
