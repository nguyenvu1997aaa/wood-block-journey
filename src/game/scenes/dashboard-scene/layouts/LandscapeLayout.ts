import PortraitLayout from './PortraitLayout'

// ? LandscapeLayout base form default (PortraitLayout)
class LandscapeLayout extends PortraitLayout {
    public alignUI(): void {
        super.alignUI()

        if (this.objects === null) return

        const { gameZone } = this.scene

        this.objects.main.logo.setY(-150)
        this.objects.main.setScale(0.95)
        this.objects.footer.setVisible(false)

        Phaser.Display.Align.In.TopCenter(this.objects.header, gameZone)
        Phaser.Display.Align.In.Center(this.objects.main, gameZone)
        Phaser.Display.Align.In.BottomCenter(this.objects.footer, gameZone)
    }
}

export default LandscapeLayout
