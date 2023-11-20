const fs = require('fs')
const {
    FRAME_GEM_TILED_MAP,
    PIECE_TYPES_TILED_MAP,
    FRAME_GEM_TILED_MAP_FRAME,
} = require('./test-maps-test')
const dirname = './assets/json/levels/'
const errorFiles = []
const argv = process.argv
const argv1 = argv[2]
const colorGreen = '\x1b[32m%s\x1b[0m'
const colorRed = '\x1b[31m%s\x1b[0m'

const main = () => {
    //

    if (argv1) {
        console.log('\x1b[36m%s\x1b[0m', '--------------- START BY ARG ---------------')
        testByArg()
    } else {
        console.log('\x1b[36m%s\x1b[0m', '--------------- START ALL FILES ---------------')
        testAllFiles()
    }
}

const testByArg = () => {
    fs.readFile(argv1, function (err, data) {
        if (err) {
            console.log(err)
            return
        }

        const result = checkMap(data)
        let color = colorGreen

        if (!result) {
            color = colorRed
        }

        console.log(color, `${result ? 'Success' : 'Fail'}`)

        if (!result) {
            errorFiles.push(argv1)
            return
        }

        const target = getTargetFromMap(data)

        if (!target) {
            console.log(colorRed, `Error target`)

            return
        }

        console.log(colorGreen, `Target: ${target}`)

        const gemOnBoard = getGemOnBoard(data)

        console.log(colorGreen, `Onboard: ${gemOnBoard}`)

        const totalPieces = getTotalPieces(data)

        console.log(colorGreen, `Total Pieces: ${totalPieces}`)

        getProgress(data)

        const amountPieces = getPieceData(data)

        console.log(colorGreen, `Amount Pieces: ${amountPieces}`)
    })
}

const testAllFiles = () => {
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            console.log(err)
            return
        }

        filenames.forEach(function (filename) {
            fs.readFile(dirname + filename, 'utf-8', function (err, data) {
                console.log(
                    '\x1b[36m%s\x1b[0m',
                    `--------------- Checking ${filename} ---------------`
                )
                if (err) {
                    console.log(err)
                    return
                }

                const result = checkMap(data)
                let color = colorGreen

                if (!result) {
                    color = colorRed
                }

                console.log(color, `${result ? 'Success' : 'Fail'}`)

                if (!result) {
                    errorFiles.push(filename)
                    return
                }

                if (!result) {
                    errorFiles.push(argv1)
                    return
                }

                const target = getTargetFromMap(data)

                if (!target) {
                    console.log(colorRed, `Error target`)

                    return
                }

                console.log(colorGreen, `Target: ${target}`)

                const gemOnBoard = getGemOnBoard(data)

                console.log(colorGreen, `Onboard: ${gemOnBoard}`)

                const totalPieces = getTotalPieces(data)

                console.log(colorGreen, `Total Pieces: ${totalPieces}`)

                getProgress(data)

                const amountPieces = getPieceData(data)

                console.log(colorGreen, `Amount Pieces: ${amountPieces}`)
            })
        })
    })
}

const checkMap = (json) => {
    if (!json) return false

    const { layers } = JSON.parse(json)

    if (!layers || layers.length < 2) return false

    const board = layers[0]
    const pieces = layers[1]

    if (!board || !pieces) return false

    const resultBoard = checkBoard(board)

    if (!resultBoard) {
        console.log(colorRed, `Error board`)
        return false
    }

    const resultPieces = checkPieces(pieces.objects)

    if (!resultPieces) {
        console.log(colorRed, `Error pieces`)
        return false
    }

    return true
}

const checkBoard = (board) => {
    const { data, width } = board

    if (!data || !width || data.length === 0) return false

    if (data.length % width !== 0) return false

    for (let i = 0; i < data.length; i++) {
        const value = data[i]

        if (value === 0) continue

        if (value > 0 && !FRAME_GEM_TILED_MAP[value - 1]) {
            return false
        }
    }

    return true
}

