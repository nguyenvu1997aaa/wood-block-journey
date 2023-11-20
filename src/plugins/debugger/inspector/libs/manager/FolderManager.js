// Folder manager
export default class FolderManager {
    constructor(_typeSort, autoUpdate) {
        this.GUI
        this.typeSort = _typeSort
        this.config = this.initConfig()
        this.basic = this.initBasic()
        this.custom = this.initCustom()
        this.autoUpdate = autoUpdate
    }
    create(_scene, _GUI) {
        this._scene = _scene
        this.GUI = _GUI

        this.createBasic(_scene.scene.key)
        this.createCustom()
        // this.createFolderBtnClickEvent()
    }
    initConfig() {
        // config
        let tmpC = {}
        tmpC.initFolderCnt = 0
        tmpC.openBasicDefault = true
        tmpC.openCustomDefault = false
        tmpC.tmpStorage = {
            Obj: {
                over: {
                    guiIdx: 0,
                    guiAlpha: 0,
                    guiTint: undefined,
                },
                focus: {
                    guiIdx: 0,
                    guiAlpha: 0,
                    guiTint: undefined,
                },
            },
        }
        return tmpC
    }
    initBasic() {
        // basic folder
        let tmpB = {}
        tmpB.folder = undefined
        tmpB.list = []
        return tmpB
    }
    initCustom() {
        // custom folder
        let tmpC = {}
        tmpC.folder = undefined
        tmpC.list = []
        tmpC.isDetailedOpen = false
        return tmpC
    }
    setDetailedStatus(_bool) {
        this.custom.folder.isDetailedOpen = _bool
    }
    getDetailedStatus() {
        return this.custom.folder.isDetailedOpen
    }
    createBasic() {
        this.basic.folder = this.GUI
    }
    createCustom() {
        this.custom.folder = this.GUI
    }

    push2FolderList(_folder, _isBasic) {
        if (_isBasic === 'basic') {
            this.basic.list.push(_folder)
        } else if (_isBasic === 'custom') {
            this.custom.list.push(_folder)
        } else if (!_isBasic) {
            this.custom.list.push(_folder)
            console.warn('this is not proper way of adding folder, change to string')
        } else {
            this.basic.list.push(_folder)
            console.warn('this is not proper way of adding folder, change to string')
        }
    }
    getGUIIdx() {
        return this.config.initFolderCnt
    }
    add2CustomFolder() {
        let tmpFolder = this.custom.folder.addFolder({ title: `Obj ${this.config.initFolderCnt}` })
        tmpFolder.hidden = true
        this.push2FolderList(tmpFolder, 'custom')
        this.config.initFolderCnt++
        return tmpFolder
    }
    // check init open or close
    chckOpenAllList() {
        this.chckOpenBasicList()
        this.chckOpenCustomList()
    }
    chckOpenBasicList() {
        if (this.config.openBasicDefault) {
            let tmpLength = this.basic.list.length
            this.openFolder(this.basic.folder)
            for (var i = 0; i < tmpLength; i++) {
                this.openFolder(this.basic.list[i])
            }
        }
    }
    chckOpenCustomList() {
        if (this.config.openCustomDefault) {
            this.openFolder(this.custom.folder)
        } else {
            for (let i = 0; i < this.config.initFolderCnt; i++) {
                this.closeFolder(this.custom.list[i])
            }
        }
    }
    // open folder
    openBigFolder() {
        const numberHide = 6 // 6 elements ahead
        for (let i = 0; i < numberHide; i++) {
            this.GUI.children[i].hidden = false
        }
    }
    closeBigFolder() {
        const numberHide = 6 // 6 elements ahead
        for (let i = 0; i < numberHide; i++) {
            this.GUI.children[i].hidden = true
        }
    }
    openFolder(_folder) {
        // this.setFolderDisplay(_folder, 'default')
        const index = this.basic.list.indexOf(_folder)
        if (index < 0) this.closeBigFolder()
        _folder.hidden = false
    }
    closeFolder(_folder) {
        _folder.hidden = true
        // this.setFolderDisplay(_folder, 'none')
    }
    openChildrenFolder(_folder) {
        // this.setFolderChildrenDisplay(_folder, 'default')
        _folder.hidden = false
    }
    closeChildrenFolder(_folder) {
        _folder.hidden = true
        this.setFolderChildrenDisplay(_folder, 'none')
    }
    setFolderDisplay(_folder, _cmd) {
        const tmpCmds = { none: 'none', default: '' }
        _folder.domElement.style.display = tmpCmds[_cmd]
    }
    setFolderChildrenDisplay(_folder, _cmd) {
        const tmpCmds = { none: 'none', default: '' }
        // control individual property dom display
        let tmpLength = Object.keys(_folder.__folders).length
        for (let i = 0; i < tmpLength; i++) {
            _folder.__folders[String(i)].domElement.style = tmpCmds[_cmd]
        }
    }

