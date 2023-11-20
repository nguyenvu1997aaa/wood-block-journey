import PhaserGUIAction from './PhaserGuiAction'

export default class PhaserInspector {
    constructor(game, folder, autoUpdate) {
        this.game = game
        this.sceneList = game.scene.scenes
        this.folder = folder
        this.selectScene = folder.addBlade({
            view: 'list',
            label: 'scene',
            options: this.sceneList.map((el) => {
                return { text: el.scene.key, value: el.scene.key }
            }),
            value: '',
        })
        this.autoUpdate = autoUpdate

        this.createSceneFolder()
        this.selectScene.on('change', (ev) => {
            this.openScene(ev.value)
        })

        folder.selected = true

        this.createListener()
        this.listActive = this.sceneList.filter((s) => s.scene.isActive())
        if (this.listActive.length > 0) {
            var hasDashboaScene =
                this.listActive.filter((e) => e.scene.key == 'DASHBOARD_SCENE').length > 0
            if (hasDashboaScene) {
                this.selectScene.value = 'DASHBOARD_SCENE'
            } else {
                this.selectScene.value = this.listActive[this.listActive.length - 1].scene.key
            }
        }
    }

    createSceneFolder() {
        this.sceneList.map((el) => {
            const folder = this.folder.addFolder({
                title: el.scene.key,
                expanded: true,
            })
            el.GUIFolder = folder
        })
    }

    openScene(key) {
        for (const scene of this.sceneList) {
            if (scene.scene.key === key) {
                if (scene.GUIFolder) {
                    scene.GUIFolder.hidden = false
                }

                if (!scene.GUIAction && scene.scene.isVisible()) {
                    scene.GUIAction = PhaserGUIAction(scene, scene.GUIFolder, this.autoUpdate)
                }
            } else {
                if (scene.GUIFolder) {
                    scene.GUIFolder.hidden = true
                }
            }
        }
        this.selectScene.value = key
    }

    handleOpenSceneEvent(scene) {
        this.selectScene.value = scene.scene.key
        this.listActive.push(scene)
    }

    handleCloseSceneEvent(scene) {
        this.listActive = this.listActive.filter((s) => s.scene.key != scene.scene.key)
        if (this.listActive.length == 0) return
        this.selectScene.value = this.listActive[this.listActive.length - 1].scene.key
    }

    createListener() {
        for (const scene of this.sceneList) {
            scene.events.on('create', this.handleOpenSceneEvent.bind(this, scene))
            scene.events.on('wake', this.handleOpenSceneEvent.bind(this, scene))
            scene.events.on('start', this.handleOpenSceneEvent.bind(this, scene))
            scene.events.on('sleep', this.handleCloseSceneEvent.bind(this, scene))
            scene.events.on('shutdown', this.handleCloseSceneEvent.bind(this, scene))
            scene.events.on('destroy', this.handleCloseSceneEvent.bind(this, scene))
        }
    }

    setEnable(enable = true) {
        for (const scene of this.sceneList) {
            if (scene.GUIAction) {
                scene.GUIAction.setEnable(enable)
            }
        }
    }
}
