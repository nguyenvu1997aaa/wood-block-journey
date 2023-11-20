import Button from '@/game/components/Button'
import { AnalyticsEvents } from '@/constants/Analytics'
import DEPTH_OBJECTS from '@/game/constants/depth'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenKeys } from '@/game/constants/screens'
import MANAGER from '@/game/gameplay/constants/manager'
import BaseManager from '@/game/managers/BaseManager'
import GameScene from '@/game/scenes/game-scene'
import TutorialPlayScreen from '@/game/scenes/game-scene/screens/TutorialPlayScreen'
import StepFour from '../tutorials/StepFour'
import StepOne from '../tutorials/StepOne'
import StepThree from '../tutorials/StepThree'
import StepTwo from '../tutorials/StepTwo'
import WORLD_EVENTS from '@/plugins/world/constants/events'

const { STATUS } = MANAGER
const { KEY: D_KEY, FRAME: D_FRAME } = SPRITES.DEFAULT
const { KEY, FRAME } = SPRITES.GAMEPLAY

class TutorialManager extends BaseManager {
    public scene: GameScene

    public currentLevel = 1
    public tutorialId: string
    public inputType: string

    public handFrame: Phaser.GameObjects.Image

    public background: Phaser.GameObjects.Image

    public headerContainer: Phaser.GameObjects.Container
    private maskGraphics: Phaser.GameObjects.Graphics
    private textTutorial: Phaser.GameObjects.Text
    private skipButton: Button

