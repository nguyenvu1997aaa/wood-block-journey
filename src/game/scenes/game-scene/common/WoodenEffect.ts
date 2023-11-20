import SPRITES from '@/game/constants/resources/sprites'
import { xCoord, yCoord } from '@/utils/ProjectileMotion'
import GameScene from '..'

class WoodenEffect {
    angle: number

    scene: GameScene
    scaleUpTween: Phaser.Tweens.Tween
    breakingTween: Phaser.Tweens.Tween
    breakingDelay = 0
    captureCells: any[]
    timerEventRemoveCaptureCells: Phaser.Time.TimerEvent

    constructor(scene: GameScene) {
        this.scene = scene

        // this.init()
    }

    init() {
        this.createTweenBreaking()
    }

    handleShowEffect(captureCells: any[]) {
        if (!captureCells || captureCells.length === 0) return

        this.removeCaptureCell()

        this.captureCells = captureCells

        this.setValueCaptureCell()

        this.breakingTween.resetTweenData(false)

        this.breakingTween.restart()

        if (this.timerEventRemoveCaptureCells) {
            this.timerEventRemoveCaptureCells.remove()
        }

        this.timerEventRemoveCaptureCells = this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.breakingTween.isPlaying()) return

                this.removeCaptureCell()
            },
        })
    }

    onCaptureCellComplete() {
        const { main } = this.scene.layoutManager.objects

        if (!this.captureCells) return

        if (!main || !main.board) return

        const dataBoard = main.board.dataBoard

        for (let i = 0; i < this.captureCells.length; i++) {
            const { x, y } = this.captureCells[i]
            const { cell } = dataBoard[y][x]

            cell.resetImageBreak()
        }
    }

    removeCaptureCell() {
        const { main } = this.scene.layoutManager.objects

        const dataBoard = main.board.dataBoard

        if (!this.captureCells) return

        for (let i = 0; i < this.captureCells.length; i++) {
            const { x, y } = this.captureCells[i]
            const { cell } = dataBoard[y][x]

            cell.resetImageBreak()
        }
    }

    setValueCaptureCell() {
        const { main } = this.scene.layoutManager.objects

        const dataBoard = main.board.dataBoard

        const min = 50
        const max = Math.round(65 * (1 + (8 / 8) * 0.05))

        for (let i = 0; i < this.captureCells.length; i++) {
            const v0 = Phaser.Math.Between(min, max)
            const alpha0 = (Phaser.Math.Between(82, 98) * Math.PI) / 180
            const scaleRate0 = Phaser.Math.Between(3, 10) / 1000
            const { x, y } = this.captureCells[i]
            const { cell } = dataBoard[y][x]

            cell.maxScale0 = Phaser.Math.FloatBetween(2.5, 4.0) / 10
            cell.imageBreak.setFrame(SPRITES.GAMEPLAY_32.FRAME.GEM)
            cell.imageBreak.setVisible(true)
            cell.v0 = v0
            cell.alpha0 = alpha0
            cell.scaleRate0 = scaleRate0
        }
    }

    createTweenBreaking() {
        const { main } = this.scene.layoutManager.objects

        this.breakingTween = this.scene.tweens
            .addCounter({
                from: 0,
                to: 1900,
                onUpdate: (tween) => {
                    if (!this.captureCells) return

                    const dataBoard = main.board.dataBoard

                    for (let i = 0; i < this.captureCells.length; i++) {
                        this.angle = Phaser.Math.Between(-15, 15)
                        const { x, y } = this.captureCells[i]
                        const { cell } = dataBoard[y][x]
                        const { imageBreak, maxScale0 } = cell
                        const rateX = cell.alpha0 < 1.57 ? 1 : -1
                        const t = tween.getValue() * 0.016
                        const pX = xCoord(cell.v0, cell.alpha0, t)
                        const pY = yCoord(cell.v0, cell.alpha0, t)

                        imageBreak.setVisible(true)
                        imageBreak.x = pX
                        imageBreak.y = -pY
                        imageBreak.rotation += 0.04 * rateX

                        if (imageBreak.scale > maxScale0) {
                            imageBreak.scale -= cell.scaleRate0
                        } else {
                            imageBreak.scale = maxScale0
                        }
                    }
                },
                onComplete: () => {
                    this.onCaptureCellComplete()
                },
                delay: this.breakingDelay,
                duration: 2500,
            })
            .stop()
    }
}

export default WoodenEffect
