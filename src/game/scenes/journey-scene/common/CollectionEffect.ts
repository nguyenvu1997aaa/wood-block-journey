import { ICaptureCell } from '@/constants/ICommon'
import JourneyScene from '..'
import ItemCollectionEffect from './ItemCollectionEffect'
import ItemCollectionEffectLandscape from './ItemCollectionEffectLandscape'

class CollectionEffect {
    public scene: JourneyScene
    private listAnimCollectionItem: ItemCollectionEffect[] = []

    constructor(scene: JourneyScene) {
        this.scene = scene
    }

    public handleShowEffect(captureCells: ICaptureCell[]): void {
        if (!captureCells || captureCells.length === 0) return

        const { header } = this.scene.layoutManager.objects
        const targetKeys = header.collectItems.getTargetKeys()
        const jsonAmount = header.collectItems.getJsonAmount()
        const jsonTarget = header.collectItems.getJsonTarget()
        let countTargetAmount = 0

        for (let i = 0; i < targetKeys.length; i++) {
            const key = targetKeys[i]
            const captureCellsFilter = captureCells.filter((item) => {
                return item.frame === key
            })

            const newAmount = jsonAmount[key] + captureCellsFilter.length

            if (newAmount >= jsonTarget[key]) {
                countTargetAmount++
            }

            this.showEffect(captureCellsFilter)
        }

        if (countTargetAmount === Object.keys(jsonTarget).length) {
            this.scene.setLevelCompleted(true)
        }

        // Check collection item complete
        this.scene.time.delayedCall(2000, () => {
            this.scene.handleCollectionItemsComplete()
        })
    }

    private showEffect(captureCells: ICaptureCell[]): void {
        let amount = captureCells.length
        const { header, main } = this.scene.layoutManager.objects
        const dataBoard = main.board.dataBoard

        for (let i = 0; i < captureCells.length; i++) {
            const { x, y, frame } = captureCells[i]
            const { cell } = dataBoard[y][x]
            const { imageBreak } = cell
            const center = this.scene.gameZone.width / 2
            const position = header.collectItems.getPositionCollectionItem(frame)
            let pX = center + position.x
            let pY = position.y - 24

            if (this.scene.world.isLandscape()) {
                pX = header.collectItems.getWorldPosition().x
                pY = header.collectItems.getWorldPosition().y + position.y - 3

                console.log(pX, pY)
            }

            const itemCollectionEffect = this.getFreeAnim()

            this.scene.layoutManager.objects.main.board.bringToTop(cell)

            cell.resetImageBreak()
            imageBreak.setVisible(true)
            imageBreak.setFrame(frame)

            itemCollectionEffect.setTarget(imageBreak)
            itemCollectionEffect.onComplete = () => {
                amount--
                imageBreak.setVisible(false)
                imageBreak.setPosition(0, 0)

                header.collectItems.collectItem(frame)

                if (amount <= 0) {
                    const collectItem = header.collectItems.getCollectItemByKey(frame)
                    collectItem.runAnimCollectionItem()

                    this.scene.updateMatchData()
                }
            }

            itemCollectionEffect.runScaleUpAnimation(0, 300)
            itemCollectionEffect.runScaleDownAnimation(450, 400)
            itemCollectionEffect.runAnimMoveToPosition(700, Phaser.Math.Between(500, 1000), pX, pY)
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
}

export default CollectionEffect
