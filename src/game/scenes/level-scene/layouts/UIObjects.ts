import DEPTH_OBJECTS from '@/game/constants/depth'
import FooterLevelScreen from '../footer'
import HeaderLevelScreen from '../header'
import LevelScene from '../LevelScene'
import MainLevelScreen from '../main'

class UIObjects {
    public scene: LevelScene

    // ? Always public ui objects
    public header: HeaderLevelScreen
    public main: MainLevelScreen
    public footer: FooterLevelScreen

    // Groups
    private group: Phaser.GameObjects.Group

    constructor(scene: LevelScene) {
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
        this.header = new HeaderLevelScreen(this.scene)
        this.header.setDepth(DEPTH_OBJECTS.BACKGROUND)

        this.group.add(this.header)
    }

    private createMain() {
        this.main = new MainLevelScreen(this.scene)
        this.group.add(this.main)
    }

    private createFooter() {
        this.footer = new FooterLevelScreen(this.scene)
        this.footer.setDepth(DEPTH_OBJECTS.BACKGROUND)

        this.group.add(this.footer)
    }
}

export default UIObjects
