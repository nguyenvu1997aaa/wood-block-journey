import AdStatus from '../constants/AdsStatus'

abstract class AdInstance implements IAdInstance {
    protected type: string
    protected status: string

    constructor(type: string) {
        this.type = type
        this.status = AdStatus.IDLE
    }

    public abstract loadAsync(): Promise<void>
    public abstract showAsync(): Promise<void>
    public abstract canBeShown(): boolean
}

export default AdInstance
