'use strict'

var _this5 = void 0

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object)
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object)
        enumerableOnly &&
            (symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable
            })),
            keys.push.apply(keys, symbols)
    }
    return keys
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {}
        i % 2
            ? ownKeys(Object(source), !0).forEach(function (key) {
                _defineProperty(target, key, source[key])
            })
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
                : ownKeys(Object(source)).forEach(function (key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
                })
    }
    return target
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        })
    } else {
        obj[key] = value
    }
    return obj
}

function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
        throw new TypeError('Cannot instantiate an arrow function')
    }
}

var SAMPLE_ERROR = [
    'INVALID_PARAM',
    'SAME_CONTEXT',
    'NETWORK_FAILURE',
    'PENDING_REQUEST',
    'CLIENT_UNSUPPORTED_OPERATION',
]

function getRandomError() {
    return SAMPLE_ERROR[Math.floor(SAMPLE_ERROR.length * Math.random())]
}

var playersData = []
var useLog = false
var maxPlayers = playersData.length // for list connected player

var pName = 'Default Name'
var pId = '1'
var pASID = '1'
var pPhoto = ''
var pSignature = '1'
/*
 * Helper Functions
 */

var FBUtils = {
    log: function log() {
        var _console

        if (!useLog) return
        var args = []
        args.push('[FBInstantMock Mock]:')

        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i])
        }

        ;(_console = console).log.apply(_console, args)
    },
    getQueryString: function getQueryString() {
        var _this = this

        var qd = {}
        if (location.search)
            location.search
                .substr(1)
                .split('&')
                .forEach(
                    function (item) {
                        _newArrowCheck(this, _this)

                        var s = item.split('=')
                        var k = s[0]
                        var v = s[1] && decodeURIComponent(s[1])
                            ; (qd[k] = qd[k] || []).push(v)
                    }.bind(this)
                )
        return qd
    },
    returnAndLog: function returnAndLog(value) {
        FBUtils.log(value)
        return value
    },
    returnUserData: function returnUserData(value) {
        var initialized = FBInstantMock.__mockState.initialized

        if (initialized) {
            return FBUtils.returnAndLog(value)
        }

        FBUtils.log('User Data is not available until startGameAsync has resolved')
        return null
    },
    getFromLocalStorage: function getFromLocalStorage(store, keys) {
        var _this2 = this

        return new Promise(
            function (resolve) {
                var _this3 = this

                _newArrowCheck(this, _this2)

                var data = localStorage.getItem(store)
                var response = {}

                if (data) {
                    data = JSON.parse(data)
                    keys.forEach(
                        function (key) {
                            _newArrowCheck(this, _this3)

                            if (data[key] !== 'undefined') {
                                response[key] = data[key]
                            }
                        }.bind(this)
                    )
                }

                FBUtils.log(response)
                resolve(response)
            }.bind(this)
        )
    },
    writeToLocalStorage: function writeToLocalStorage(store, obj) {
        var _this4 = this

        return new Promise(
            function (resolve) {
                _newArrowCheck(this, _this4)

                var currentData = JSON.parse(localStorage.getItem(store))

                var data = _objectSpread(_objectSpread({}, currentData), obj)

                FBUtils.log(JSON.stringify(data))
                localStorage.setItem(store, JSON.stringify(data))
                resolve()
            }.bind(this)
        )
    },
}
var FBInstantMock = {
    __mockState: {
        initialized: false,
    },
    leaderboard: function leaderboard(index) {
        var isPlayer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
        var rank = index + 1
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
    leader: function leader(index, isPlayer) {
        _newArrowCheck(this, _this5)

        var random = Math.floor(Math.random() * Math.floor(200))
        var player = isPlayer ? playersData[0] : {}
        return {
            getID: function getID() {
                return player.playerId || random
            },
            getName: function getName() {
                return player.name || 'Bot '.concat(random)
            },
            getPhoto: function getPhoto() {
                return (
                    player.photo ||
                    'https://api.adorable.io/avatars/285/'.concat(random, '@adorable.png')
                )
            },
        }
    }.bind(void 0),
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
            var _this9 = this

            return new Promise(
                function (resolve) {
                    var _this10 = this

                    _newArrowCheck(this, _this9)

                    FBUtils.log('player.flushDataAsync')
                    FBUtils.writeToLocalStorage('fbPlayerData', {})['finally'](
                        function () {
                            _newArrowCheck(this, _this10)

                            resolve()
                        }.bind(this)
                    )
                }.bind(this)
            )
        },
        getConnectedPlayersAsync: function getConnectedPlayersAsync() {
            var _this11 = this

            return new Promise(
                function (resolve) {
                    _newArrowCheck(this, _this11)

                    var connectedPlayers = []
                    var initialized = FBInstantMock.__mockState.initialized

                    if (initialized) {
                        for (var id = 0; id < maxPlayers; id++) {
                            var _playersData$id = playersData[id]
                            var playerId = _playersData$id.playerId
                            var name = _playersData$id.name
                            var photo = _playersData$id.photo
                            connectedPlayers.push({
                                id: playerId,
                                name: name,
                                photo: photo,
                                getID: function getID() {
                                    return this.id
                                },
                                getName: function getName() {
                                    return this.name
                                },
                                getPhoto: function getPhoto() {
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
                }.bind(this)
            )
        },
        getSignedPlayerInfoAsync: function getSignedPlayerInfoAsync() {
            var _this12 = this

            return new Promise(
                function (resolve) {
                    _newArrowCheck(this, _this12)

                    var signedPlayerInfo = {
                        getSignature: function getSignature() {
                            return pSignature
                        },
                        getPlayerID: function getPlayerID() {
                            return pId
                        },
                    }
                    resolve(signedPlayerInfo)
                }.bind(this)
            )
        },
    },
    context: {
        id: FBUtils.getQueryString().context_source_id || '',
        type: FBUtils.getQueryString().context_type || 'SOLO',
        getID: function getID() {
            return FBInstantMock.context.id
        },
        chooseAsync: function chooseAsync() {
            var _this13 = this

            return new Promise(
                function (resolve, reject) {
                    var _this14 = this

                    _newArrowCheck(this, _this13)

                    var popup = createElementFromHTML(
                        '<div style="z-index: 1000000000; display: flex; align-items: center; height: 100%; width: 56vh;max-width:100vh; background-color: rgba(31, 120, 136, 0.48); position: absolute;margin:auto;left:0;right:0"></div'
                    )
                    var elements = playersData
                        .filter(
                            function (p) {
                                _newArrowCheck(this, _this14)

                                return p.playerId != pId
                            }.bind(this)
                        )
                        .map(
                            function (p) {
                                var _this15 = this

                                _newArrowCheck(this, _this14)

                                var el = createElementFromHTML(
                                    '<div style="cursor: pointer;width: 100%;height: 100px;background-color: rgb(255, 255, 255);color:black;display: flex;justify-content: space-evenly;align-items: center;z-index: inherit;"><div style="width: 85px;height: 85px;overflow: hidden;border-radius: 50%;"><img style="height:100%"src="'
                                        .concat(p.photo, '"/></div><p>')
                                        .concat(
                                            p.name,
                                            '</p><button style="width:100px;height:70%;pointer-events:none">Play</button></div>\n                        '
                                        )
                                )

                                el.onclick = function (e) {
                                    _newArrowCheck(this, _this15)

                                    e.stopPropagation()
                                    e.preventDefault()
                                    FBUtils.log('context.chooseAsync')
                                    FBInstantMock.context.id = '123456789'
                                    FBInstantMock.context.type = 'THREAD'
                                    resolve(FBInstantMock.context.id)
                                    popup.remove()
                                }.bind(this)

                                popup.appendChild(el)
                                return el
                            }.bind(this)
                        )
                    var buttonClose = createElementFromHTML(
                        '<button style="width:100px;height:70px;cursor:pointer;position:absolute;right: 10px;top:10px">Close</button>'
                    )

                    buttonClose.onclick = function (e) {
                        _newArrowCheck(this, _this14)

                        e.stopPropagation()
                        e.preventDefault()
                        reject({
                            code: 'USER_INPUT',
                            message: 'User close popup!',
                        })
                        popup.remove()
                    }.bind(this)

                    popup.appendChild(buttonClose)
                    FBUtils.log('context.chooseAsync')
                    FBInstantMock.context.id = '123456789'
                    FBInstantMock.context.type = 'THREAD'
                    setTimeout(
                        function () {
                            _newArrowCheck(this, _this14)

                            var r = Math.random() * 100
                            var isFailed = r < window.GameCore.Configs.MatchMockFailRate

                            if (isFailed) {
                                reject({
                                    code: getRandomError(),
                                    message: 'Random error',
                                })
                                return
                            }

                            document.body.append(popup)
                        }.bind(this),
                        500
                    )
                }.bind(this)
            )
        },
        switchAsync: function switchAsync(contextId) {
            var _this16 = this

            return new Promise(
                function (resolve) {
                    _newArrowCheck(this, _this16)

                    FBUtils.log('context.switchAsync')
                    FBInstantMock.context.id = contextId
                    FBInstantMock.context.type = 'THREAD'
                    resolve(contextId)
                }.bind(this)
            )
        },
        createAsync: function createAsync() {
            var _this17 = this

            return new Promise(
                function (resolve, reject) {
                    var _this18 = this

                    _newArrowCheck(this, _this17)

                    var opponent = playersData.filter(
                        function (p) {
                            _newArrowCheck(this, _this18)

                            return p.playerId != pId
                        }.bind(this)
                    )[0]
                    var popup = createElementFromHTML(
                        '<div style="height: 40vh;width: 53vh;max-width: 95vw;position:absolute;background-color: rgba(31, 120, 136, 0.48);border-radius: 2vh;margin: auto;right: 0;left: 0;top: 0;bottom: 0;display: flex;flex-direction:column;justify-content:space-evenly;"><div style="display:flex; justify-content:center; width: 100%"><div style="width: 100px;height: 100px;overflow: hidden;border-radius: 50%;"><img style="height:100%"src="'
                            .concat(
                                pPhoto,
                                '"/></div><div style="width: 100px;height: 100px;overflow: hidden;border-radius: 50%;"><img style="height:100%"src="'
                            )
                            .concat(
                                opponent.photo,
                                '"/></div></div><p style="color: white;font-size: 21px;text-align: center;margin: 10px 40px 10px 40px;">Send an invitation to play Game<br>through Messenger.</p></div>'
                            )
                    )
                    var buttonPlay = createElementFromHTML(
                        '<button style="border: none;background-color: #1877f2;color: #fff;width: 90%;height: 50px;border-radius: 15px;margin-left: auto;margin-right: auto;font-size: 20px;cursor: pointer;">Play</button>'
                    )

                    buttonPlay.onclick = function (e) {
                        _newArrowCheck(this, _this18)

                        e.stopPropagation()
                        e.preventDefault()
                        FBUtils.log('context.chooseAsync')
                        FBInstantMock.context.id = '123456789'
                        FBInstantMock.context.type = 'THREAD'
                        resolve(FBInstantMock.context.id)
                        popup.remove()
                    }.bind(this)

                    var buttonClose = createElementFromHTML(
                        '<button style="border: none;background-color: #1877f2;color: #fff;width: 80px;height: 50px;font-size: 20px;cursor: pointer;position:absolute;top:10px;right:10px;border-radius: 10px;">Close</button>'
                    )

                    buttonClose.onclick = function (e) {
                        _newArrowCheck(this, _this18)

                        e.stopPropagation()
                        e.preventDefault()
                        reject({
                            code: 'USER_INPUT',
                            message: 'User close popup!',
                        })
                        popup.remove()
                    }.bind(this)

                    popup.append(buttonPlay)
                    popup.append(buttonClose)
                    setTimeout(
                        function () {
                            _newArrowCheck(this, _this18)

                            var r = Math.random() * 100
                            var isFailed = r < window.GameCore.Configs.MatchMockFailRate

                            if (isFailed) {
                                reject({
                                    code: getRandomError(),
                                    message: 'Random error',
                                })
                                return
                            }

                            document.body.append(popup)
                        }.bind(this),
                        500
                    )
                }.bind(this)
            )
        },
        getType: function getType() {
            return FBUtils.returnAndLog(FBInstantMock.context.type) // return Utils.returnAndLog('THREAD');
        },
        isSizeBetween: function isSizeBetween() {
            // return Utils.returnAndLog(true);
            return FBUtils.returnAndLog(false)
        },
        getPlayersAsync: function getPlayersAsync() {
            var _this19 = this

            return new Promise(
                function (resolve) {
                    var _this20 = this

                    _newArrowCheck(this, _this19)

                    var players = playersData.map(
                        function (p) {
                            _newArrowCheck(this, _this20)

                            return {
                                getID: function getID() {
                                    return p.playerId
                                },
                                getName: function getName() {
                                    return p.name
                                },
                                getPhoto: function getPhoto() {
                                    return p.photo
                                },
                            }
                        }.bind(this)
                    )
                    FBUtils.log('context.getPlayersAsync', 'players: ', players)
                    resolve(players)
                }.bind(this)
            )
        },
    },
    getLocale: function getLocale() {
        return 'vi_VN'
    },
    initializeAsync: function initializeAsync() {
        var _window$GameCore, _window$GameCore$Conf, _window$GameCore2, _window$GameCore2$Con

        var playerMock =
            ((_window$GameCore = window.GameCore) === null || _window$GameCore === void 0
                ? void 0
                : (_window$GameCore$Conf = _window$GameCore.Configs) === null ||
                    _window$GameCore$Conf === void 0
                    ? void 0
                    : _window$GameCore$Conf.PlayerMock) || {}
        var opponentMock =
            ((_window$GameCore2 = window.GameCore) === null || _window$GameCore2 === void 0
                ? void 0
                : (_window$GameCore2$Con = _window$GameCore2.Configs) === null ||
                    _window$GameCore2$Con === void 0
                    ? void 0
                    : _window$GameCore2$Con.OpponentMock) || {}
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
            {
                name: playerMock.name || 'Mock3',
                photo: playerMock.photo || 'https://reqres.in/img/faces/4-image.jpg',
                playerId: playerMock.id || '3',
                signature: playerMock.signature || '3',
            },
            {
                name: opponentMock.name || 'Mock4',
                photo: opponentMock.photo || 'https://reqres.in/img/faces/5-image.jpg',
                playerId: opponentMock.id || '4',
                signature: opponentMock.signature || '4',
            },
            {
                name: opponentMock.name || 'Mock6',
                photo: opponentMock.photo || 'https://reqres.in/img/faces/6-image.jpg',
                playerId: opponentMock.id || '6',
                signature: opponentMock.signature || '6',
            },
        ]
        var queryString = FBUtils.getQueryString()
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
        var _this21 = this

        return new Promise(
            function (resolve) {
                _newArrowCheck(this, _this21)

                FBUtils.log('startGameAsync', 'Showing game start dialog')
                FBInstantMock.__mockState.initialized = true
                resolve()
            }.bind(this)
        )
    },
    quit: function quit() {
        FBUtils.log('QUIT was called. At this point the game will exit')
    },
    updateAsync: function updateAsync(config) {
        var _this22 = this

        logMessage(config.data || {})
        return new Promise(
            function (resolve, reject) {
                _newArrowCheck(this, _this22)

                FBUtils.log('updateAsync')

                if (config.image) {
                    resolve()
                } else {
                    reject()
                }
            }.bind(this)
        )
    },
    getEntryPointData: function getEntryPointData() {
        // example: http://localhost:8080/?entryPointData={a:1,b:2,c:3}');
        var queryString = FBUtils.getQueryString()
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
        var _this23 = this

        return new Promise(
            function (resolve) {
                _newArrowCheck(this, _this23)

                resolve('admin_message')
            }.bind(this)
        )
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
        var deviceInfo = "undefined" == typeof window ? "" : window.navigator.userAgent.toLowerCase()
        var isHave = function isHave(deviceName) {
            return deviceInfo.indexOf(deviceName) !== -1
        }
        var usefulFunc = {
            windows: function windows() {
                return isHave("windows")
            },
            blackberry: function blackberry() {
                return isHave("blackberry") || isHave("bb10") || isHave("rim")
            },
            fxos: function fxos() {
                return (isHave("(mobile") || isHave("(tablet")) && isHave(" rv:")
            },
            androidPhone: function androidPhone() {
                return usefulFunc.android() && isHave("mobile")
            },
            androidTablet: function androidTablet() {
                return usefulFunc.android() && !isHave("mobile")
            },
            blackberryPhone: function blackberryPhone() {
                return usefulFunc.blackberry() && !isHave("tablet")
            },
            blackberryTablet: function blackberryTablet() {
                return usefulFunc.blackberry() && isHave("tablet")
            },
            fxosPhone: function fxosPhone() {
                return usefulFunc.fxos() && isHave("mobile")
            },
            fxosTablet: function fxosTablet() {
                return usefulFunc.fxos() && isHave("tablet")
            },
            iphone: function iphone() {
                return !usefulFunc.windows() && isHave("iphone")
            },
            ipad: function ipad() {
                return isHave("ipad")
            },
            ipod: function ipod() {
                return isHave("ipod")
            },
            meego: function meego() {
                return isHave("meego")
            },
            windowsPhone: function windowsPhone() {
                return usefulFunc.windows() && isHave("phone")
            },
            windowsTablet: function windowsTablet() {
                return usefulFunc.windows() && isHave("touch") && !usefulFunc.windowsPhone()
            },
            android: function android() {
                return !usefulFunc.windows() && isHave("android")
            },
            ios: function ios() {
                return usefulFunc.iphone() || usefulFunc.ipod() || usefulFunc.ipad()
            },
            mobile: function mobile() {
                return usefulFunc.androidPhone() || usefulFunc.iphone() || usefulFunc.ipod() || usefulFunc.windowsPhone() || usefulFunc.blackberryPhone() || usefulFunc.fxosPhone() || usefulFunc.meego()
            },
            tablet: function tablet() {
                return usefulFunc.ipad() || usefulFunc.androidTablet() || usefulFunc.blackberryTablet() || usefulFunc.windowsTablet() || usefulFunc.fxosTablet()
            }
        }
        var isIOSDevice = function isIOSDevice() {
            return usefulFunc.ios()
        }
        var isAndroidDevice = function isAndroidDevice() {
            return usefulFunc.android()
        }
        var isMobileDevice = function isMobileDevice() {
            return usefulFunc.mobile()
        }
        var isTabletDevice = function isTabletDevice() {
            return usefulFunc.tablet()
        }
        var isIOS = isIOSDevice()
        if (isIOS)
            return "IOS"
        var isAndroid = isAndroidDevice()
        if (isAndroid)
            return "ANDROID"
        var isMobile = isMobileDevice()
        var isTablet = isTabletDevice()
        if (isMobile || isTablet)
            return "MOBILE_WEB"
        return "WEB"
    },
    getSDKVersion: function getSDKVersion() {
        return '6.3'
    },
    getSupportedAPIs: function getSupportedAPIs() {
        var supportedAPIs = []

        for (var prop in FBInstantMock) {
            supportedAPIs.push(prop)
        }

        for (var _prop in FBInstantMock.player) {
            supportedAPIs.push('player.'.concat(_prop))
        }

        for (var _prop2 in FBInstantMock.context) {
            supportedAPIs.push('context.'.concat(_prop2))
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
        var _this24 = this

        window.onblur = function () {
            _newArrowCheck(this, _this24)

            FBUtils.log('onPause', 'Interruption event triggered')
            callback()
        }.bind(this)
    },
    getLeaderboardAsync: function getLeaderboardAsync() {
        return Promise.resolve({
            getEntriesAsync: function getEntriesAsync(limit, offset) {
                var entries = []

                for (var index = 0; index++; index < limit) {
                    entries.push(FBInstantMock.leaderboard(index + offset))
                }

                return Promise.resolve(entries)
            },
            getConnectedPlayerEntriesAsync: function getConnectedPlayerEntriesAsync(limit, offset) {
                var entries = []

                for (var index = 0; index++; index < limit) {
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
    loadBannerAdAsync: function loadBannerAdAsync() {
        return Promise.resolve
    },
    hideBannerAdAsync: function hideBannerAdAsync() {
        return Promise.resolve
    },
}
window.FBInstant = FBInstantMock

var decode = function decode(params) {
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

            var unroot = function unroot(o) {
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

            unroot(obj[top]) //array
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

var encode = function encode(obj) {
    _newArrowCheck(this, _this5)

    return encodeURIComponent(JSON.stringify(obj))
}.bind(void 0)

var logMessage = function logMessage(entryPointData) {
    _newArrowCheck(this, _this5)

    var opponentId =
        playersData[0].playerId === pId ? playersData[1].playerId : playersData[0].playerId
    console.log(
        'Link to receive message: \n'
            .concat(document.location.origin + document.location.pathname, '?playerId=')
            .concat(opponentId, '&context_source_id=123456789&context_type=THREAD&entryPointData=')
            .concat(encode(entryPointData), '}')
    )
}.bind(void 0)

function createElementFromHTML(htmlString) {
    var div = document.createElement('div')
    div.innerHTML = htmlString.trim() // Change this to div.childNodes to support multiple top-level nodes

    return div.firstChild
}

async function showMockBannerAd() {
    const image = await getAdContentAsync()

    const bannerAds = document.getElementById('mock-banner-ads')

    if (bannerAds) {
        const imgTag = bannerAds.getElementsByTagName('img')

        if (!imgTag || imgTag.length <= 0) return

        imgTag[0].src = image
    } else {
        const popupElement = document.createElement('div')
        popupElement.id = 'mock-banner-ads'
        popupElement.style =
            'height: 55px; width: 100%; position: fixed; bottom: 0; background: #ccc;'
        popupElement.innerHTML = `
        <img style='width: 100%; height: 100%;' src=${image} />
    `
        document.body.appendChild(popupElement)
    }
}

async function getAdContentAsync() {
    const giphyApiKey = 'VmjHIRsfrwCAssDS4mDo9DoImxJm1lLM'
    const apiAdContent = `https://api.giphy.com/v1/gifs/random?api_key=${giphyApiKey}&rate=pg`
    const response = await fetch(apiAdContent, { method: 'GET' })
    const json = await response.json()

    if (!GameCore.Utils.Valid.isObject(json)) return ''

    return json.data?.images.downsized.url
}
