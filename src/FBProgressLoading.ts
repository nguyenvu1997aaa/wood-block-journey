let startPercent = 0
let percentProgressFb = 0

class FBProgressLoading {
    public game: Phaser.Game
    private progressFbTimeEvent: NodeJS.Timeout

    constructor(game: Phaser.Game) {
        this.game = game
    }

    public loadingProgressFbBootScene(): void {
        const delay = 50
        const time = 5000
        const progressRate = 30
        let repeat = time / delay

        percentProgressFb = 30

        const handleProgress = () => {
            if (repeat <= 0) {
                clearTimeout(this.progressFbTimeEvent)

                return
            }

            this.progressFbTimeEvent = setTimeout(() => {
                this.game.facebook.setLoadingProgress(Math.round(percentProgressFb))
                percentProgressFb += progressRate / repeat
                repeat--

                handleProgress()
            }, delay)
        }

        handleProgress()
    }

    public finishLoadingProgressFbBootScene(): void {
        clearTimeout(this.progressFbTimeEvent)
    }

    public loadingProgressFbLoadScene(): void {
        const delay = 50

        if (!percentProgressFb || percentProgressFb < 30) {
            percentProgressFb = 60
        }

        startPercent = percentProgressFb

        const handleProgress = () => {
            this.progressFbTimeEvent = setTimeout(() => {
                this.game.facebook.setLoadingProgress(Math.round(percentProgressFb))
                percentProgressFb += 0.1

                handleProgress()
            }, delay)
        }

        handleProgress()
    }

    public onProgress(value: number): void {
        const remainPercent = 100 - percentProgressFb
        const percent = Math.round(value * remainPercent + percentProgressFb)

        if (percent > startPercent) {
            clearTimeout(this.progressFbTimeEvent)
        }

        this.game.facebook.setLoadingProgress(percent)
    }
}

export default FBProgressLoading
