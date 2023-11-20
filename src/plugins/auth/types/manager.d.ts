interface IAuthManager {
    getToken(): string
    requestToken(): Promise<void>
}
