const SAMPLE_ERROR = [
    'INVALID_PARAM',
    'SAME_CONTEXT',
    'NETWORK_FAILURE',
    'PENDING_REQUEST',
    'CLIENT_UNSUPPORTED_OPERATION',
]

function getRandomError() {
    return SAMPLE_ERROR[Math.floor(SAMPLE_ERROR.length * Math.random())]
}

let playersData = []
const useLog = false

let maxPlayers = playersData.length // for list connected player

let pName = 'Default Name'
let pId = '1'
let pASID = '1'
let pPhoto = ''
let pSignature = '1'

/*
 * Helper Functions
 */

const FBUtils = {
    log: function log() {
        if (!useLog) return
        const args = []
        args.push('[FBInstantMock Mock]:')

        for (let i = 0; i < arguments.length; i++) {
            args.push(arguments[i])
        }

        console.log(...args)
    },
    getQueryString: function getQueryString() {
        const qd = {}
        if (location.search)
            location.search
                .substr(1)
                .split('&')
                .forEach((item) => {
                    const s = item.split('=')
                    const k = s[0]
                    const v = s[1] && decodeURIComponent(s[1])
                        ; (qd[k] = qd[k] || []).push(v)
                })
        return qd
    },
    returnAndLog: function returnAndLog(value) {
        FBUtils.log(value)
        return value
    },
    returnUserData: function returnUserData(value) {
        const initialized = FBInstantMock.__mockState.initialized

        if (initialized) {
            return FBUtils.returnAndLog(value)
        }

        FBUtils.log('User Data is not available until startGameAsync has resolved')
        return null
    },
    getFromLocalStorage: function getFromLocalStorage(store, keys) {
        return new Promise((resolve) => {
            let data = localStorage.getItem(store)
            const response = {}

            if (data) {
                data = JSON.parse(data)
                keys.forEach((key) => {
                    if (data[key] !== 'undefined') {
                        response[key] = data[key]
                    }
                })
            }

            FBUtils.log(response)
            resolve(response)
        })
    },
    writeToLocalStorage: function writeToLocalStorage(store, obj) {
        return new Promise((resolve) => {
            const currentData = JSON.parse(localStorage.getItem(store))
            const data = { ...currentData, ...obj }

            FBUtils.log(JSON.stringify(data))
            localStorage.setItem(store, JSON.stringify(data))
            resolve()
        })
    },
}

