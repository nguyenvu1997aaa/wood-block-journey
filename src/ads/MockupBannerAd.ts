const { GiphyApiKey: giphyApiKey } = GameCore.Configs.Ads.Mockup

export default class MockBannerAd {
    public static async loadBannerAdAsync() {
        const image = await this.getAdContentAsync()
        const bannerAds = document.getElementById('mock-banner-ads')

        if (bannerAds) {
            const imgTag = bannerAds.getElementsByTagName('img')
            if (!imgTag || imgTag.length <= 0) return
            imgTag[0].src = image
        } else {
            const adElement = document.createElement('div')
            adElement.id = 'mock-banner-ads'

            adElement.style.width = '100%'
            // TODO: mock banner height with configs
            adElement.style.height = '50px'
            adElement.style.bottom = 'var(--sab)'
            adElement.style.position = 'fixed'
            adElement.style.background = `#fff url(${image}) center center/auto no-repeat`
            adElement.style.outline = '2px solid #ffffff40'
            adElement.style.outlineOffset = '-2px'

            // Fake gif animation
            const style = document.createElement('style') as HTMLStyleElement

            const head = document.head || document.getElementsByTagName('head')[0]
            head.appendChild(style)

            const css = `@keyframes fake-gif {
                0%,10% {
                    background-position-y: top
                }
                60% {
                    background-position-y: center
                }
                100% {
                    background-position-y: bottom
                }
            }`
            style.appendChild(document.createTextNode(css))

            adElement.style.animation = 'fake-gif 6s ease-in-out 0s infinite alternate both'

            document.body.appendChild(adElement)
        }
    }

    public static async getAdContentAsync() {
        const apiAdContent = `https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&rate=pg&bundle=low_bandwidth`
        const response = await fetch(apiAdContent, {
            method: 'GET',
        })

        const json = await response.json()

        if (!GameCore.Utils.Valid.isObject(json)) return ''

        const images = json.data as { images: { downsized: { url: string } } }[]
        const rand = Math.floor(Math.random() * images.length)

        return images[rand].images.downsized.url
    }

    public static async hideBannerAdAsync() {
        const bannerAds = document.getElementById('mock-banner-ads')

        if (!bannerAds) return

        bannerAds.remove()
    }
}
