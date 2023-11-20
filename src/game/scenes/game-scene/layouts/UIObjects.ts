import Header from '@/game/scenes/game-scene/header'
import Footer from '../footer'
import GameScene from '../GameScene'
import Main from '../main'

class UIObjects {
    public scene: GameScene

    // ? Always public ui objects
    public header: Header
    public main: Main
    public footer: Footer

    // Groups
    private group: Phaser.GameObjects.Group

    constructor(scene: GameScene) {
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
        this.header = new Header(this.scene)
        this.group.add(this.header)
    }

    private createMain() {
        this.main = new Main(this.scene)
        this.group.add(this.main)
    }

    private createFooter() {
        this.footer = new Footer(this.scene)
        this.group.add(this.footer)
    }
}

export default UIObjects
