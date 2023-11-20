import type { BrowserOptions, Event, EventHint } from '@sentry/browser'

const NODE_ENV = import.meta.env.SNOWPACK_PUBLIC_NODE_ENV
const BUILD_VERSION = import.meta.env.SNOWPACK_PUBLIC_BUILD_VERSION

const SENTRY_DSN = import.meta.env.SNOWPACK_PUBLIC_SENTRY_DSN
const SENTRY_MOCKUP = import.meta.env.SNOWPACK_PUBLIC_SENTRY_MOCKUP
const SENTRY_SAMPLE_RATE = import.meta.env.SNOWPACK_PUBLIC_SENTRY_SAMPLE_RATE

const isSentryEnabled = SENTRY_DSN !== '' && SENTRY_DSN !== 'null'

let events: TObject[] = []

const showPopupError = (event: unknown) => {
    // @ts-expect-error use for mock, is pass
    const values = event?.exception?.values || []

    events.push(...values)

    events.forEach((element) => {
        element.stacktrace = undefined
        element.mechanism = undefined
    })

    let popupElement = document.getElementById('popup-error')

    if (!popupElement) {
        popupElement = document.createElement('div')
        popupElement.id = 'popup-error'
        document.body.appendChild(popupElement)
    }

    popupElement.innerHTML = `<div style="color: #fff; display: flex; flex-flow: column; align-items: center; ">
  <pre id="json" style="overflow: auto; background-color: rgb(195 112 97 / 80%); padding: 10px; max-height: 80vh; max-width: 90vw; border: 5px solid #545454;">${JSON.stringify(
      events,
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
        closeBtn.onclick = closePopup
    }
}

const closePopup = () => {
    events = [{}]

    const popupElement = document.getElementById('popup-error')

    popupElement?.remove()
}

const beforeSend = (event: Event, hint?: EventHint): Event | null => {
    try {
        const isIgnore = isErrorIgnore(event, hint)
        if (isIgnore) {
            console.warn(hint)
            return null
        }

        if (SENTRY_MOCKUP === 'true') {
            showPopupError(event)
            return null
        }

        addExtraState()

        if (isNoneErrorEvent(hint)) {
            const nonErrorFormatted = reformatNonErrorEvent(event, hint)
            if (nonErrorFormatted) {
                return nonErrorFormatted
            }
        }

        return event
    } catch (error) {
        console.log(
            '%c beforeSend: ',
            'font-size:12px;background-color: #42b983;color:#fff;',
            error
        )
        return null
    }
}

const addExtraState = (): void => {
    try {
        if (!GameCore.Utils.Object.hasOwn(window, 'game')) return
        if (!GameCore.Utils.Object.hasOwn(window.game, 'storage')) return
        if (!GameCore.Utils.Object.hasOwn(window.game.storage, 'getState')) return

        const { getState } = window.game.storage
        const state = getState()

        // @ts-expect-error fix from module Match
        const { player, match, ...other } = state || {}

        window.Sentry.setExtra('player', player)
        window.Sentry.setExtra('match', match)
        window.Sentry.setExtra('other', other)
    } catch (error) {
        console.warn(
            '%c addExtraState: ',
            'font-size:12px;background-color: #42b983;color:#fff;',
            error
        )
    }
}

const reformatNonErrorEvent = (event: Event, hint?: EventHint) => {
    if (!hint) return null

    const eventCloned = Phaser.Utils.Objects.DeepCopy(event) as Event

    const values = eventCloned.exception?.values || []
    const exception = values[0]

    if (!exception) return null

    // @ts-expect-error quick access code
    const code = hint.originalException.code

    if (!code) return null

    exception.type = code
    return eventCloned
}

const isNoneErrorEvent = (hint?: EventHint) => {
    if (!hint) return false
    if (!hint.originalException) return false

    const noneErrorMsg = 'Non-Error promise rejection captured with keys: code, message'

    // @ts-expect-error quick access message
    return hint.originalException.message === noneErrorMsg
}

const isErrorIgnore = (event: Event, hint?: EventHint): boolean => {
    if (!hint) return false

    let isIgnore = false

    const exception = hint.originalException
    if (exception instanceof Object) {
        isIgnore = isIgnoreByCode(exception) || isIgnoreByMessage(exception)
    }

    return isIgnore
}

const isIgnoreByCode = (exception: Object): boolean => {
    if (GameCore.Utils.Object.hasOwn(exception, 'code')) {
        const { code } = exception
        const { accepted, ignored } = GameCore.Configs.Sentry.errorCodes

        if (typeof code === 'string') {
            if (accepted.indexOf(code) >= 0) return false

            if (ignored.indexOf(code) >= 0) return true
        }
    }
    return false
}

const isIgnoreByMessage = (exception: Object): boolean => {
    if (GameCore.Utils.Object.hasOwn(exception, 'message')) {
        const { message } = exception
        const { accepted, ignored } = GameCore.Configs.Sentry.errorMessages

        if (typeof message === 'string') {
            if (accepted.indexOf(message) >= 0) return false

            if (ignored.indexOf(message) >= 0) return true
        }
    }
    return false
}

export const initSentry = (): void => {
    if (SENTRY_DSN === '') return

    const waitSentryLoadedTimer = setInterval(() => {
        if (!window.Sentry) return

        clearInterval(waitSentryLoadedTimer)

        console.warn({ isSentryEnabled })

        if (!isSentryEnabled) return

        const config: BrowserOptions = {
            debug: true,
            dsn: SENTRY_DSN as string,
            environment: NODE_ENV as string,
            release: BUILD_VERSION as string,
            sampleRate: +((SENTRY_SAMPLE_RATE as string) || 1),
            beforeSend,
            ignoreErrors: getIgnoreErrors(),
            beforeBreadcrumb: (breadcrumb) => {
                // ? Ignore ui-click form DOM
                return breadcrumb.category === 'ui.click' ? null : breadcrumb
            },
        }

        window.Sentry.init(config)

        // const error = new FacebookInstanceError('Pending request', 'NETWORK_FAILURE_TEST')
        // sendException(error)
    }, 100)
}

const getIgnoreErrors = (): string[] => [
    // 'Non-Error'
]

export const addBreadcrumbSentry = (category: string, message: string): void => {
    if (!window.Sentry) return
    window.Sentry.addBreadcrumb({ category, message })
}

export const setSentryUser = (user: TSentryUser): void => {
    if (!window.Sentry) return
    window.Sentry.setUser(user)
}

const captureException = (error: unknown): void => {
    if (!isSentryEnabled) {
        console.error(error)
        return
    }

    if (!window.Sentry) return
    if (!SENTRY_DSN || SENTRY_DSN === 'null') return

    window.Sentry.captureException(error)
}

export const sendExceptionWithScope = (error: unknown, payload: TObject) => {
    if (!error) return

    window.Sentry.withScope((scope) => {
        scope.setExtras(payload)
        captureException(error)
    })
}

export const sendException = (error: unknown): void => {
    if (!error) return

    captureException(error)
}
