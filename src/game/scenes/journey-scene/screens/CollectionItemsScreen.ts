import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Popup from '@/game/components/Popup'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import JourneyScene from '..'
import ItemCollectionEffect from '../common/ItemCollectionEffect'
import ItemCollectionEffectLandscape from '../common/ItemCollectionEffectLandscape'
import CollectItem from './component/CollectItem'

const { KEY, FRAME } = SPRITES.DEFAULT

type TData = {
    jsonTarget: string
    duration: number
}

class CollectionItemsScreen extends GameCore.Screen {
    public scene: JourneyScene
    private popup: Popup
    private title: Phaser.GameObjects.Container
    private contents: Phaser.GameObjects.Group
    private backgroundContent: Phaser.GameObjects.Image
    private listItems: CollectItem[] = []

    private targetImages: Phaser.GameObjects.Image[] = []

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private contentShowUpAnimation: BubbleTouchAnimation

    private listAnimCollectionItem: ItemCollectionEffect[] = []

    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    constructor(scene: JourneyScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.createPopup()
        this.createTitle()
        this.createContentBackground()

        this.addItem()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)
    }

    public open(data: TData): void {
        super.open(data)

        const [duration] = this.getData(['duration'])

        this.hideAllCollectionItems()

        this.createCollectionItems()

        this.alginCollectionItems()

        this.runOpenAnimation()

        this.scene.time.delayedCall(duration, () => {
            this.handleClose()
        })
    }

    private handleClose = (): void => {
        this.runCloseAnimation()
    }

    private createContentBackground(): void {
        this.backgroundContent = this.scene.make.image({
            key: KEY,
            frame: FRAME.POPUP_CONTENT_BACKGROUND,
        })

        this.backgroundContent.setWorldSize(263, 135)

        this.popup.add(this.backgroundContent)

        Phaser.Display.Align.In.TopCenter(this.backgroundContent, this.popup, 0, -24)
    }

    private createCollectionItems(): void {
        const [jsonTarget] = this.getData(['jsonTarget'])
        const keys = Object.keys(jsonTarget)

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const collectionItem = this.getCollectionItemFree(i)

            console.log('jsonTarget[key] === ', jsonTarget[key])

            collectionItem.updateGem(key)
            collectionItem.updateText(jsonTarget[key])
        }
    }

    private getCollectionItemFree(index: number): CollectItem {
        let collectionItem = this.listItems[index]

        if (!collectionItem) {
            collectionItem = new CollectItem(this.scene)

            this.popup.add(collectionItem)

            this.listItems.push(collectionItem)
        }

        collectionItem.setVisible(true)

        return collectionItem
    }

    private alginCollectionItems(): void {
        this.targetImages = []
        const collectionItems = this.listItems.filter((item) => {
            return item.visible
        })

        const amountCollection = collectionItems.length
        const padding = 263 / (amountCollection + 1) + 5
        const startX = -(padding * (amountCollection - 1)) / 2

        for (let i = 0; i < amountCollection; i++) {
            const collectionItem = collectionItems[i]

            Phaser.Display.Align.In.Center(
                collectionItem,
                this.backgroundContent,
                startX + padding * i
            )

            const key = collectionItem.getFrame()

            const targetImage = this.scene.make.image({ key: SPRITES.GAMEPLAY_32.KEY, frame: key })

            targetImage.setWorldSize(22, 22)
            targetImage.setVisible(false)

            this.targetImages.push(targetImage)

            Phaser.Display.Align.In.Center(
                targetImage,
                this.backgroundContent,
                startX + padding * i + this.scene.gameZone.width / 2,
                this.scene.gameZone.height / 2
            )
        }
    }

    private hideAllCollectionItems(): void {
        for (let i = 0; i < this.listItems.length; i++) {
            const collectionItem = this.listItems[i]

            collectionItem.setVisible(false)
        }
    }

    private moveGemsToCollectItems() {
        console.log('moveGemsToCollectItems')
        this.resetPositionTargetImages()
        const { header, main } = this.scene.layoutManager.objects
        const collectItems = header.collectItems
        const targetKeys = collectItems.getTargetKeys()

        const centerWidth = this.scene.gameZone.width / 2

        for (let i = 0; i < targetKeys.length; i++) {
            const key = targetKeys[i]
            const position = collectItems.getPositionCollectionItem(key)

            let pX = centerWidth + position.x
            let pY = position.y - 23

            if (this.scene.world.isLandscape()) {
                pX = header.collectItems.getWorldPosition().x
                pY = header.collectItems.getWorldPosition().y + position.y
            }

            this.targetImages[i].setAlpha(1)
            this.targetImages[i].setVisible(true)

            const itemCollectionEffect = this.getFreeAnim()

            const randomDuration = Phaser.Math.Between(500, 1000)

            itemCollectionEffect.setTarget(this.targetImages[i])
            const tween = itemCollectionEffect.runGemMoveToPosition(0, randomDuration, pX, pY)

            tween.on(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
                header.collectItems.showCollectItemByKey(key)

                this.targetImages[i].setVisible(false)
                if (i == this.targetImages.length - 1) {
                    main.board.handleTweenStartMission()
                }
            })
        }
    }

    private resetPositionTargetImages(): void {
        const amountCollection = this.listItems.filter((item) => {
            return item.visible
        })
        const padding = 263 / (amountCollection.length + 1) + 5
        const startX = -(padding * (amountCollection.length - 1)) / 2

        for (let i = 0; i < amountCollection.length; i++) {
            if (!this.targetImages[i]) continue

            this.targetImages[i]?.setVisible(false)
            Phaser.Display.Align.In.Center(
                this.targetImages[i],
                this.backgroundContent,
                startX + padding * i + this.scene.gameZone.width / 2,
                this.scene.gameZone.height / 2
            )
        }
    }

    private getFreeAnim(): ItemCollectionEffect {
        if (!this.scene.world.isLandscape()) {
            const itemCollectionEffect = new ItemCollectionEffect(this.scene)

            this.listAnimCollectionItem.push(itemCollectionEffect)

            return itemCollectionEffect
        }

        const itemCollectionEffect = new ItemCollectionEffectLandscape(this.scene)

        this.listAnimCollectionItem.push(itemCollectionEffect)

        return itemCollectionEffect
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, -19, 290, 218, {
            forceHeightTop: 55,
        })
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone)
    }

    private createTitle() {
        this.title = this.scene.add.container()

        const imageScale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_MISSION,
        })

        const { width, height } = text

        text.setWorldSize(width / imageScale, height / imageScale)

        this.title.add([text])

        this.popup.add(this.title)

        Phaser.Display.Align.In.Center(text, this.title, 0, -10)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup)
    }

    private addItem() {
        this.popup.add([this.title])

        this.contents = this.scene.add.group()
        this.contents.addMultiple([])
    }

    // Animations
    private runOpenAnimation(): void {
        if (this.popupShowUpAnimation?.tween?.isPlaying()) return

        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runFadeInMaskAnimation(100, 300)
        this.runPopupContentEntrancesAnimation(200, 300)
    }

    private runCloseAnimation(): void {
        if (this.popupFadeOutAnimation?.tween?.isPlaying()) return

        this.runPopupExitsAnimation(50, 200)

        this.scene.time.delayedCall(50, () => {
            this.moveGemsToCollectItems()
        })

        this.runFadeOutMaskAnimation(0, 200)
    }

    // Entrances animations
    private runPopupEntrancesAnimation(delay: number, duration: number): void {
        if (!this.popupShowUpAnimation) {
            const { y, scale } = this.popup
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
                onComplete: () => {
                    this.popup.setY(0)
                    this.scene.screen.close(this.name)

                    this.scene.startGameAfterCollectionItemsScreenClose()
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

export default CollectionItemsScreen
