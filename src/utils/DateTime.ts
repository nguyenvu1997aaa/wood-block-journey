export const sleepAsync = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export const checkIsToday = (timestamp: number): boolean => {
    const last = new Date(timestamp)
    const today = new Date()

    return (
        last.getDate() === today.getDate() &&
        last.getMonth() === today.getMonth() &&
        last.getFullYear() === today.getFullYear()
    )
}

export const formatDateHMS = (ms: number, showHour = true): string => {
    const dateISO = new Date(ms).toISOString()

    if (showHour) {
        return dateISO.slice(11, -5)
    }

    return dateISO.slice(14, -5)
}

export const getDateDMY = (): string => {
    const today = new Date()

    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()

    let correctDay = `${day}`
    let correctMonth = `${month}`

    if (day < 10) {
        correctDay = `0${day}`
    }

    if (month < 10) {
        correctMonth = `0${month}`
    }

    return `${correctDay}/${correctMonth}/${year}`
}

export const convertHMS = (value: number) => {
    const sec = value / 1000 // convert value to number if it's string
    const hours = Math.floor(sec / 3600) // get hours
    const minutes = Math.floor((sec - hours * 3600) / 60) // get minutes
    const seconds = Math.floor(sec - hours * 3600 - minutes * 60) //  get seconds

    return { hours, minutes, seconds }
}
