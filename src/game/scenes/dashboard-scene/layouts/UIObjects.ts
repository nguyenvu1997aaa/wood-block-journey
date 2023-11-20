import DashboardScene from '../DashboardScene'
import FooterBar from '../footer'
import HeaderBar from '../header'
import MainContent from '../main'

class UIObjects {
    public scene: DashboardScene

    // ? Always public ui objects
    public main: MainContent
    public header: HeaderBar
    public footer: FooterBar

    // Groups
    private group: Phaser.GameObjects.Group

    constructor(scene: DashboardScene) {
        this.scene = scene

        this.createGroup()
        this.createObjects()
    }

    public getAll(): Phaser.GameObjects.GameObject[] {
        return this.group.getChildren()
    }

    private createGroup(): void {
        this.group = this.scene.add.group()
    }

    private createObjects(): void {
        // ? Main ui objects
        this.createMain()
        this.createHeader()
        this.createFooter()
    }

    private createHeader() {
        this.header = new HeaderBar(this.scene)
        this.group.add(this.header)
    }

    private createMain() {
        this.main = new MainContent(this.scene)
        this.group.add(this.main)
    }

    private createFooter() {
        this.footer = new FooterBar(this.scene)
        this.group.add(this.footer)
    }
}

export default UIObjects