const FBInstantMock = {
    __mockState: {
        initialized: false,
    },
    leaderboard: (index, isPlayer = false) => {
        let rank = index + 1
        if (isPlayer) rank = 15
        return {
            getRank: function getRank() {
                return rank
            },
            getScore: function getScore() {
                return Math.floor(1000 / rank)
            },
            getExtraData: function getExtraData() {
                return JSON.stringify({})
            },
            getPlayer: function getPlayer() {
                return FBInstantMock.leader(index, isPlayer)
            },
        }
    },

    leader: (index, isPlayer) => {
        let random = Math.floor(Math.random() * Math.floor(200))
        const player = isPlayer ? playersData[0] : {}

        return {
            getID: function getID() {
                return player.playerId || random
            },
            getName: function getName() {
                return player.name || `Bot ${random}`
            },
            getPhoto: function getPhoto() {
                return player.photo || `https://api.adorable.io/avatars/285/${random}@adorable.png`
            },
        }
    },

    player: {
        getName: function getName() {
            return FBUtils.returnUserData(pName)
        },
        getPhoto: function getPhoto() {
            return FBUtils.returnUserData(pPhoto)
        },
        getID: function getID() {
            return FBUtils.returnUserData(pId)
        },
        getASIDAsync: function getASIDAsync() {
            return FBUtils.returnUserData(pASID)
        },
        getDataAsync: function getDataAsync(keys) {
            FBUtils.log('player.getDataAsync')
            return FBUtils.getFromLocalStorage('fbPlayerData', keys)
        },
        setDataAsync: function setDataAsync(obj) {
            FBUtils.log('player.setDataAsync')
            return FBUtils.writeToLocalStorage('fbPlayerData', obj)
        },
        flushDataAsync: function flushDataAsync() {
            return new Promise((resolve) => {
                FBUtils.log('player.flushDataAsync')
                FBUtils.writeToLocalStorage('fbPlayerData', {}).finally(() => {
                    resolve()
                })
            })
        },
        getConnectedPlayersAsync: function getConnectedPlayersAsync() {
            return new Promise((resolve) => {
                let connectedPlayers = []
                const initialized = FBInstantMock.__mockState.initialized

                if (initialized) {
                    for (let id = 0; id < maxPlayers; id++) {
                        const _playersData$id = playersData[id]
                        const playerId = _playersData$id.playerId
                        const name = _playersData$id.name
                        const photo = _playersData$id.photo
                        connectedPlayers.push({
                            id: playerId,
                            name: name,
                            photo: photo,
                            getID() {
                                return this.id
                            },
                            getName() {
                                return this.name
                            },
                            getPhoto() {
                                return this.photo
                            },
                        })
                    }
                } else {
                    FBUtils.log(
                        'getConnectedPlayersAsync',
                        'Connected players data is not available before startGameAsync resolves'
                    )
                }

                FBUtils.log('getConnectedPlayersAsync', 'players: ', connectedPlayers)
                resolve(connectedPlayers)
            })
        },
        getSignedPlayerInfoAsync: function getSignedPlayerInfoAsync() {
            return new Promise((resolve) => {
                const signedPlayerInfo = {
                    getSignature: function getSignature() {
                        return pSignature
                    },
                    getPlayerID: function getPlayerID() {
                        return pId
                    },
                }
                resolve(signedPlayerInfo)
            })
        },
    },
    context: {
        id: FBUtils.getQueryString().context_source_id || '',
        type: FBUtils.getQueryString().context_type || 'SOLO',
        getID: function getID() {
            return FBInstantMock.context.id
        },
        chooseAsync: function chooseAsync() {
            return new Promise((resolve, reject) => {
                const popup = createElementFromHTML(
                    '<div style="z-index: 1000000000; display: flex; align-items: center; height: 100%; width: 56vh;max-width:100vh; background-color: rgba(31, 120, 136, 0.48); position: absolute;margin:auto;left:0;right:0"></div'
                )
                const elements = playersData
                    .filter((p) => p.playerId != pId)
                    .map((p) => {
                        const el =
                            createElementFromHTML(`<div style="cursor: pointer;width: 100%;height: 100px;background-color: rgb(255, 255, 255);color:black;display: flex;justify-content: space-evenly;align-items: center;z-index: inherit;"><div style="width: 85px;height: 85px;overflow: hidden;border-radius: 50%;"><img style="height:100%"src="${p.photo}"/></div><p>${p.name}</p><button style="width:100px;height:70%;pointer-events:none">Play</button></div>
                        `)
                        el.onclick = (e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            FBUtils.log('context.chooseAsync')
                            FBInstantMock.context.id = '123456789'
                            FBInstantMock.context.type = 'THREAD'
                            resolve(FBInstantMock.context.id)
                            popup.remove()
                        }
                        popup.appendChild(el)
                        return el
                    })

                const buttonClose = createElementFromHTML(
                    `<button style="width:100px;height:70px;cursor:pointer;position:absolute;right: 10px;top:10px">Close</button>`
                )
                buttonClose.onclick = (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    reject({ code: 'USER_INPUT', message: 'User close popup!' })
                    popup.remove()
                }
                popup.appendChild(buttonClose)
                FBUtils.log('context.chooseAsync')
                FBInstantMock.context.id = '123456789'
                FBInstantMock.context.type = 'THREAD'
                setTimeout(() => {
                    const r = Math.random() * 100
                    const isFailed = r < window.GameCore.Configs.MatchMockFailRate
                    if (isFailed) {
                        reject({ code: getRandomError(), message: 'Random error' })
                        return
                    }
                    document.body.append(popup)
                }, 500)
            })
        },
        switchAsync: function switchAsync(contextId) {
            return new Promise((resolve) => {
                FBUtils.log('context.switchAsync')
                FBInstantMock.context.id = contextId
                FBInstantMock.context.type = 'THREAD'
                resolve(contextId)
            })
        },
        createAsync: function createAsync() {
            return new Promise((resolve, reject) => {
                const opponent = playersData.filter((p) => p.playerId != pId)[0]
                const popup = createElementFromHTML(
                    `<div style="height: 40vh;width: 53vh;max-width: 95vw;position:absolute;background-color: rgba(31, 120, 136, 0.48);border-radius: 2vh;margin: auto;right: 0;left: 0;top: 0;bottom: 0;display: flex;flex-direction:column;justify-content:space-evenly;"><div style="display:flex; justify-content:center; width: 100%"><div style="width: 100px;height: 100px;overflow: hidden;border-radius: 50%;"><img style="height:100%"src="${pPhoto}"/></div><div style="width: 100px;height: 100px;overflow: hidden;border-radius: 50%;"><img style="height:100%"src="${opponent.photo}"/></div></div><p style="color: white;font-size: 21px;text-align: center;margin: 10px 40px 10px 40px;">Send an invitation to play Game<br>through Messenger.</p></div>`
                )
                const buttonPlay = createElementFromHTML(
                    '<button style="border: none;background-color: #1877f2;color: #fff;width: 90%;height: 50px;border-radius: 15px;margin-left: auto;margin-right: auto;font-size: 20px;cursor: pointer;">Play</button>'
                )
                buttonPlay.onclick = (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    FBUtils.log('context.chooseAsync')
                    FBInstantMock.context.id = '123456789'
                    FBInstantMock.context.type = 'THREAD'
                    resolve(FBInstantMock.context.id)
                    popup.remove()
                }
                const buttonClose = createElementFromHTML(
                    '<button style="border: none;background-color: #1877f2;color: #fff;width: 80px;height: 50px;font-size: 20px;cursor: pointer;position:absolute;top:10px;right:10px;border-radius: 10px;">Close</button>'
                )
                buttonClose.onclick = (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    reject({ code: 'USER_INPUT', message: 'User close popup!' })
                    popup.remove()
                }
                popup.append(buttonPlay)
                popup.append(buttonClose)

                setTimeout(() => {
                    const r = Math.random() * 100
                    const isFailed = r < window.GameCore.Configs.MatchMockFailRate
                    if (isFailed) {
                        reject({ code: getRandomError(), message: 'Random error' })
                        return
                    }
                    document.body.append(popup)
                }, 500)
            })
        },
        getType: function getType() {
            return FBUtils.returnAndLog(FBInstantMock.context.type)
            // return Utils.returnAndLog('THREAD');
        },
        isSizeBetween: function isSizeBetween() {
            // return Utils.returnAndLog(true);
            return FBUtils.returnAndLog(false)
        },
        getPlayersAsync: function getPlayersAsync() {
            return new Promise((resolve) => {
                const players = playersData.map((p) => ({
                    getID: function getID() {
                        return p.playerId
                    },
                    getName: function getName() {
                        return p.name
                    },
                    getPhoto: function getPhoto() {
                        return p.photo
                    },
                }))
                FBUtils.log('context.getPlayersAsync', 'players: ', players)
                resolve(players)
            })
        },
    },
    getLocale: function getLocale() {
        return 'vi_VN'
    },
    initializeAsync: function initializeAsync() {
        const playerMock = window.GameCore?.Configs?.PlayerMock || {}
        const opponentMock = window.GameCore?.Configs?.OpponentMock || {}

        playersData = [
            {
                name: playerMock.name || 'Mock1',
                photo: playerMock.photo || 'https://reqres.in/img/faces/2-image.jpg',
                playerId: playerMock.id || '1',
                signature: playerMock.signature || '1',
            },
            {
                name: opponentMock.name || 'Mock2',
                photo: opponentMock.photo || 'https://reqres.in/img/faces/3-image.jpg',
                playerId: opponentMock.id || '2',
                signature: opponentMock.signature || '2',
            },
        ]

        const queryString = FBUtils.getQueryString()

        var playerIndex = 0 // for mock opponent
        if (queryString.playerId && queryString.playerId[0] === playersData[1].playerId) {
            playerIndex = 1 // for mock opponent
        }

        maxPlayers = playersData.length // for list connected player

        pName = playersData[playerIndex].name
        pId = playersData[playerIndex].playerId
        pPhoto = playersData[playerIndex].photo
        pSignature = playersData[playerIndex].signature

        return new Promise(function (resolve) {
            // Inject mock css
            // var stylesheet = document.createElement('link');
            // stylesheet.href = 'mock.css';
            // stylesheet.rel = 'stylesheet';
            // stylesheet.type = 'text/css';
            // document.head.appendChild(stylesheet);
            FBUtils.log('initializeAsync')
            FBInstantMock.__mockState.initialized = true
            resolve()
        })
    },
    setLoadingProgress: function setLoadingProgress() {
        //
    },
    startGameAsync: function startGameAsync() {
        return new Promise((resolve) => {
            FBUtils.log('startGameAsync', 'Showing game start dialog')

            FBInstantMock.__mockState.initialized = true
            resolve()
        })
    },
    quit: function quit() {
        FBUtils.log('QUIT was called. At this point the game will exit')
    },
    updateAsync: function updateAsync(config) {
        logMessage(config.data || {})
        return new Promise((resolve, reject) => {
            FBUtils.log('updateAsync')

            if (config.image) {
                resolve()
            } else {
                reject()
            }
        })
    },
    getEntryPointData: function getEntryPointData() {
        // example: http://localhost:8080/?entryPointData={a:1,b:2,c:3}');
        const queryString = FBUtils.getQueryString()
        FBUtils.log(
            'getEntryPointData',
            'query string: ',
            queryString,
            'entry point data: ',
            queryString.entryPointData
        )

        if (queryString.entryPointData) {
            return JSON.parse(decodeURIComponent(queryString.entryPointData[0]))
        }

        return null
    },
    getEntryPointAsync: function getEntryPointAsync() {
        return new Promise((resolve) => {
            resolve('admin_message')
        })
    },
    setSessionData: function setSessionData(object) {
        FBUtils.log(
            'setSessionData',
            'Object to be persisted',
            object,
            '(Please note, while using the mock SDK, setSessionData will have no effect.)'
        )
    },
    getPlatform: function getPlatform() {
        //? this check followed YANDEX sdk
        const deviceInfo = 'undefined' == typeof window ? '' : window.navigator.userAgent.toLowerCase()
        const isHave = (deviceName) => deviceInfo.indexOf(deviceName) !== -1
        const usefulFunc = {
            windows: () => isHave('windows'),
            blackberry: () => isHave('blackberry') || isHave('bb10') || isHave('rim'),
            fxos: () => (isHave('(mobile') || isHave('(tablet')) && isHave(' rv:'),

            androidPhone: () => usefulFunc.android() && isHave('mobile'),
            androidTablet: () => usefulFunc.android() && !isHave('mobile'),
            blackberryPhone: () => usefulFunc.blackberry() && !isHave('tablet'),
            blackberryTablet: () => usefulFunc.blackberry() && isHave('tablet'),
            fxosPhone: () => usefulFunc.fxos() && isHave('mobile'),
            fxosTablet: () => usefulFunc.fxos() && isHave('tablet'),
            iphone: () => !usefulFunc.windows() && isHave('iphone'),
            ipad: () => isHave('ipad'),
            ipod: () => isHave('ipod'),
            meego: () => isHave('meego'),
            windowsPhone: () => usefulFunc.windows() && isHave('phone'),
            windowsTablet: () => usefulFunc.windows() && isHave('touch') && !usefulFunc.windowsPhone(),

            android: () => !usefulFunc.windows() && isHave('android'),
            ios: () => usefulFunc.iphone() || usefulFunc.ipod() || usefulFunc.ipad(),
            mobile: function () {
                return (
                    usefulFunc.androidPhone() ||
                    usefulFunc.iphone() ||
                    usefulFunc.ipod() ||
                    usefulFunc.windowsPhone() ||
                    usefulFunc.blackberryPhone() ||
                    usefulFunc.fxosPhone() ||
                    usefulFunc.meego()
                )
            },
            tablet: () => {
                return (
                    usefulFunc.ipad() ||
                    usefulFunc.androidTablet() ||
                    usefulFunc.blackberryTablet() ||
                    usefulFunc.windowsTablet() ||
                    usefulFunc.fxosTablet()
                )
            },
        }

        const isIOSDevice = () => {
            return usefulFunc.ios()
        }
        const isAndroidDevice = () => {
            return usefulFunc.android()
        }
        const isMobileDevice = () => {
            return usefulFunc.mobile()
        }
        const isTabletDevice = () => {
            return usefulFunc.tablet()
        }

        const isIOS = isIOSDevice()
        if (isIOS) return 'IOS'

        const isAndroid = isAndroidDevice()
        if (isAndroid) return 'ANDROID'

        const isMobile = isMobileDevice()
        const isTablet = isTabletDevice()
        if (isMobile || isTablet) return 'MOBILE_WEB'

        return 'WEB'
    },
    getSDKVersion: function getSDKVersion() {
        return '6.3'
    },
    getSupportedAPIs: function getSupportedAPIs() {
        const supportedAPIs = []

        for (let prop in FBInstantMock) {
            supportedAPIs.push(prop)
        }

        for (let prop in FBInstantMock.player) {
            supportedAPIs.push(`player.${prop}`)
        }

        for (let prop in FBInstantMock.context) {
            supportedAPIs.push(`context.${prop}`)
        }

        return supportedAPIs
    },
    shareAsync: function shareAsync() {
        return true
    },
    switchGameAsync: function switchGameAsync() {
        return Promise.reject(
            new Error('FBInstantMock.switchAsync is not available in the Mocked SDK.')
        )
    },
    logEvent: function logEvent() {
        // FBUtils.log('logEvent', eventName, value, parameters)
        return null
    },
    onPause: function onPause(callback) {
        window.onblur = () => {
            FBUtils.log('onPause', 'Interruption event triggered')
            callback()
        }
    },
    getLeaderboardAsync: function getLeaderboardAsync() {
        return Promise.resolve({
            getEntriesAsync: function getEntriesAsync(limit, offset) {
                const entries = []
                for (let index = 0; index++; index < limit) {
                    entries.push(FBInstantMock.leaderboard(index + offset))
                }
                return Promise.resolve(entries)
            },
            getConnectedPlayerEntriesAsync: function getConnectedPlayerEntriesAsync(limit, offset) {
                const entries = []
                for (let index = 0; index++; index < limit) {
                    entries.push(FBInstantMock.leaderboard(index + offset))
                }
                return Promise.resolve(entries)
            },
            getPlayerEntryAsync: function getPlayerEntryAsync() {
                return Promise.resolve(FBInstantMock.leaderboard(0, true))
            },
            setScoreAsync: function setScoreAsync() {
                return Promise.resolve(FBInstantMock.leaderboard(0, true))
            },
        })
    },
    postSessionScoreAsync: function postSessionScoreAsync() {
        return Promise.resolve()
    },

    matchPlayerAsync: function matchPlayerAsync() {},
    loadBannerAdAsync: function loadBannerAdAsync() {
        return Promise.resolve
    },
    hideBannerAdAsync: function hideBannerAdAsync() {
        return Promise.resolve
    },
}

