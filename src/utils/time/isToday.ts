const func = (timestamp: number): boolean => {
    const last = new Date(timestamp)
    const today = new Date()

    return (
        last.getDate() === today.getDate() &&
        last.getMonth() === today.getMonth() &&
        last.getFullYear() === today.getFullYear()
    )
}

export default func
