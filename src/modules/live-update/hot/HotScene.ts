const HotScene =
    (key: string) =>
    (payload: HotPayload): void => {
        try {
            const { game } = window
            const { module } = payload

            const scenes = game.scene.getScenes(true)
            const currentScene = scenes[0]

            if (currentScene.scene.key !== key) return

            const Scene = module.default

            game.scene.remove(key)
            game.scene.add(key, Scene, true)
            game.scene.bringToTop(game.globalScene)

            console.log(
                '%c HotScene: ',
                'font-size:12px;background-color: #465975;color:#fff;',
                key
            )
        } catch (error) {
            // console.warn(error)
            // If you have trouble when update, mark it as invalid (reload the page).
            import.meta.hot?.invalidate()
        }
    }

export default HotScene
