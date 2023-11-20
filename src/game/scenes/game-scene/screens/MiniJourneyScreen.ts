import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth, ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import GAME_LEVELS from '@/game/gameplay/constants/GameLevels'
import { getLives } from '@/modules/lives/selectors/lives'
import { startJourneyModeGame } from '@/modules/match/actions/gameplay'
import { loadLevel } from '@/modules/match/actions/match'
import { getJourneyMatchData, getJourneyMatchLevel } from '@/modules/match/selectors/match'
import { sendException } from '@/utils/Sentry'
import { isArray } from 'lodash'
import { getCodeByFenCharacter } from '../../journey-scene/common/Piece/utils/board'
import { FRAME_GEM_TILED_MAP } from '../../journey-scene/constant/piece'
import PlayButtonJourney from './component/PlayButtonJourney'

const { KEY, FRAME } = SPRITES.DEFAULT
const { KEY: K_GP, FRAME: F_GP } = SPRITES.GAMEPLAY
const { KEY: K_GP_32, FRAME: F_GP_32 } = SPRITES.GAMEPLAY_32
const { Network, Board } = GameCore.Configs

interface ITargetItem {
    container: Phaser.GameObjects.Container
    gem: Phaser.GameObjects.Image
    text: Phaser.GameObjects.BitmapText
}

type TData = {
    onClose: Function
}

export default class MiniJourneyScreen extends GameCore.Screen {
    private popup: Popup
    private title: Phaser.GameObjects.Container
    private buttonClose: Button
    private contents: Phaser.GameObjects.Group
    private buttonPlay: PlayButtonJourney
    private boardCellData: Phaser.GameObjects.Image[][] = []
    private targetData: ITargetItem[] = []

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    constructor(scene: Phaser.Scene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        try {
            this.createPopup()

            this.createTitle()

            this.createTargetItems()

            this.createBoard()

            this.createButtonPlay()

            this.setDepth(ScreenDepth.POPUP)

            this.background.setAlpha(0.5)
        } catch (ex) {
            console.log('ex === ', ex)
        }
    }

    public async open(data: TData): Promise<void> {
        super.open(data)

        await this.checkReceiveLevelFromFb()

        this.loadLevelConfig()
    }

    private startGame(): void {
        this.runOpenAnimation()

        this.updateContent()

        this.popup.setVisible(true)
    }

    private loadLevelConfig(): void {
        try {
            const state = this.scene.storage.getState()
            const level = getJourneyMatchLevel(state)
            let levelData = GAME_LEVELS[level]

            if (!levelData) {
                levelData = GAME_LEVELS[GAME_LEVELS.length - 1]
            }

            const { key, mapJson } = levelData

            if (this.scene.cache.tilemap.exists(key)) {
                this.handleLoadCurrentMapComplete()
                return
            }

            this.scene.load.tilemapTiledJSON(key, mapJson)
            this.scene.load.start()

            this.scene.load.off(Phaser.Loader.Events.COMPLETE)
            this.scene.load.once(
                Phaser.Loader.Events.COMPLETE,
                this.handleLoadCurrentMapComplete.bind(this)
            )
        } catch (error) {
            sendException(error)
        }
    }

    private handleLoadCurrentMapComplete(): void {
        this.hideLoadingScreen()
        this.startGame()
    }

    private updateContent(): void {
        this.resetTarget()
        this.drawTargetItems()

        this.resetCellBoard()
        this.updateCellBoard()
    }

    private async checkReceiveLevelFromFb(): Promise<void> {
        try {
            const state = this.scene.storage.getState()
            const level = getJourneyMatchLevel(state)

            if (level) return

            this.showLoadingScreen()

            await this.scene.storage.dispatch(loadLevel())
        } catch (error) {
            sendException(error)
        }
    }

