import IMAGES from '@/game/constants/resources/images'
import Loading from './Loading'

export interface IAvatarFramePayload {
    id?: string
    url?: string
    width: number
    height: number
    key: string
    frame?: string
    background: string
    radius?: number
    borderWidth?: number
    loadDelay?: number
}

class AvatarFrame extends Phaser.GameObjects.Container {
    public payload: IAvatarFramePayload

    public loading: Loading
    public photo: Phaser.GameObjects.Image
    public avtFrame: Phaser.GameObjects.Image
    public background: Phaser.GameObjects.Image

    protected loadPhotoTimer: Phaser.Time.TimerEvent

    constructor(scene: Phaser.Scene, payload: IAvatarFramePayload) {
        super(scene)

        this.scene.add.existing(this)

        this.payload = payload
        this.setSize(payload.width, payload.height)

        this.createBackground()
        this.createLoading()
        this.createPhoto()
        this.createFrame()

        const { id, url, radius } = this.payload
        if (id && url) {
            this.loadPhoto(id, url, radius)
        }

        this.addDefaultListeners()
    }

    public setFrame(frame: string): void {
        this.avtFrame.setFrame(frame)
        this.avtFrame.setVisible(true)
    }

    public setBackground(frame: string): void {
        this.background.setFrame(frame)
    }

    public loadPhoto(id: string, url: string, radius = 0) {
        this.payload.id = id
        this.payload.url = url
        this.payload.radius = radius

        this.loadPhotoTimer?.remove()

        if (!id || !url) {
            this.setPhoto(IMAGES.AVATAR.KEY)
            return
        }

        const texture = this.scene.textures.get(id)

        if (texture && texture.key === id) {
            this.handleLoadComplete(id)
            return
        }

        this.showLoading(true)

        const delayTime = this.payload.loadDelay || 0
        this.loadPhotoTimer = this.scene.time.delayedCall(
            delayTime,
            this.handleLoadPhotoAfterDelay(id, url)
        )
    }

    private handleLoadPhotoAfterDelay = (id: string, url: string) => (): void => {
        const texture = this.scene.textures.get(id)

        if (texture && texture.key === id) {
            this.handleLoadComplete(id)
            return
        }

        this.scene.load.once(`filecomplete-image-${id}`, this.handleLoadComplete)

        this.scene.load.image(id, url)
        this.scene.load.start()
    }

    private addDefaultListeners() {
        this.scene.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, this.handleLoadPhotoFailed)
        this.on(Phaser.GameObjects.Events.DESTROY, () => {
            this.loadPhotoTimer?.remove()
            this.scene.load.off(Phaser.Loader.Events.FILE_LOAD_ERROR, this.handleLoadPhotoFailed)
        })
    }

    private handleLoadComplete = (key: string): void => {
        if (!this.scene) return

        const { id, radius = 0 } = this.payload
        if (!id || id !== key) return

        const avatarBorderedId = `${id}_bordered_${radius}`
        const photoId = radius > 0 ? avatarBorderedId : id
        const texture = this.scene.textures.get(photoId)

        if (texture && texture.key === photoId) {
            this.setPhoto(texture.key)
            return
        }

        if (radius != 0 && radius < 100) {
            const success = GameCore.Utils.Image.drawBorder({
                scene: this.scene,
                key: id,
                newKey: avatarBorderedId,
                radius,
            })

            if (!success) {
                this.showLoading(false)
                return
            }

            this.setPhoto(avatarBorderedId)
        } else if (radius == 100) {
            const success = GameCore.Utils.Image.drawCircle({
                scene: this.scene,
                key: id,
                newKey: avatarBorderedId,
            })

            if (!success) {
                this.showLoading(false)
                return
            }

            this.setPhoto(avatarBorderedId)
        } else {
            this.setPhoto(id)
        }
    }

    private handleLoadPhotoFailed = (photo: Phaser.Loader.FileTypes.ImageFile) => {
        if (photo.key !== this.payload.id) return
        this.setDefaultAvatar(photo.key)
    }

    private setDefaultAvatar(key: string) {
        this.loadPhoto(key, IMAGES.AVATAR.FILE, this.payload.radius)
    }

    private createBackground(): void {
        const { key, background, borderWidth = 0 } = this.payload
        this.background = this.scene.make.image({ key, frame: background })

        this.background.setWorldSize(this.width - borderWidth, this.height - borderWidth)
        this.add(this.background)
    }

    private createLoading(): void {
        this.loading = new Loading(this.scene)

        this.loading.setWorldSize(this.width * 0.75, this.height * 0.75)

        this.loading.setVisible(false)

        this.add(this.loading)
    }

    private createPhoto(): void {
        this.photo = this.scene.make.image({
            x: 0,
            y: 0,
            origin: {
                x: 0.5,
                y: 0.5,
            },
            visible: false,
        })

        this.add(this.photo)
    }

    private createFrame(): void {
        const { key, frame, width, height } = this.payload
        if (!frame) {
            this.avtFrame = this.scene.make.image({
                x: 0,
                y: 0,
                origin: { x: 0.5, y: 0.5 },
                visible: false,
            })
        } else {
            this.avtFrame = this.scene.make.image({ key, frame })
            this.avtFrame.setWorldSize(width, height)
        }
        this.add(this.avtFrame)
    }

    private showLoading(enable: boolean): void {
        this.photo.setVisible(!enable)
        this.loading.setVisible(enable)
    }

    protected setPhoto(texture: string): void {
        this.showLoading(false)

        this.photo.setTexture(texture)
        this.photo.setFrame(0)

        const { width, height } = this.payload

        const size = Math.min(width, height) - (this.payload.borderWidth || 8)
        this.photo.setWorldSize(size, size)

        Phaser.Display.Align.In.Center(this.photo, this.background)
    }
}

export default AvatarFrame
