const getLanguageCode = (locale: string): string => {
    const parts = locale ? locale.split('_') : []
    let code = parts.length > 0 ? parts[0] : 'en_US'

    switch (code) {
        case 'id':
        case 'in':
            code = 'id'
            break
    }

    return code
}

export default getLanguageCode
