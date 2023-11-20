import Rollbar from 'rollbar'

const NODE_ENV = import.meta.env.SNOWPACK_PUBLIC_NODE_ENV
const ACCESS_TOKEN = import.meta.env.SNOWPACK_PUBLIC_ROLLBAR_TOKEN
const BUILD_VERSION = import.meta.env.SNOWPACK_PUBLIC_BUILD_VERSION
const SERVER_ROOT = import.meta.env.SNOWPACK_PUBLIC_ROLLBAR_SERVER_ROOT
const DEFAULT_BRANCH = import.meta.env.SNOWPACK_PUBLIC_ROLLBAR_DEFAULT_BRANCH

const { UseMockup, FilterError, ListPlayerDevIds } = GameCore.Configs.Rollbar

class RollbarPlugin extends Phaser.Plugins.BasePlugin {
    private enable: boolean
    private rollbar: Rollbar
    private events: TObject[] = []

    public setup(): void {
        if (typeof ACCESS_TOKEN !== 'string') {
            this.enable = false
            return
        }

        this.rollbar = new Rollbar({
            accessToken: ACCESS_TOKEN,
            checkIgnore: this.checkIgnore,
            onSendCallback: this.beforeSend,
            captureUncaught: true,
            scrubTelemetryInputs: true,
            captureUnhandledRejections: true,
            autoInstrument: {
                dom: false,
                navigation: false,
            },
            payload: {
                environment: NODE_ENV as string,
                client: {
                    javascript: {
                        // source_map_enabled: true
                        code_version: BUILD_VERSION as string,
                    },
                },
                server: {
                    root: SERVER_ROOT as string,
                    branch: DEFAULT_BRANCH as string,
                },
            },
        })

        this.enable = true

        this.sendTestException()
    }

    public configure(config: DeepPartial<IRollbarConfig>): void {
        if (!this.rollbar) return

        // console.info('🚀 > RollbarPlugin > configure', config)

        this.rollbar.configure(config)
    }

    private sendTestException(): void {
        const playerID = this.game.facebook.getPlayerID()
        if (!ListPlayerDevIds.includes(playerID)) return

        this.rollbar.debug(new Error('Test rollbar'), { playerID })
    }

    private beforeSend = (isUncaught: boolean, args: LogArgument[], payload: object): void => {
        if (!UseMockup) return

        this.showPopupError(payload)
    }

    private checkIgnore = (_isUncaught: boolean, args: LogArgument[], _item: object): boolean => {
        try {
            const isIgnore = this.isErrorIgnore(args)
            if (!isIgnore) return false

            console.warn(args)
            return true
        } catch (error) {
            return false
        }
    }

    private showPopupError = (event: object) => {
        // @ts-expect-error use for mock, is pass
        const mainException = event?.body?.trace?.exception
        if (mainException) {
            this.events.push(mainException)
        }

        // @ts-expect-error use for mock, is pass
        const values = event?.body?.trace?.frames || []

        this.events.push(...values)

        // events.forEach((element) => {
        //     element.stacktrace = undefined
        //     element.mechanism = undefined
        // })

        let popupElement = document.getElementById('popup-error')

        if (!popupElement) {
            popupElement = document.createElement('div')
            popupElement.id = 'popup-error'
            document.body.appendChild(popupElement)
        }

        popupElement.innerHTML = `<div style="color: #fff; display: flex; flex-flow: column; align-items: center; ">
      <pre id="json" style="overflow: auto; background-color: rgb(195 112 97 / 80%); padding: 10px; max-height: 80vh; max-width: 90vw; border: 5px solid #545454;">${JSON.stringify(
          this.events,
          null,
          2
      )}</pre>
      <button id="close" style="cursor: pointer; padding: 10px 20px; border-radius: 100px;">Close</button>
      </div>`

        // @ts-expect-error can set style
        popupElement.style =
            'top: 0px; z-index: 10000; width: 100vw; max-height: 100vh; position: absolute; display: flex; align-items: center; justify-content: center;'

        const closeBtn = document.getElementById('close')

        if (closeBtn) {
            closeBtn.onclick = this.closePopup
        }
    }

    private closePopup = () => {
        this.events = [{}]

        const popupElement = document.getElementById('popup-error')

        popupElement?.remove()
    }

    /* private reformatNonErrorEvent = (payload: object, args: LogArgument[]) => {
        if (!args || args.length === 0) return null
    
        const eventCloned = Phaser.Utils.Objects.DeepCopy(payload) as object
    
        // @ts-expect-error exist
        const values = eventCloned.body.trace.exception?.values || []
        const exception = values[0]
    
        if (!exception) return null
    
        const code = args[0].code
    
        if (!code) return null
    
        exception.type = code
        return eventCloned
    } */

    private isNoneErrorEvent = (args: LogArgument[]) => {
        if (!args || args.length === 0) return false
        if (!args[0].message) return false

        const noneErrorMsg = 'Non-Error promise rejection captured with keys: code, message'

        return args[0].message === noneErrorMsg
    }

    private isErrorIgnore = (args: LogArgument[]): boolean => {
        if (!args || args.length === 0) return false

        let isIgnore = false

        const exception = args[0]
        if (exception instanceof Object) {
            isIgnore = this.isIgnoreByCode(exception) || this.isIgnoreByMessage(exception)
        }

        return isIgnore
    }

    private isIgnoreByCode = (exception: Object): boolean => {
        if (GameCore.Utils.Object.hasOwn(exception, 'code')) {
            const { code } = exception
            const { accepted, ignored } = FilterError.Codes

            if (typeof code === 'string') {
                if (accepted.indexOf(code) >= 0) return false

                if (ignored.indexOf(code) >= 0) return true
            }
        } else if (GameCore.Utils.Object.hasOwn(exception, 'name')) {
            const { name } = exception
            const { accepted, ignored } = FilterError.Codes

            if (typeof name === 'string') {
                if (accepted.indexOf(name) >= 0) return false

                if (ignored.indexOf(name) >= 0) return true
            }
        }

        return false
    }

    private isIgnoreByMessage = (exception: Object): boolean => {
        if (GameCore.Utils.Object.hasOwn(exception, 'message')) {
            const { message } = exception
            const { accepted, ignored } = FilterError.Messages

            if (typeof message === 'string') {
                if (accepted.indexOf(message) >= 0) return false

                if (ignored.indexOf(message) >= 0) return true
            }
        }
        return false
    }

    private addExtraState = (): void => {
        try {
            if (!GameCore.Utils.Object.hasOwn(window, 'game')) return
            if (!GameCore.Utils.Object.hasOwn(window.game, 'storage')) return
            if (!GameCore.Utils.Object.hasOwn(window.game.storage, 'getState')) return

            const { getState } = window.game.storage
            const state = getState()

            // @ts-expect-error fix from module Match
            const { player, match, ...other } = state || {}

            this.rollbar.configure({
                payload: {
                    player: player,
                    match: match,
                    other: other,
                },
            })
        } catch (error) {
            console.warn(
                '%c addExtraState: ',
                'font-size:12px;background-color: #42b983;color:#fff;',
                error
            )
        }
    }

    // payload: will be available at rollbar params: body.trace.extra. and custom.
    public sendException(error: unknown, payload?: TObject): void {
        if (!error) return

        if (!this.enable) {
            console.error(error)
            return
        }

        if (!this.rollbar) return

        this.addExtraState()

        this.rollbar.error(error, payload)
    }
}

export default RollbarPlugin
