abstract class AdInstance implements GameSDK.AdInstance {
    public abstract getPlacementID(): string

    public abstract loadAsync(): Promise<void>

    public abstract showAsync(): Promise<void>
}

export default AdInstance