window.FBInstant = FBInstantMock

const decode = function (params) {
    var obj = {}
    var parts = params.split('&')

    parts.each(function (kvs) {
        var kvp = kvs.split('=')
        var key = kvp[0]
        var val = unescape(kvp[1])

        if (/\[\w+\]/.test(key)) {
            var rgx = /\[(\w+)\]/g
            var top = /^([^\\[]+)/.exec(key)[0]
            var sub = rgx.exec(key)

            if (!obj[top]) {
                obj[top] = {}
            }

            var unroot = function (o) {
                if (sub == null) {
                    return
                }

                var sub_key = sub[1]

                sub = rgx.exec(key)

                if (!o[sub_key]) {
                    o[sub_key] = sub ? {} : val
                }

                unroot(o[sub_key])
            }

            unroot(obj[top])

            //array
        } else if (/\[\]$/.test(key)) {
            key = /(^\w+)/.exec(key)[0]
            if (!obj[key]) {
                obj[key] = []
            }
            obj[key].push(val)
        } else {
            obj[key] = val
        }
    })

    return obj
}

const encode = (obj) => {
    return encodeURIComponent(JSON.stringify(obj))
}

const logMessage = (entryPointData) => {
    const opponentId =
        playersData[0].playerId === pId ? playersData[1].playerId : playersData[0].playerId
    console.log(
        `Link to receive message: \n${document.location.origin + document.location.pathname
        }?playerId=${opponentId}&context_source_id=123456789&context_type=THREAD&entryPointData=${encode(
            entryPointData
        )}}`
    )
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div')
    div.innerHTML = htmlString.trim()

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild
}
