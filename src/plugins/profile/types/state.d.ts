interface IProfilesData {
    [key: string]: TPlayer
}

interface IProfileState {
    data: IProfilesData
    profileIds: string[]
}
