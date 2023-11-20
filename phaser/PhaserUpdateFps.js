// update in phaser/src/dom/RequestAnimationFrame

this.fps = 60

var _this = this

this.updateFps = function (nextFps) {
    this.fps = nextFps
}

/**
 * The RAF step function.
 * Updates the local tick value, invokes the callback and schedules another call to requestAnimationFrame.
 *
 * @name Phaser.DOM.RequestAnimationFrame#step
 * @type {FrameRequestCallback}
 * @since 3.0.0
 */
this.step = function step() {
    //  Because we cannot trust the time passed to this callback from the browser and need it kept in sync with event times
    var timestamp = window.performance.now()

    //  DOMHighResTimeStamp
    var lastTick = _this.tick
    _this.tick = timestamp

    if (_this.fps > 16 || _this.tick - _this.lastTime > 1000 / _this.fps) {
        _this.lastTime = lastTick

        _this.callback(timestamp)
    }

    _this.timeOutID = window.requestAnimationFrame(step)
}