const checkPieces = (pieces) => {
    for (let i = 0; i < pieces.length; i++) {
        const value = pieces[i]
        const { type, properties } = value

        if (!type) return false

        const pieceItem = PIECE_TYPES_TILED_MAP[type]

        if (!pieceItem) return false

        if (!properties) continue

        const { data } = pieceItem

        const resultValidProperties = validPropertiesPiece(properties, data)

        if (!resultValidProperties) return false
    }

    return true
}

const validPropertiesPiece = (properties, pieceData) => {
    const gem_ids = properties.filter((item) => {
        return item.name === 'gem_id'
    })

    const gem_positions = properties.filter((item) => {
        return item.name === 'gem_position'
    })

    if (!gem_ids && gem_ids.length === 0 && !gem_positions && gem_positions.length === 0)
        return false

    const gem_id = gem_ids[0]
    const gem_position = gem_positions[0]

    const value_gem_id = gem_id.value
    const value_gem_position = gem_position.value

    const value_gem_id_item = value_gem_id.split(',')
    const value_gem_position_item = value_gem_position.split(',')

    if (value_gem_id_item.length != value_gem_position_item.length) {
        console.log(colorRed, { value_gem_id, value_gem_position })
        return false
    }

    for (let i = 0; i < value_gem_id_item.length; i++) {
        const id = value_gem_id_item[i]

        if (!FRAME_GEM_TILED_MAP[id]) {
            console.log(colorRed, { value_gem_id, value_gem_position })
            return false
        }
    }

    let count = 0

    for (let i = 0; i < pieceData.length; i++) {
        for (let j = 0; j < pieceData[i].length; j++) {
            if (pieceData[i][j] === 1) count++
        }
    }

    if (count < value_gem_position) return false

    return true
}

const getTargetFromMap = (json) => {
    if (!json) return false

    const { properties } = JSON.parse(json)

    if (!properties || properties.length === 0) return false

    const target = properties.filter((item) => item.name === 'target')[0].value

    if (!target) return false

    const targetType = properties.filter((item) => item.name === 'typeLevel')[0]

    if (!targetType) return false

    let result = `${targetType.value} - `

    switch (targetType.value) {
        case 'collect':
            result += getTargetCollection(target)

            break
    }

    return result
}

const getTargetCollection = (target) => {
    let result = ''
    const jsonTarget = JSON.parse(
        target.replaceAll('{', '{"').replaceAll(', ', ', "').replaceAll(':', '":')
    )
    const keysTarget = Object.keys(jsonTarget)

    for (let i = 0; i < keysTarget.length; i++) {
        const key = keysTarget[i]
        const amountTarget = jsonTarget[key]
        const frame = FRAME_GEM_TILED_MAP_FRAME[key]

        result += `${key}<${frame}>: ${amountTarget}, `
    }

    return result.slice(0, -2)
}

const getGemOnBoard = (json) => {
    if (!json) return false

    const { layers } = JSON.parse(json)
    const board = layers[0].data
    const itemGem = {}

    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) continue

        if (!itemGem[board[i] - 1]) {
            itemGem[board[i] - 1] = 1
        } else {
            itemGem[board[i] - 1]++
        }
    }

    const keys = Object.keys(itemGem)
    let str = `${keys.length} pieces (`

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const frame = FRAME_GEM_TILED_MAP_FRAME[key]
        const amount = itemGem[key]

        str += `${amount} <${frame}>, `
    }

    str = str.slice(0, -2)
    str += ')'

    return str
}

