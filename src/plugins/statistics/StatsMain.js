import Stats from './StatsLib.js' // import GUI CSS

export default class StatsMain {
    constructor(config) {
        this.config = config
        this.self = new Stats(config)
        this.body = undefined
        this.alpha = config.Opacity || 0.8
        this.isEnable = true
        this.initShowStats()
    }
    initShowStats() {
        this.self.dom.style.opacity = this.alpha
        this.body = document.body.appendChild(this.self.dom)
        requestAnimationFrame(this.statsAnimate.bind(this))
    }
    statsAnimate() {
        if (this.isEnable) {
            this.self.begin()
            this.self.end()
            requestAnimationFrame(this.statsAnimate.bind(this))
        }
    }
    getStats() {
        return this.self
    }
    setAlphaInStats(_alpha) {
        this.body.style.opacity = _alpha
    }

    setEnable(enable = true) {
        if (this.body) {
            this.body.hidden = !enable
        }
        this.isEnable = enable

        if (enable) {
            requestAnimationFrame(this.statsAnimate.bind(this))
        }
    }
}
