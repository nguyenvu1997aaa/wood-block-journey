declare interface IMissionData {
    id: string
    title: keyof LanguageTextType
    require: {
        [key: string]: number | undefined
    }
    reward: {
        [key: string]: number
    }
    status?: string
    logo?: string
}

declare interface IDailyTasksState {
    tasks: IMissionData[]
    process: TObject[]
    isRequesting: boolean
    isNotice: boolean
}
