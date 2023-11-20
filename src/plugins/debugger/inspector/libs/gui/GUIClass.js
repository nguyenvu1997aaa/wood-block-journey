'use strict'

// debug console utils
import { DebugSceneNAllDisplayList } from '../utils/DebugConsoleFunc.js'

export default class GUIClass {
    constructor(_main) {
        this.main = _main
        this.manager = this.main.manager
        this.objList = undefined // all game object list
    }
    create(_scene) {
        this.createBasicFolder(_scene, this.manager.folder.getBasicFolder())
        this.createFocusFolder(_scene)
    }

    createBasicFolder(_scene, _basic) {
        // create basic pointer
        let tmpAllConsole = {}
        tmpAllConsole.CONSOLE_CLEAR = () => {
            console.clear()
        }
        ;(tmpAllConsole.SCENE_LIST = DebugSceneNAllDisplayList.bind(_scene)),
            (tmpAllConsole.DEFAULT_CAM = this.manager.camera.set2defaultZoom.bind(
                this.manager.camera
            ))
        let tmpPointer = undefined
        let tmpXY = {}
        tmpXY.x = _scene.game.config.width
        tmpXY.y = _scene.game.config.height
        let tmpObj = undefined
        let tmpFocus = undefined
        let tmpObjProperties = {
            GUIIdx: 'NONE',
            name: 'NONE',
            type: 'NONE',
            texture: 'NONE',
        }
        // focus off function
        let tmpFocusFunc = () => {
            this.manager.debugBox.clearFocus()
            this.manager.folder.setBasicFocusFolder()
            this.manager.debugBox.clearFocusGameObj()
        }
        // cross2FocusObj
        let tmpGo2ThisFunc = () => {
            this.manager.folder.cross2FocusObj(
                this.manager.debugBox.getFocusGameObj(),
                this.objList
            )
        }
        let tmpFocusProperties = {
            GUIIdx: 'NONE',
            name: 'NONE',
            type: 'NONE',
            texture: 'NONE',
            GUI_FOCUS_OFF: tmpFocusFunc,
            GUI_GO_2_DETAIL: tmpGo2ThisFunc,
        }

        // setting folder hierarchy list
        _basic.addButton({ title: 'CONSOLE CLEAR' }).on('click', tmpAllConsole.CONSOLE_CLEAR)
        _basic.addButton({ title: 'SCENE_LIST' }).on('click', tmpAllConsole.SCENE_LIST)
        _basic.addButton({ title: 'DEFAULT_CAM' }).on('click', tmpAllConsole.DEFAULT_CAM)

        tmpPointer = _basic.addFolder({ title: 'Pointer' })
        tmpPointer.addMonitor(_scene.input, 'x')
        tmpPointer.addMonitor(_scene.input, 'y')
        tmpPointer.addInput(_scene.cameras.main, 'zoom', { min: 0.1, max: 10 })

        tmpObj = _basic.addFolder({ title: 'Obj' })
        tmpObj.addMonitor(tmpObjProperties, 'GUIIdx')
        tmpObj.addMonitor(tmpObjProperties, 'name')
        tmpObj.addMonitor(tmpObjProperties, 'type')
        tmpObj.addMonitor(tmpObjProperties, 'texture')

        tmpFocus = _basic.addFolder({ title: 'Focus' }) // add to Parent Obj folder
        tmpFocus.addMonitor(tmpFocusProperties, 'GUIIdx')
        tmpFocus.addMonitor(tmpFocusProperties, 'name')
        tmpFocus.addMonitor(tmpFocusProperties, 'type')
        tmpFocus.addMonitor(tmpFocusProperties, 'texture')
        tmpFocus.addButton({ title: 'GUI_FOCUS_OFF' }).on('click', tmpFocusProperties.GUI_FOCUS_OFF)
        tmpFocus
            .addButton({ title: 'GUI_GO_TO_DETAIL' })
            .on('click', tmpFocusProperties.GUI_GO_2_DETAIL)

        tmpFocus.hidden = true

        this.manager.folder.push2FolderList(tmpPointer, 'basic')
        this.manager.folder.push2FolderList(tmpObj, 'basic')
        this.manager.folder.push2FolderList(tmpFocus, 'basic')
    }
    createFocusFolder(_scene) {
        let tmpDisplayList = _scene.children
        this.objList = tmpDisplayList.list.concat(_scene.sys.updateList._active)
        this.manager.typeSort.createFocusFolder(this.objList)
    }

    // destroy GUI when restart Phaser.Scene
    destroyGUI() {
        this.lib.destroyGUI()
    }
    tryCatchFlow(_function) {
        try {
            _function()
        } catch (e) {
            //
        }
    }
}
