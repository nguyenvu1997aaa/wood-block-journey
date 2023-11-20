import PortraitLayout from './PortraitLayout'

// ? LandscapeLayout base form default (PortraitLayout)
class LandscapeLayout extends PortraitLayout {
    public alignUI(): void {
        super.alignUI()

        if (this.objects === null) return

        const { gameZone } = this.scene

        this.objects.header.updateUILandscape()
        this.objects.main.updateUILandscape()
        this.objects.footer.updateUILandscape()

        Phaser.Display.Align.In.Center(this.objects.header, gameZone, 0, -195)
        Phaser.Display.Align.In.Center(this.objects.main, gameZone, 0, 20)
        Phaser.Display.Align.In.Center(this.objects.footer, gameZone, 300, 0)
    }
}

export default LandscapeLayout
