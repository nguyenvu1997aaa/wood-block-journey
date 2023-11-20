interface IScreen {
    open(data?: TObject): void
    close(): void
    public incX(x: number): void
    public incY(y: number): void
    public incScale(scale: number): void
}

declare namespace Phaser {
    namespace GameObjects {
        interface GameObjectFactory {
            screen(
                name: string,
                screen: typeof GameCore.Screen,
                width?: number,
                height?: number
            ): GameCore.Screen
        }
    }
}

declare namespace GameCore {
    namespace Screens {
        namespace Events {
            const OPEN: string
            const CLOSE: string
            const CREATED: string
        }
    }

    class Screen extends Phaser.GameObjects.Container implements IScreen {
        constructor(scene: Phaser.Scene, name: string, width?: number, height?: number)

        protected zone: Phaser.GameObjects.Zone
        protected background: Phaser.GameObjects.Graphics

        public open(data?: TObject): void
        public close(): void
        public incX(x: number): void
        public incY(y: number): void
        public incScale(scale: number): void
        public setBlockInputOutsideEnabled(enable: boolean): void

        protected addZone(): void
        protected addBackground(): void

        protected logPageviewOnOpen(): void
        protected logPageviewOnClose(): void
        protected logEventOpen(): void

        public getScreenName(): string
    }
}
