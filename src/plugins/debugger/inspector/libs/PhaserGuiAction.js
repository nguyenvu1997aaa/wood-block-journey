import { Main } from './main.js'

// Main Phaser3 GUI function **
function PhaserGUIAction(_scene, folder, autoUpdate) {
    let tmpMainInstance // main(GUI & SideGUI) instance

    // chck (scene, css Opacity object / phaser scenes)
    let tmpConfigObj = ChckConfigObj(_scene)

    // pure declare for callback or plan
    let tmpMainClass

    // setting value
    tmpMainClass = InitMainClass()
    tmpMainInstance = SetCreateUpdateInstance(tmpConfigObj, tmpMainClass, folder, autoUpdate)

    // return just phaser scene
    return tmpMainInstance
}

function ChckConfigObj(_scene, _userConfigObj) {
    // init config structure
    let tmpReturn = {
        scene: undefined, // Phaser.Scene
        isCreateAll: false, // ? create all folder in display list, maybe cause lag if there are too much objects
        css: {
            alpha: 0.8, // float 0 ~ 1
            right: 0, // int
            top: 0, // int
        },
        init: {
            focus: null, // GameObj
            ignore: null, // GameObj, array, container
            side: true, // boolean
        },
    }
    // check is init config
    TryCatchObj(tmpReturn, 'scene', _scene)
    if (typeof _userConfigObj === 'object') {
        TryCatchObj(tmpReturn.css, 'alpha', _userConfigObj.alpha)
        TryCatchObj(tmpReturn.css, 'right', _userConfigObj.right)
        TryCatchObj(tmpReturn.css, 'top', _userConfigObj.top)

        TryCatchObj(tmpReturn.init, 'focus', _userConfigObj.focus)
        TryCatchObj(tmpReturn.init, 'ignore', _userConfigObj.ignore)
        TryCatchObj(tmpReturn.init, 'side', _userConfigObj.side)
    }
    return tmpReturn
}
function TryCatchObj(_obj, _objPropertyName, _obj2) {
    if (_obj2 !== undefined) {
        try {
            _obj[_objPropertyName] = _obj2
        } catch (e) {
            console.log('_PGI System_ : INIT CONFIG PROPERTY', _obj2, 'NOT FOUND')
        }
    }
}
function InitMainClass() {
    let tmpMain = Main
    return tmpMain
}
function SetCreateUpdateInstance(_tmpConfigObj, _tmpMainClass, folder, autoUpdate) {
    let MainClass = new _tmpMainClass(_tmpConfigObj, folder, autoUpdate)
    MainClass.create(_tmpConfigObj.scene)
    SetRenewalUpdate(_tmpConfigObj, MainClass)
    return MainClass
}
// setting custom update
function SetRenewalUpdate(_tmpConfigObj, MainClass) {
    _tmpConfigObj.scene.events.on('update', (time, delta) => {
        MainClass.update(time, delta)
    })

    return
}

// trying for npm exports
export default PhaserGUIAction
