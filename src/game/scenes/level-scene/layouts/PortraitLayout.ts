import BaseLayout from './BaseLayout'
import UIObjects from './UIObjects'

class PortraitLayout extends BaseLayout {
    protected guideUI: Phaser.GameObjects.Group

    public alignUI(): void {
        if (this.objects === null) return

        const { gameZone } = this.scene

        const bannerHeight = this.scene.ads.getBannerHeight()

        Phaser.Display.Align.In.TopCenter(this.objects.header, gameZone, 0, -15)
        Phaser.Display.Align.In.Center(this.objects.main, gameZone, 0, -24)
        Phaser.Display.Align.In.BottomCenter(this.objects.footer, gameZone, 0, -bannerHeight - 45)
    }

    protected createGroups(): void {
        super.createGroups()

        this.guideUI = this.scene.add.group()

        this.groups.guideUI = this.guideUI
    }

    public setUIObjects(objects: UIObjects): void {
        super.setUIObjects(objects)

        this.addUIObjectsToGroups()
    }

    private addUIObjectsToGroups(): void {
        if (this.objects === null) return

        this.addObjectForGuideUI()
    }

    private addObjectForGuideUI(): void {
        if (this.objects === null) return

        // ! Use this.groups instead of this
        // ? because this is not updated when build for production (es5)

        /* this.groups.guideStateUI.addMultiple([
            // ...
        ]) */
    }
}

export default PortraitLayout