    private showLoadingScreen(): void {
        const { globalScene, lang } = this.scene.game

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: `${lang.Text.LOADING_LEVEL}...`,
            duration: Network.Timeout,
            loading: true,
        })
    }

    private hideLoadingScreen(): void {
        const { globalScene } = this.scene.game

        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, -7, 286, 373)

        this.popup.setVisible(false)

        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone, 0, 10)
    }

    private createTitle(): void {
        this.title = this.scene.add.container()

        const scale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_JOURNEY,
        })

        text.setWorldSize(text.width / scale, text.height / scale)

        this.buttonClose = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)

        this.buttonClose.setName('Close')

        this.buttonClose.onClick = this.clickClose

        this.title.add([text, this.buttonClose])

        this.popup.add(this.title)

        Phaser.Display.Align.In.Center(text, this.title)

        Phaser.Display.Align.In.Center(this.buttonClose, this.title, 138.5, -19.5)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup, 0, 7)
    }

    private clickClose = () => {
        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(() => {
            const [onClose] = this.getData(['onClose'])

            this.scene.screen.close(this.name)

            if (onClose) onClose()
        })
    }

    private createTargetItems(): void {
        const imageScale = this.scene.world.getPixelRatio()

        const title = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_COLLECT,
        })

        const { width, height } = title

        title.setWorldSize(width / imageScale, height / imageScale)

        const panel = this.scene.make.image({
            key: KEY,
            frame: FRAME.WOOD_PANEL,
        })

        panel.setWorldSize(200, 37)

        this.popup.add([title, panel])

        Phaser.Display.Align.In.Center(title, this.popup, 0, -155)
        Phaser.Display.Align.In.Center(panel, this.popup, 0, -125)
    }

    private drawTargetItems(): void {
        const state = this.scene.storage.getState()
        const level = getJourneyMatchLevel(state)
        let levelConfig = GAME_LEVELS[level]

        if (!levelConfig) {
            levelConfig = GAME_LEVELS[GAME_LEVELS.length - 1]
        }

        const map = this.scene.make.tilemap({
            key: levelConfig.key,
        })
        const { properties } = map

        if (!properties || !isArray(properties) || properties.length < 2) {
            return
        }

        const { value: targets } = properties[0]
        const target = targets.replaceAll('{', '{"').replaceAll(', ', ', "').replaceAll(':', '":')
        const targetJson = JSON.parse(target)
        const keys = Object.keys(targetJson)
        const position = this.calcPosition(keys.length)

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            // @ts-ignore
            const frame = FRAME_GEM_TILED_MAP[key]
            const value = targetJson[key]

            let targetData = this.targetData[i]

            if (!targetData) {
                targetData = this.spawnTargetItem(frame, value)
            }

            const { container, text, gem } = targetData

            container.setVisible(true)
            text.setText(`x${value}`)
            gem.setFrame(frame)

            this.targetData.push(targetData)

            Phaser.Display.Align.In.Center(container, this.popup, position[i], -130)
        }
    }

    private spawnTargetItem(frame: string, value: number): ITargetItem {
        const container = this.scene.make.container({})
        const gem = this.scene.make.image({
            key: K_GP_32,
            frame,
        })

        gem.setWorldSize(15, 15)

        const text = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(24),
            origin: { x: 0.5, y: 0.5 },
            text: `x${value}`,
        })

        container.add([gem, text])

        Phaser.Display.Align.In.Center(text, container, 0, 15)

        this.popup.add(container)

        return {
            container,
            gem,
            text,
        }
    }

    private calcPosition(amount: number): number[] {
        const result = []
        const mainWidth = 150
        const padding = mainWidth / (amount + 1)
        const increasePadding = (padding * (amount - 1)) / 2

        for (let i = 0; i < amount; i++) {
            result.push(padding * i - increasePadding)
        }

        return result
    }

    private createBoard(): void {
        const board = this.scene.make.image({
            key: K_GP,
            frame: F_GP.BOARD,
        })

        board.setWorldSize(200, 184)

        this.popup.add(board)

        Phaser.Display.Align.In.Center(board, this.popup, 0, -12)

        this.initCellBoard()
    }

    private decodeMathData = (hash: string) => {
        try {
            return JSON.parse(GameCore.Utils.Hash.hashToString(hash))
        } catch (error) {
            return ''
        }
    }

    private initCellBoard(): void {
        const startX = -86.5
        const startY = -92
        const paddingX = 1.65
        const paddingY = 1

        for (let i = 0; i < Board.rows; i++) {
            this.boardCellData[i] = []

            for (let j = 0; j < Board.cols; j++) {
                const pX = startX + j * 20 + paddingX * j
                const pY = startY + i * 19 + paddingY * i
                const frame = F_GP_32.GEM_TRANSPARENT

                const image = this.spawnCellBoard(frame, pX, pY)

                this.boardCellData[i].push(image)
            }
        }
    }

    private updateCellBoard(): void {
        const state = this.scene.storage.getState()
        const match = getJourneyMatchData(state)
        const { data } = match
        const { fen } = data

        if (fen) {
            const fenBoard = fen.split('l')[0]
            this.drawBoardByFen(fenBoard)
            return
        }

        this.drawBoardByMap()
    }

    private resetTarget(): void {
        for (let i = 0; i < this.targetData.length; i++) {
            this.targetData[i]?.container?.setVisible(false)
        }
    }

    private resetCellBoard(): void {
        for (let i = 0; i < Board.rows; i++) {
            for (let j = 0; j < Board.cols; j++) {
                const image = this.boardCellData[i][j]

                image.setFrame(F_GP_32.GEM_TRANSPARENT)
            }
        }
    }

    private drawBoardByFen(fen: string): void {
        const rows = fen.trim().split('/')

        for (let i = 0; i < rows.length; i++) {
            const cols = rows[i].split(',')

            for (let j = 0; j < cols.length; j++) {
                const codeFen = cols[j]

                if (codeFen === 'x') continue

                const frame = getCodeByFenCharacter(codeFen)
                const image = this.boardCellData[i][j]

                image.setFrame(frame)
            }
        }
    }

    private drawBoardByMap(): void {
        const state = this.scene.storage.getState()
        const level = getJourneyMatchLevel(state)
        const levelConfig = GAME_LEVELS[level]
        const map = this.scene.make.tilemap({
            key: levelConfig.key,
        })

        const { layers } = map

        if (!isArray(layers)) return

        const { data } = layers[0]

        if (!isArray(data)) return

        for (let i = 0; i < data.length; i++) {
            const rowItem = data[i]

            for (let j = 0; j < rowItem.length; j++) {
                const colItem = rowItem[j]

                if (colItem.index < 0) continue

                //@ts-ignore
                const frame = FRAME_GEM_TILED_MAP[colItem.index - 1]
                const image = this.boardCellData[i][j]

                image.setFrame(frame)
            }
        }
    }

    private spawnCellBoard(frame: string, pX: number, pY: number): Phaser.GameObjects.Image {
        const gem = this.scene.make.image({
            key: K_GP_32,
            frame,
        })

        gem.setWorldSize(20, 19)

        this.popup.add(gem)

        Phaser.Display.Align.In.Center(gem, this.popup, pX, pY)

        return gem
    }

    private createButtonPlay(): void {
        this.buttonPlay = new PlayButtonJourney(this.scene)
        this.buttonPlay.onClick = this.handlePlay.bind(this)

        this.popup.add(this.buttonPlay)

        Phaser.Display.Align.In.Center(this.buttonPlay, this.popup, 0, 111)
    }

    public handlePlay() {
        const state = this.scene.storage.getState()
        const playerLives = getLives(state)

        if (playerLives < 1) {
            this.scene.screen.open(ScreenKeys.CLAIM_HEART_SCREEN)
            return
        }

        // this.scene.storage.dispatch(decreaseLife())

        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(() => {
            this.scene.screen.close(this.name)

            const state = this.scene.storage.getState()
            const level = getJourneyMatchLevel(state)

            if (level > GAME_LEVELS.length) {
                return
            }

            this.scene.analytics.levelStart(level, undefined, this.getLevelName(level))

            this.scene.storage.dispatch(startJourneyModeGame())
        })
    }

    private getLevelName(level: number): string {
        const levelWithPadding = GameCore.Utils.Number.padStart(level, 4, '0')
        return `journey_${levelWithPadding}`
    }

    private runOpenAnimation(): void {
        if (this.popupShowUpAnimation?.tween?.isPlaying()) return

        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runFadeInMaskAnimation(100, 300)
        // this.runPopupContentEntrancesAnimation(200, 300)
    }

    private runCloseAnimation(): void {
        if (this.popupFadeOutAnimation?.tween?.isPlaying()) return

        // this.scene.audio.playSound(SOUND_EFFECT.POPUP_OFF, { volume: 0.6 })

        this.runPopupExitsAnimation(50, 200)
        this.runFadeOutMaskAnimation(0, 200)
    }

    // Entrances animations
    private runPopupEntrancesAnimation(delay: number, duration: number): void {
        if (!this.popupShowUpAnimation) {
            const { scale } = this.popup
            this.popupShowUpAnimation = new ShowUpAnimation({
                targets: [this.popup],
                delay,
                duration,
                props: {
                    y: 0,
                    alpha: { start: 1, from: 1, to: 1 },
                    scale: { start: 0, from: 0, to: scale },
                },
            })
        }

        this.popupShowUpAnimation.play()
    }

    private runPopupContentEntrancesAnimation(delay: number, duration: number): void {
        this.contentShowUpAnimation?.remove()
        this.contentShowUpAnimation = new BubbleTouchAnimation({
            targets: this.contents.getChildren(),
            duration,
            delay,
            props: {
                alpha: { start: 0, from: 0, to: 1 },
            },
        })

        this.contentShowUpAnimation.play()
    }

    // Exits animations
    private runPopupExitsAnimation(delay: number, duration: number): void {
        if (!this.popupFadeOutAnimation) {
            this.popupFadeOutAnimation = new FadeOutAnimation({
                targets: [this.popup],
                delay,
                duration,
                props: {
                    scale: 0,
                },
                ease: Phaser.Math.Easing.Back.In,
                onComplete: () => {
                    this.popup.setY(0)
                    this.scene.screen.close(this.name)

                    this.popup.setVisible(false)
                },
            })
        }

        this.popupFadeOutAnimation.play()
    }

    private runFadeInMaskAnimation(delay: number, duration: number): void {
        if (!this.popupFadeInMaskAnimation) {
            const { alpha } = this.background
            this.popupFadeInMaskAnimation = new FadeInAnimation({
                targets: [this.background],
                delay,
                duration,
                props: {
                    alpha: { start: 0, from: 0, to: alpha },
                },
            })
        }

        this.popupFadeInMaskAnimation.play()
    }

    private runFadeOutMaskAnimation(delay: number, duration: number): void {
        if (!this.popupFadeOutMaskAnimation) {
            const { alpha } = this.background
            this.popupFadeOutMaskAnimation = new FadeOutAnimation({
                targets: [this.background],
                delay,
                duration,
                props: {
                    alpha: { start: alpha, from: alpha, to: 0 },
                },
            })
        }

        this.popupFadeOutMaskAnimation.play()
    }
}
