/*
    * Libs

    * Origin ref from under URL
    https://github.com/dataarts/dat.gui/blob/master/API.md

    * DAT.GUI
    - particle
    https://labs.phaser.io/edit.html?src=src/game%20objects\particle%20emitter\particle%20editor.js
    - physics sprite
    https://labs.phaser.io/edit.html?src=src/physics\arcade\body%20controls.js
    - matter
    - audio
    https://labs.phaser.io/edit.html?src=src/audio\HTML5%20Audio\Loop%20Delay.js
    https://labs.phaser.io/view.html?src=src/audio\Web%20Audio\Seek.js
    - world view
    https://labs.phaser.io/edit.html?src=src/camera\move%20camera%20with%20keys.js

    * DAT.GUI Control
    press 'H' to toggle the GUI visibility

    * Another Planning Ref
    https://github.com/koreezgames/phaser3-particle-editor
*/

/*
    END GOAL:
        you can get name when you over the objects,
        and if you click it, you can get its properties in custom GUI list.
        (my wish is load, save json from phaser scene, then flexible implement
        for each gameobjects, but this is gonna be hard so i just drawback to next version)
*/

'use strict'

// Lib
import { DebugConsole } from './utils/DebugConsoleFunc.js'
// Manager
import TypeSortManager from './manager/TypeSortManager.js'
import FolderManager from './manager/FolderManager.js'
import DebugBoxManager from './manager/DebugBoxManager.js'
import CameraManager from './manager/CameraManager.js'
import InputManager from './manager/InputManager.js'
// GUIs
import GUIClass from './gui/GUIClass.js'

export class Main {
    static isEnable = true
    constructor(_tmpHandOverObj, folder, autoUpdate) {
        this.scene = _tmpHandOverObj.scene
        // this.libs = new LibClass(_tmpHandOverObj)
        this.folder = folder
        this.autoUpdate = autoUpdate
        // Console
        this.initConsole(_tmpHandOverObj)
        // Manager Class
        this.manager = {
            get isEnable() {
                return Main.isEnable
            },
            set isEnable(value) {
                Main.isEnable = value
            },
        }
        this.manager.typeSort = new TypeSortManager(_tmpHandOverObj.scene)
        this.manager.folder = new FolderManager(this.manager.typeSort, autoUpdate)
        this.manager.debugBox = new DebugBoxManager()
        this.manager.camera = new CameraManager()
        this.manager.input = new InputManager(this.manager)
        // GUIs
        this.mainGUI = folder
        this.GUI = new GUIClass(this)
    }
    create(_scene) {
        // Manager
        this.manager.typeSort.create(this.manager)
        this.manager.folder.create(_scene, this.mainGUI)
        this.GUI.create(_scene)
        this.manager.debugBox.create(_scene, this.manager.camera)
        this.manager.camera.create(_scene, this.manager.debugBox)
        this.manager.input.create(
            _scene,
            this.manager.debugBox,
            this.manager.folder,
            this.manager.camera,
            this.manager.typeSort
        )
    }
    update(_time, _delta) {
        this.manager.debugBox.update(_time, _delta)
        this.manager.camera.update()
        this.manager.input.update()
    }

    initConsole(_tmpHandOverObj) {
        let tmpName = ' PGInspector.js'
        let tmpVersion = '1.2.1'
        let tmpURL = 'https://github.com/SilverTree7622/Phaser3_GUI_Inspector'
        DebugConsole({
            name: tmpName,
            version: tmpVersion,
            initConfig: _tmpHandOverObj,
            url: tmpURL,
        })
    }

    setEnable(enable = true) {
        this.manager.typeSort.setEnable(enable)
        Main.isEnable = enable

        if (!enable) {
            this.manager.debugBox.clear()
        }
    }
}
