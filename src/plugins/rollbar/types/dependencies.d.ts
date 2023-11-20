module 'rollbar' {
    export default class Rollbar {
        constructor(config: DeepPartial<IRollbarConfig>)
        public configure(config: DeepPartial<IRollbarConfig>): void
        public info(error: unknown, payload?: TObject): void
        public warn(error: unknown, payload?: TObject): void
        public error(error: unknown, payload?: TObject): void
        public debug(error: unknown, payload?: TObject): void
    }
}
