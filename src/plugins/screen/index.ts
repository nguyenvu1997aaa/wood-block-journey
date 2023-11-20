import ScreenEvent from './common/Event'
import Screen from './common/Screen'
import SCREEN_EVENTS from './constants/events'

// ? How declaration abstract as classes of variable
// @ts-expect-error researching
GameCore.Screen = Screen
GameCore.Screens = {
    Events: SCREEN_EVENTS,
}

class ScreenManager extends Phaser.Plugins.ScenePlugin implements IScreenManager {
    public events: IScreenEvent

    public boot(): void {
        this.events = new ScreenEvent()
        this.registryScreenFactory()
    }

    public get(key: string): GameCore.Screen | null {
        const screen = this.scene.children.getByName(key)
        if (screen === null) return null
        return screen as unknown as GameCore.Screen
    }

    public add(
        key: string,
        Screen: typeof GameCore.Screen,
        width: number,
        height: number
    ): GameCore.Screen {
        let screen = this.get(key)
        if (screen) return screen

        screen = this.scene.add.screen(key, Screen, width, height)

        this.events.emit(GameCore.Screens.Events.CREATED, screen)

        return screen
    }

    public open(key: string, data?: TObject): boolean {
        const screen = this.get(key)
        if (!screen) return false

        screen.open(data)

        screen.emit(GameCore.Screens.Events.OPEN, screen)
        this.events.emit(GameCore.Screens.Events.OPEN, screen)

        console.log('Screen open', key, data)
        return true
    }

    public close(key: string): boolean {
        const screen = this.get(key)
        if (!screen) return false

        screen.close()

        screen.emit(GameCore.Screens.Events.CLOSE, screen)
        this.events.emit(GameCore.Screens.Events.CLOSE, screen)

        console.log('Screen close', key)
        return true
    }

    public bringToTop(key: string): void {
        const screen = this.scene.children.getByName(key)
        if (!screen) return

        this.scene.children.bringToTop(screen)
    }

    private registryScreenFactory() {
        Phaser.GameObjects.GameObjectFactory.register('screen', this.createScreen)
    }

    private createScreen(
        this: Phaser.GameObjects.GameObjectFactory,
        name: string,
        Screen: typeof GameCore.Screen,
        width?: number,
        height?: number
    ): GameCore.Screen {
        const screen = new Screen(this.scene, name, width, height)
        Phaser.Display.Align.In.Center(screen, this.scene.gameZone)
        this.existing(screen)
        return screen
    }
}

export default ScreenManager
