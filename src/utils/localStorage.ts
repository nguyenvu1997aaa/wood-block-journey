import { merge } from 'merge-anything'

export const getByKeyLocalStorage = (itemKey: string): unknown => {
    try {
        const data = localStorage.getItem(itemKey)
        if (data === null) return null

        const decoded = GameCore.Utils.Json.decode(data)
        return decoded
    } catch (error) {
        return null
    }
}

export const writeByKeyLocalStorage = (itemKey: string, data: TObject): boolean => {
    try {
        const currentData = getByKeyLocalStorage(itemKey)

        let correctData = {}

        if (GameCore.Utils.Valid.isObject(currentData)) {
            correctData = currentData
        }

        const cloneData = GameCore.Utils.Json.clone(data)

        if (!GameCore.Utils.Valid.isObject(cloneData)) return false

        const cleanData = GameCore.Utils.Object.clear(cloneData)
        const newData = merge(correctData, cleanData)

        // console.log({ cleanData, currentData, newData });

        const dataEncoded = GameCore.Utils.Json.encode(newData)
        localStorage.setItem(itemKey, dataEncoded)

        return true
    } catch (error) {
        return false
    }
}

export const removeKeyLocalStorage = (itemKey: string): boolean => {
    try {
        localStorage.removeItem(itemKey)

        return true
    } catch (error) {
        return false
    }
}

export const isLocalStorageAvailability = (): boolean => {
    try {
        const success = writeByKeyLocalStorage('test', { first: true })

        return success
    } catch {
        return false
    }
}