    // EXTERNAL
    setBasicOverFolder(_gameObj) {
        var target
        if (_gameObj) {
            if (_gameObj.guiIdx == undefined && this.autoUpdate) {
                let tmpDisplayList = this._scene.children
                this.objList = tmpDisplayList.list.concat(this._scene.sys.updateList._active)
                this.typeSort.createFocusFolder(this.objList)
            }
            let tmpTexture = this.typeSort.setTextureProperty(_gameObj)
            target = this.basic.list[1].children[0].controller_.binding.target.obj_
            target.GUIIdx = _gameObj.guiIdx
            target.name = _gameObj.name
            target.type = _gameObj.type
            target.texture = tmpTexture
        } else {
            // change to all 'NONE'
            target = this.basic.list[1].children[0].controller_.binding.target.obj_
            target.GUIIdx = 'NONE'
            target.name = 'NONE'
            target.type = 'NONE'
            target.texture = 'NONE'
        }
    }
    setBasicFocusFolder(_gameObj) {
        // let tmpFocus = this.basic.list[1].__folders.Focus
        var target = this.basic.list[2].children[0].controller_.binding.target.obj_
        if (_gameObj) {
            let tmpTexture = this.typeSort.setTextureProperty(_gameObj)
            this.openFolder(this.basic.list[2])
            // this.openFolder(tmpFocus)
            target.GUIIdx = _gameObj.guiIdx
            target.name = _gameObj.name
            target.type = _gameObj.type
            target.texture = tmpTexture
        } else {
            // change to all 'NONE'
            // this.openBigFolder(this.basic.folder)
            this.closeFolder(this.basic.list[2])
            // this.closeBigFolder(this.custom.folder)
            target.GUIIdx = 'NONE'
            target.name = 'NONE'
            target.type = 'NONE'
            target.texture = 'NONE'
        }
    }
    cross2FocusObj(_gameObj) {
        // actually cross 2 custom_folder/focus_folder(config)
        if (_gameObj) {
            let tmpObjFolder = this.custom.list
            // chck is any displayed folder exist
            for (let tmpObj in tmpObjFolder) {
                this.closeFolder(tmpObjFolder[tmpObj])
            }
            this.closeBigFolder()
            this.openFolder(tmpObjFolder[_gameObj.guiIdx])
            this.typeSort.chckObjType(
                undefined,
                _gameObj.guiIdx,
                tmpObjFolder[_gameObj.guiIdx],
                _gameObj
            )
            this.setDetailedStatus(true)
        }
    }
    back2Basic(_idx) {
        this.closeFolder(this.custom.list[_idx])
        this.setDetailedStatus(false)
        this.openBigFolder()
    }
    closeThisNopenParentContainer(_arr) {
        // scope: gameObj
        let tmpId = _arr[0]
        let tmpParentContainer = _arr[1]
        let tmpFolder = _arr[2]
        let tmpDebugBox = _arr[3]
        let tmpPCIdx = tmpParentContainer.guiIdx
        let tmpObjFolder = tmpFolder.getCustomFoldersInFolder()

        tmpFolder.closeFolder(tmpObjFolder[tmpId])
        tmpFolder.setBasicFocusFolder(tmpParentContainer)
        tmpFolder.openFolder(tmpObjFolder[tmpPCIdx])

        tmpDebugBox.clearFocus(this)
        tmpDebugBox.setClearNFocus(tmpParentContainer)
        tmpDebugBox.setFocusPerformance(tmpParentContainer, tmpFolder)
    }

    // EXTERNAL: get function
    getBasic() {
        return this.basic
    }
    getCustom() {
        return this.custom
    }
    getBasicFolder() {
        return this.basic.folder
    }
    getCustomFolder() {
        return this.custom.folder
    }
    getBasicList() {
        return this.basic.list
    }
    getCustomList() {
        return this.custom.list
    }
    getCustomFoldersInFolder() {
        return this.custom.list
    }
    getTmpStorageOver() {
        return this.config.tmpStorage.Obj.over
    }
    getTmpStorageFocus() {
        return this.config.tmpStorage.Obj.focus
    }
}