    private stepOne: StepOne
    private stepTwo: StepTwo
    private stepThree: StepThree
    private stepFour: StepFour

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene
    }

    public init(): void {
        this.createHand()

        this.createTutorialPlayScreen()

        this.createHeader()

        this.createSkipButton()

        this.initTutorialStep()

        this.registerEvents()
    }

    private registerEvents(): void {
        this.scene.world.events.on(WORLD_EVENTS.RESIZE, this.handleResize, this)
    }

    private handleResize(): void {
        Phaser.Display.Align.In.TopCenter(this.headerContainer, this.scene.gameZone, 0, -10)

        switch (this.currentLevel) {
            case 1:
                this.stepOne.createTweenHand()
                break

            case 2:
                this.stepTwo.createTweenHand()

                break

            case 3:
                this.stepThree.createTweenHand()

                break

            case 4:
                this.stepFour.createTweenHand()

                break
        }
    }

    private createTutorialPlayScreen() {
        this.scene.screen.add(ScreenKeys.TUTORIAL_PLAY_SCREEN, TutorialPlayScreen)
    }

    private createHeader() {
        this.headerContainer = this.scene.add.container()
        this.headerContainer.setVisible(false)
        this.headerContainer.setSize(355, 100)

        const mask = this.scene.add.graphics()

        mask.fillRoundedRect(-355 / 2, -50, 355, 100, 12)
        mask.fillStyle(0x000000, 0.5)
        mask.lineStyle(2, 0x000000, 0.55)
        mask.strokeRoundedRect(-355 / 2, -50, 355, 100, 12)

        this.headerContainer.add(mask)

        this.textTutorial = this.scene.make.text({
            style: {
                fontFamily: FONTS.FONT_FAMILY_ARIAL,
                fontSize: `${this.scene.fontSize(40)}px`,
                fontStyle: '700',
                align: 'center',
            },
        })

        this.textTutorial.setHighQuality()

        this.textTutorial.setTint(0xfae3b9)

        this.headerContainer.add(this.textTutorial)

        Phaser.Display.Align.In.TopCenter(this.headerContainer, this.scene.gameZone, 0, -10)
    }

    private createSkipButton() {
        const lang = this.scene.facebook.getLocale()
        let width = 50
        let height = 30

        if (lang === 'ru') {
            width = 100
            height = 30
        }

        this.skipButton = new Button(this.scene, D_KEY, D_FRAME.BUTTON_SKIP, width, height)

        this.headerContainer.add(this.skipButton)

        this.skipButton.onClick = this.handleSkip.bind(this)

        Phaser.Display.Align.In.BottomRight(
            this.skipButton,
            this.headerContainer,
            -this.scene.gameZone.width / 2 - 5,
            -60
        )
    }

    private handleSkip() {
        const { globalScene, lang } = this.scene.game

        globalScene.screen.open(ScreenKeys.ALERT_SCREEN, {
            message: lang.Text.MESS_SKIP_TUTORIAL,
            onHandleYes: this.handleCompleteTutorial.bind(this),
        })
    }

    private initTutorialStep() {
        this.stepOne = new StepOne(this)
        this.stepTwo = new StepTwo(this)
        this.stepThree = new StepThree(this)
        this.stepFour = new StepFour(this)
    }

    public start(): void {
        if (this.isRunning()) return

        this.scene.analytics.pageview('tutorial-screen')

        this.setState(STATUS.RUNNING)

        this.headerContainer.setVisible(true)

        this.showTutorialWhenStart()
    }

    public setTextTutorial(text: string): void {
        const char = text.split('')
        let str = ''

        this.scene.time.addEvent({
            repeat: char.length,
            delay: 10,
            callback: () => {
                const c = char.shift() || ''
                str += c

                this.textTutorial.setText(str)

                Phaser.Display.Align.In.Center(
                    this.textTutorial,
                    this.headerContainer,
                    -this.scene.gameZone.width / 2,
                    -60
                )
            },
        })
    }

    public stop(): void {
        if (!this.isRunning()) return

        this.scene.tweens.killTweensOf([this.background])

        this.background.setVisible(false)

        this.maskGraphics.setVisible(false)

        this.setState(STATUS.STOPPED)
    }

    private showTutorialWhenStart = (): void => {
        const { lang } = this.scene

        this.scene.analytics.event(AnalyticsEvents.TUTORIAL_STEP, {
            tutorial_step: this.currentLevel,
        })

        switch (this.currentLevel) {
            case 1:
                this.stepOne.start()
                this.setTextTutorial(lang.Text.MESS_TUTORIAL_1)
                break

            case 2:
                this.stepTwo.start()
                this.setTextTutorial(lang.Text.MESS_TUTORIAL_2)
                break

            case 3:
                this.stepThree.start()
                this.setTextTutorial(lang.Text.MESS_TUTORIAL_3)
                break

            case 4:
                this.stepFour.start()
                this.setTextTutorial(lang.Text.MESS_TUTORIAL_4)
                break

            default:
                // Complete tutorial
                this.handleCompleteTutorial()

                // this.scene.screen.open(ScreenKeys.TUTORIAL_PLAY_SCREEN, {
                //     onPlay: this.handleCompleteTutorial.bind(this),
                // })
                break
        }
    }

    private handleCompleteTutorial(): void {
        this.scene.analytics.pageview('game-scene')
        this.scene.analytics.event(AnalyticsEvents.TUTORIAL_COMPLETE)

        const { main } = this.scene.layoutManager.objects

        this.setState(STATUS.STOPPED)
        main.praise.tweenShowScoreText.stop().remove()
        // this.scene.checkAndAddShortcut()
        this.scene.startGame()

        this.handFrame.setVisible(false)
        this.headerContainer.setVisible(false)
    }

    // Draw
    private createHand(): void {
        this.handFrame = this.scene.make.image({
            key: KEY,
            frame: FRAME.HAND,
            origin: { x: 0.5, y: 0.5 },
        })

        this.handFrame.setVisible(false).setDepth(DEPTH_OBJECTS.ON_TOP)
        this.handFrame.setWorldSize(64, 55)
    }

    // Logic
    public isValidForTutorial(): boolean {
        const { game } = this.scene
        const isUserNew = game.player.getPlayerIsNew()

        return isUserNew
    }

    public nextTutorial = (): void => {
        switch (this.currentLevel) {
            case 1:
                this.stepOne.nextLevel()
                break

            case 2:
                this.stepTwo.nextLevel()
                break

            case 3:
                this.stepThree.nextLevel()
                break

            case 4:
                this.stepFour.nextLevel()
                break
        }

        this.currentLevel++

        this.showTutorialWhenStart()
    }

    public dragStart(): void {
        switch (this.currentLevel) {
            case 1:
                this.stepOne.dragStart()
                break

            case 2:
                this.stepTwo.dragStart()
                break

            case 3:
                this.stepThree.dragStart()
                break

            case 4:
                this.stepFour.dragStart()
                break
        }
    }

    public skipTutorial(): void {
        if (!this.isRunning()) return

        this.handFrame.setVisible(false)
        this.setState(STATUS.STOPPED)
    }

    public invalidMove(): void {
        switch (this.currentLevel) {
            case 1:
                this.stepOne.invalidMove()
                break

            case 2:
                this.stepTwo.invalidMove()
                break

            case 3:
                this.stepThree.invalidMove()
                break

            case 4:
                this.stepFour.invalidMove()
                break
        }
    }

    public validTargetPosition = (position: { x: number; y: number }): boolean => {
        let targetPosition = { x: 0, y: 0 }

        switch (this.currentLevel) {
            case 1:
                targetPosition = this.stepOne.dataInit.position
                break

            case 2:
                targetPosition = this.stepTwo.dataInit.position
                break

            case 3:
                targetPosition = this.stepThree.dataInit.position
                break

            case 4:
                targetPosition = this.stepFour.dataInit.position
                break
        }

        if (targetPosition.x === position.x && targetPosition.y === position.y) return true

        return false
    }

    public handleGuidePlayStep(fen: string) {
        try {
            const { main, footer } = this.scene.layoutManager.objects

            main.board.clearBoard()
            footer.pieces.clearPieces()

            // 3. get board info by fen
            let board = null
            let pieces = null

            if (fen) {
                const result = main.board.getBoardByFen(fen)

                board = this.scene.handleDynamicFenSize(result)
                pieces = footer.pieces.getPiecesByFen(fen)
            }

            // 3.2 start board
            main.board.startGame(board)

            // 3.3 show pieces
            footer.pieces.showAvailablePieces(pieces)
        } catch (ex) {
            console.log(ex)
        }
    }
}

export default TutorialManager
