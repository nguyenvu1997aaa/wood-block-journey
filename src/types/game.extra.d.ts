declare namespace Phaser {
    namespace GameObjects {
        interface GameObject
            extends Components.Alpha,
            Components.Transform,
            Components.Visible,
            Components.Size,
            Components.Depth { }

        interface Image {
            kill(): void
            revive(): void
            setWorldSize(width: number, height: number): void
            getWorldPosition(): TPosition
            drawDebugBox(color: number, alpha: number): Phaser.GameObjects.Rectangle
        }

        interface Sprite {
            kill(): void
            revive(): void
            getWorldPosition(): TPosition
            setWorldSize(width: number, height: number): void
            drawDebugBox(color: number, alpha: number): Phaser.GameObjects.Rectangle
        }

        interface Container {
            kill(): void
            revive(): void
            getWorldPosition(): TPosition
            setWorldSize(width: number, height: number, dpr?: number): void
            drawDebugBox(color: number, alpha: number): Phaser.GameObjects.Rectangle
        }

        interface Graphics {
            kill(): void
            revive(): void
            getWorldPosition(): TPosition
            drawDebugBox(color: number, alpha: number): Phaser.GameObjects.Rectangle
        }

        interface Text {
            kill(): void
            revive(): void
            getWorldPosition(): TPosition
            drawDebugBox(color: number, alpha: number): Phaser.GameObjects.Rectangle
            setHighQuality(): this
        }

        interface BitmapText {
            lineHeight: number
            setLineHeight(lineHeight: number): void
            kill(): void
            revive(): void
            getWorldPosition(): TPosition
            drawDebugBox(color: number, alpha: number): Phaser.GameObjects.Rectangle
        }

        interface Group {
            killGroup(): void
            reviveGroup(): void
        }

        interface Zone {
            drawDebugBox(color: number, alpha: number): Phaser.GameObjects.Rectangle
        }

        namespace Particles {
            interface ParticleEmitter {
                kill(): void
                revive(): void
            }

            interface ParticleEmitterManager {
                kill(): void
                revive(): void
            }
        }
    }

    interface Scene extends Phaser.Scene {
        gameZone: Phaser.GameObjects.Zone
        fontSize(size: number): number
        getSceneName(): string
    }

    interface Game extends Phaser.Game {
        updateFps(fps: number): void
    }

    namespace DOM {
        interface RequestAnimationFrame {
            fps: number
            updateFps(fps: number): void
        }
    }
}
