declare namespace GameCore {
    namespace Ads {
        enum Types {
            REWARDED = 'rewarded',
            INTERSTITIAL = 'interstitial',
            PRE_ROLL = 'pre-roll',
        }

        namespace Status {
            const IDLE: string
            const LOADING: string
            const FILLED: string
            const SHOWING: string
        }

        namespace Events {
            const LOADED: string
            const DISPLAYED: string
        }

        class AdError extends Error {
            public code: string
            constructor(code: string, message: string)
        }

        class AdInstance implements IAdInstance {
            constructor(type: string, ...args: unknown[])
            protected type: string
            protected status: string
            loadAsync(): Promise<void>
            showAsync(): Promise<void>
            getStatus(): string
            canBeShown(): boolean
        }
    }
}
