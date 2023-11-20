import GameAdInstance from './GameAdInstance'

// @ts-expect-error this load from plugin
import MockAd from './html/MockAd'

const { ErrorRate: errorRate, GiphyApiKey: giphyApiKey } = GameCore.Configs.Ads.Mockup

const handleClosePopup = (callback: Function) => (e: MouseEvent) => {
    e.preventDefault()
    const popupElement = document.getElementById('popup-ads')
    popupElement?.remove()
    callback()
}

const loadImage = async (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const elementImage = new Image() as IImageElement

        elementImage.onload = () => resolve()
        elementImage.onerror = () => reject()

        elementImage.src = url
    })
}

const showMockPopupAd = async (
    type: string,
    adContent: string,
    resolve: Function,
    reject: Function
) => {
    const htmlMock = MockAd.markup || MockAd

    const popupElement = document.createElement('div')
    popupElement.id = 'popup-ads'

    popupElement.innerHTML = htmlMock.replace('{AD_TYPE}', type).replace('{AD_CONTENT}', adContent)

    document.body.appendChild(popupElement)

    const buttonClose = document.getElementById('close-btn')
    if (buttonClose) {
        if (type === GameCore.Ads.Types.REWARDED) {
            buttonClose.innerHTML = 'Skip'
            buttonClose.onclick = handleClosePopup(() => {
                reject({ code: 'USER_INPUT', message: 'Skip ads mock error' })
            })
        } else {
            buttonClose.onclick = handleClosePopup(resolve)
        }
    }

    const buttonReward = document.getElementById('reward-btn')
    if (buttonReward) {
        if (type === GameCore.Ads.Types.REWARDED) {
            buttonReward.onclick = handleClosePopup(resolve)
        } else {
            buttonReward.remove()
        }
    }
}

class MockAdPopup implements GameSDK.AdInstance {
    private type: string
    private adContent: string
    private apiAdContent: string

    private loadTimer: NodeJS.Timeout
    private showTimer: NodeJS.Timeout

    constructor(type: string) {
        this.type = type
        this.adContent = ''
        this.apiAdContent = `https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&rate=pg&bundle=low_bandwidth`
    }

    public async loadAsync(): Promise<void> {
        const isError = Phaser.Math.RND.between(0, 100) <= errorRate

        if (!isError) {
            this.adContent = await this.getAdContentAsync()

            try {
                await loadImage(this.adContent)
            } catch (ex) {
                console.log('EEEEEEEEEEEEEEE ', ex)
            }
        }

        return new Promise((resolve, reject) => {
            clearTimeout(this.loadTimer)
            if (isError) {
                reject({ code: 'NETWORK_FAILURE', message: 'Load ads mock error' })
                return
            }

            resolve()
        })
    }

    public async showAsync(): Promise<void> {
        const isError = Phaser.Math.RND.between(0, 100) <= errorRate

        return new Promise((resolve, reject) => {
            if (isError) {
                reject({ code: 'RATE_LIMITED', message: 'Show ads mock error' })
                return
            }

            showMockPopupAd(this.type, this.adContent, resolve, reject)
        })
    }

    public getPlacementID(): string {
        return '123'
    }

    private async getAdContentAsync() {
        try {
            const response = await fetch(this.apiAdContent, { method: 'GET' })
            const json = await response.json()

            if (!GameCore.Utils.Valid.isObject(json)) return ''

            const images = json.data as { images: { downsized: { url: string } } }[]
            const rand = Phaser.Math.RND.between(0, images.length - 1)

            return images[rand].images.downsized.url
        } catch (error) {
            return 'assets/images/others/giphy-demo.gif'
        }
    }
}

class MockAdInstance extends GameAdInstance {
    protected async createInstanceByType(type: string): Promise<GameSDK.AdInstance | null> {
        return new MockAdPopup(type)
    }
}

export default MockAdInstance
