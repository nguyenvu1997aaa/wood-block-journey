interface IVisibilityChangeHandler {
    configure(): void
    addEventVisible(callback: Function): void
    addEventHidden(callback: Function): void
    isGameVisible(): boolean
}
