import PortraitLayout from './PortraitLayout'

// ? LandscapeLayout base form default (PortraitLayout)
class LandscapeLayout extends PortraitLayout {
    public alignUI(): void {
        super.alignUI()

        if (this.objects === null) return

        const { gameZone } = this.scene

        const bannerHeight = this.scene.ads.getBannerHeight()

        this.objects.main.backgroundContainer.setVisible(false)
        this.objects.main.backgroundContent.setVisible(false)
        this.objects.main.scroller.setSize(325, 325)
        this.objects.main.scroller.createMask()

        this.objects.footer.setScale(0.9)

        Phaser.Display.Align.In.TopCenter(this.objects.header, gameZone, 0, -10)
        Phaser.Display.Align.In.Center(this.objects.main, gameZone, 0, 0)
        Phaser.Display.Align.In.BottomCenter(this.objects.footer, gameZone, 0, -bannerHeight - 45)
    }
}

export default LandscapeLayout
