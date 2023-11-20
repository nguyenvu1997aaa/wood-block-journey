interface IProfileManager {
    getProfiles(): IProfilesData
    requestProfiles(playerIds: string[]): Promise<void>
}
