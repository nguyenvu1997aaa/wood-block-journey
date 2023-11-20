import surnames from '@/json/names-surnames.json'

const rand = (length: number) => Math.floor(Math.random() * length)

const func = (): string => {
    if (!surnames) return 'Unknown'
    if (!surnames.data) return 'Unknown'

    const names = surnames.data

    if (!Array.isArray(names)) return 'Unknown'

    const { length } = names

    const firstName = names[rand(length)]
    const lastName = names[rand(length)]

    return `${firstName} ${lastName}`
}

export default func
