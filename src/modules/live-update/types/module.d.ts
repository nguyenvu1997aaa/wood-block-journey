interface HotPayload {
    deps: unknown[]
    module: {
        default: { new (): unknown }
    }
}