const getTotalPieces = (json) => {
    if (!json) return false

    const { layers } = JSON.parse(json)
    const spawnOrder = layers[1].objects
    let score = 0

    const itemGem = {}

    for (let i = 0; i < spawnOrder.length; i++) {
        const itemSpawn = spawnOrder[i]
        const { type, properties } = itemSpawn
        const { data } = PIECE_TYPES_TILED_MAP[type]
        let count = 0
        let gemIds = ''
        let gemPositions = ''

        if (properties) {
            gemIds = properties[0].value.split(',')
            gemPositions = properties[1].value.split(',')
        }

        for (let j = 0; j < data.length; j++) {
            const row = data[j]
            for (let j1 = 0; j1 < row.length; j1++) {
                let value = data[j][j1]

                if (value === 0) continue

                score++

                if (gemPositions[count]) {
                    value = gemIds[count]
                }

                if (!itemGem[value]) {
                    itemGem[value] = 1
                } else {
                    itemGem[value]++
                }

                count++
            }
        }
    }

    let str = `${spawnOrder.length} - Score: ${score} (`
    const keys = Object.keys(itemGem)

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const frame = FRAME_GEM_TILED_MAP_FRAME[key]
        const amount = itemGem[key]

        str += `${amount} <${frame}>, `
    }

    str = str.slice(0, -2)
    str += ')'

    return str
}

const getProgress = (json) => {
    if (!json) return false

    const { layers, properties } = JSON.parse(json)
    const spawnOrder = layers[1].objects

    if (!properties || properties.length === 0) return false

    const target = properties.filter((item) => item.name === 'target')[0].value

    if (!target) return false

    const jsonTarget = JSON.parse(
        target.replaceAll('{', '{"').replaceAll(', ', ', "').replaceAll(':', '":')
    )

    const keysTarget = Object.keys(jsonTarget)

    for (let i = 0; i < keysTarget.length; i++) {
        const progress = calcProgressPieces(keysTarget[i], spawnOrder, jsonTarget, layers)

        console.log(colorGreen, `${progress}`)
    }
}

const calcProgressPieces = (key, spawnOrder, jsonTarget, layers) => {
    const frame = FRAME_GEM_TILED_MAP_FRAME[key]
    const amountTarget = jsonTarget[key]
    const board = layers[0].data
    let amountOnBoard = 0
    let result = `Progress <${frame}>: 0 ---> `
    let score = 0
    let pieceIndex = 1

    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) continue

        if (board[i] - 1 !== parseInt(key)) continue

        amountOnBoard++
    }

    for (let i = 0; i < spawnOrder.length; i++) {
        const itemSpawn = spawnOrder[i]
        const { type, properties } = itemSpawn
        const { data } = PIECE_TYPES_TILED_MAP[type]
        let count = 0
        let gemIds = ''
        let gemPositions = ''

        if (properties) {
            gemIds = properties[0].value.split(',')
            gemPositions = properties[1].value.split(',')
        }

        for (let j = 0; j < data.length; j++) {
            const row = data[j]
            for (let j1 = 0; j1 < row.length; j1++) {
                const value = data[j][j1]
                if (value === 0) continue

                score++

                if (gemIds.includes(key) && gemPositions[count] && amountOnBoard < amountTarget) {
                    result += `${pieceIndex}<${score}> ---> `

                    amountOnBoard++
                }

                count++
            }
        }

        pieceIndex++
    }

    return result.slice(0, -6)
}

const getPieceData = (json) => {
    if (!json) return false

    const { layers } = JSON.parse(json)
    const spawnOrder = layers[1].objects
    const result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let i = 0; i < spawnOrder.length; i++) {
        const itemSpawn = spawnOrder[i]
        const { type } = itemSpawn
        const { data } = PIECE_TYPES_TILED_MAP[type]
        let count = 0

        for (let j = 0; j < data.length; j++) {
            const row = data[j]
            for (let j1 = 0; j1 < row.length; j1++) {
                const value = data[j][j1]
                if (value === 0) continue

                count++
            }
        }

        result[count]++
    }

    let str = ''

    for (let i = 0; i < result.length; i++) {
        if (result[i] === 0) continue

        str += `${i} pieces: ${result[i]} - `
    }

    return str.slice(0, -3)
}

main()
