import { debounce } from 'ts-debounce'

let isDebug = false

const HotSceneObject =
    (key: string, debug = isDebug) =>
    (payload: HotPayload): void => {
        try {
            const { game } = window
            const { module } = payload

            const scenes = game.scene.getScenes(true)
            let currentScene = scenes[0]

            if (currentScene.scene.key !== key) return

            isDebug = debug

            const Scene = module.default

            const draftKey = `${key}-draft`
            game.scene.remove(draftKey)
            const draftScene = game.scene.add(draftKey, Scene)

            console.log(
                '%c HotSceneObjects: ',
                'font-size:12px;background-color: #465975;color:#fff;',
                key
            )

            currentScene = game.scene.getScene(key)

            draftScene.events.once(
                Phaser.Scenes.Events.RENDER,
                debounce(() => {
                    const objects = draftScene.children.getAll()
                    UpdateObjects(currentScene, objects)
                    game.scene.remove(draftKey)
                }),
                50
            )

            game.scene.run(draftKey)
            game.scene.bringToTop(currentScene)
            game.scene.bringToTop(game.globalScene)
        } catch (error) {
            console.warn(error)
            // If you have trouble when update, mark it as invalid (reload the page).
            // import.meta.hot.invalidate()
        }
    }

const UpdateObjects = (
    scene: Phaser.Scene,
    objects: Phaser.GameObjects.GameObject[],
    container?: Phaser.GameObjects.Container
) => {
    objects.forEach((object) => {
        if (!object.name) return

        let currentObject: Phaser.GameObjects.GameObject | null = null

        if (container) {
            currentObject = container.getByName(object.name)
        } else {
            currentObject = scene.children.getByName(object.name)
        }

        if (isDebug) {
            console.log(
                '%c Checking object: ',
                'font-size:12px;background-color: #465975;color:#fff;',
                object.name,
                object.type
            )
        }

        if (!currentObject) return

        if (object.type === 'Container') {
            const newContainer = object as Phaser.GameObjects.Container
            const oldContainer = currentObject as Phaser.GameObjects.Container
            const children = newContainer.getAll()

            UpdateObjects(scene, children, oldContainer)

            if (!oldContainer.hotContainer) return

            console.log(
                '%c Update container: ',
                'font-size:12px;background-color: #33A5FF;color:#fff;',
                oldContainer.name
            )
        }

        const keys = Reflect.ownKeys(object)
        const unsupportedKeys = [
            '_events',
            '_sysEvents',
            'input',
            'localTransform',
            'list',
            'displayList',
        ]

        const different = keys.filter((key) => {
            if (typeof key !== 'string') return false

            // ? Some prods have not yet supported now
            if (unsupportedKeys.indexOf(key) >= 0) return false

            if (!currentObject) return false

            const newValue = Reflect.get(object, key)

            // check newValue is function

            if (newValue instanceof Function) return false
            if (newValue instanceof Phaser.Scene) return false
            if (newValue instanceof Phaser.GameObjects.Group) return false
            if (newValue instanceof Phaser.GameObjects.GameObject) return false

            const oldValue = Reflect.get(currentObject, key)

            return newValue === oldValue
        })

        if (different.length < 1) return

        if (isDebug) {
            console.log(
                '%c HotObject: ',
                'font-size:12px;background-color: #2EAFB0;color:#fff;',
                object.name,
                different
            )
        }

        different.forEach((key) => {
            if (!currentObject) return

            const newValue = Reflect.get(object, key)
            const oldValue = Reflect.get(currentObject, key)

            const success = Reflect.set(currentObject, key, newValue)

            if (isDebug) {
                console.log(
                    '%c Update property: ',
                    'font-size:12px;background-color: #B03734;color:#fff;',
                    success,
                    key,
                    { oldValue, newValue }
                )
            }
        })
    })
}
export default HotSceneObject
