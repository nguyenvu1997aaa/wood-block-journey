class VisibilityChangeHandler
    extends Phaser.Plugins.BasePlugin
    implements IVisibilityChangeHandler
{
    private isVisible = true
    private browserPrefixes = ['moz', 'ms', 'o', '', 'webkit']

    private visibleCallbacks: Function[] = []
    private hiddenCallbacks: Function[] = []

    public configure() {
        // bind and handle events
        const browserPrefix = this.getBrowserPrefix()
        const visibilityEventName = this.getVisibilityEvent(browserPrefix)

        //@ts-expect-error - visibility event is have checked before use
        document.addEventListener(visibilityEventName, this.handleVisibilityChange, false)

        // extra event listeners for better behavior
        document.addEventListener(
            'focus',
            () => {
                this.handleVisibilityChange(true)
            },
            false
        )

        document.addEventListener(
            'blur',
            () => {
                this.handleVisibilityChange(false)
            },
            false
        )

        window.addEventListener(
            'focus',
            () => {
                this.handleVisibilityChange(true)
            },
            false
        )

        window.addEventListener(
            'blur',
            () => {
                this.handleVisibilityChange(false)
            },
            false
        )
    }

    public addEventVisible(callback: Function) {
        this.visibleCallbacks.push(callback)
    }

    public addEventHidden(callback: Function) {
        this.hiddenCallbacks.push(callback)
    }

    public isGameVisible() {
        return this.isVisible
    }

    // get the correct attribute name
    private getHiddenPropertyName(prefix: string) {
        return prefix ? prefix + 'Hidden' : 'hidden'
    }

    // get the correct event name
    private getVisibilityEvent(prefix: string) {
        return (prefix ? prefix : '') + 'visibilitychange'
    }

    // get current browser vendor prefix
    private getBrowserPrefix(): string {
        for (let i = 0; i < this.browserPrefixes.length; i++) {
            if (this.getHiddenPropertyName(this.browserPrefixes[i]) in document) {
                // return vendor prefix
                return this.browserPrefixes[i]
            }
        }

        // no vendor prefix needed
        return ''
    }

    private onVisibleEvent() {
        // prevent double execution
        if (this.isVisible) {
            return
        }

        // change flag value
        this.isVisible = true
        console.log('visible')

        this.visibleCallbacks.forEach((f) => {
            f()
        })
    }

    private onHiddenEvent() {
        // prevent double execution
        if (!this.isVisible) {
            return
        }

        // change flag value
        this.isVisible = false
        console.log('hidden')

        this.hiddenCallbacks.forEach((f) => {
            f()
        })
    }

    private handleVisibilityChange = (forcedFlag?: boolean) => {
        // forcedFlag is a boolean when this event handler is triggered by a
        // focus or blur event otherwise it's an Event object
        if (typeof forcedFlag === 'boolean') {
            if (forcedFlag) {
                return this.onVisibleEvent()
            }

            return this.onHiddenEvent()
        }

        const browserPrefix = this.getBrowserPrefix()
        const hiddenPropertyName = this.getHiddenPropertyName(browserPrefix)

        //@ts-expect-error - hiddenPropertyName exist
        if (document[hiddenPropertyName]) {
            return this.onHiddenEvent()
        }

        return this.onVisibleEvent()
    }
}

export default VisibilityChangeHandler
