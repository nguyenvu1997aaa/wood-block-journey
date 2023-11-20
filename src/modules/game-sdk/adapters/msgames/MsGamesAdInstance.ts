import AdInstance from '../../sdk/adInstance'

const defaultRespond = {
    instanceId: '',
}

class MsGamesAdInstance extends AdInstance {
    private sdk: typeof $msstart
    private type: string
    private response: $msstart.AdInstance

    constructor(type: string, sdk: typeof $msstart) {
        super()
        this.sdk = sdk
        this.type = type
        this.response = defaultRespond
    }

    public getPlacementID(): string {
        return this.response.instanceId
    }

    public loadAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.type === 'interstitial') {
                this.sdk
                    .loadAdsAsync(false)
                    .then((instance) => {
                        this.response = instance
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            } else if (this.type === 'rewarded') {
                this.sdk
                    .loadAdsAsync(true)
                    .then((instance) => {
                        this.response = instance
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            } else {
                reject(new Error('Unknown ad type'))
            }
        })
    }

    public showAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.response.instanceId) {
                reject(new Error('Ad is not loaded'))
            }

            this.sdk
                .showAdsAsync(this.response.instanceId)
                .then((instance) => {
                    this.response = defaultRespond
                    if (!instance.showAdsCompletedAsync) {
                        reject(new Error('Ad is not loaded'))
                        return
                    }

                    instance.showAdsCompletedAsync
                        .then(() => {
                            //TODO: handle skip
                            resolve()
                        })
                        .catch((error) => {
                            reject(error)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

export default MsGamesAdInstance
