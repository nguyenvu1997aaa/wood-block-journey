import { updatePlayerProfileNotificationAsync } from '@/api/notification'
import { AnalyticsEvents } from '@/constants/Analytics'
import LoadResourceFail from '@/exceptions/LoadResourceFail'
import FONTS from '@/game/constants/resources/fonts'
import IMAGES from '@/game/constants/resources/images'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import ModuleDailyTasks from '@/modules/daily-tasks'
import { loadLives } from '@/modules/lives/actions/lives'
import { loadLevel } from '@/modules/match/actions/match'
import { getJourneyMatchLevel } from '@/modules/match/selectors/match'
import ModuleMissions from '@/modules/missions'
import { processContextData } from '@/redux/actions/loader'
import { updateActiveSceneKey } from '@/redux/actions/scene'
import { sendException, sendExceptionWithScope } from '@/utils/Sentry'
import SOUNDS from '../constants/resources/sounds'
import SPINES from '../constants/resources/spines'
import GAME_LEVELS from '../gameplay/constants/GameLevels'
import GlobalScene from './global-scene'

const { AppId, Notification } = GameCore.Configs
const { EFFECTS } = SOUNDS

type SoundKey = keyof typeof EFFECTS

class LoadScene extends Phaser.Scene {
    private isMusicLoaded = false

    public preload(): void {
        const langCode = this.getLangCode()

        this.facebook.progressLoading.loadingProgressFbLoadScene()

        // Analytics
        this.analytics.event(AnalyticsEvents.SCREEN_OPEN, {
            screen_name: 'LoadScene',
        })

        // Events
        this.load.on('progress', (value: number) => {
            this.facebook.progressLoading.onProgress(value)
        })

        this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: TObject) => {
            const error = new LoadResourceFail('Load resources at LoadScene failed.')
            sendExceptionWithScope(error, { file: file?.url })
        })

        // Assets
        this.load.multiatlas(
            SPRITES.DEFAULT.KEY,
            SPRITES.DEFAULT.JSON.replace(/{\w+}/g, langCode),
            SPRITES.DEFAULT.URL.replace(/{\w+}/g, langCode)
        )

        // Fonts
        this.load.bitmapFont(
            FONTS.PRIMARY.KEY,
            FONTS.PRIMARY.TEXTURE.replace(/(fonts)/g, `fonts${langCode}`),
            FONTS.PRIMARY.DATA.replace(/(fonts)/g, `fonts${langCode}`)
        )
        this.load.bitmapFont(
            FONTS.PRIMARY_LIGHT.KEY,
            FONTS.PRIMARY_LIGHT.TEXTURE.replace(/(fonts)/g, `fonts${langCode}`),
            FONTS.PRIMARY_LIGHT.DATA.replace(/(fonts)/g, `fonts${langCode}`)
        )

        this.load.bitmapFont(
            FONTS.NUMBER_LIGHT.KEY,
            FONTS.NUMBER_LIGHT.TEXTURE,
            FONTS.NUMBER_LIGHT.DATA
        )

        this.load.bitmapFont(
            FONTS.NUMBER_DARK.KEY,
            FONTS.NUMBER_DARK.TEXTURE,
            FONTS.NUMBER_DARK.DATA
        )

        // Texture
        this.load.atlas({
            key: SPRITES.EFFECTS.KEY,
            textureURL: SPRITES.EFFECTS.PATH.replace(/{\w+}/g, langCode),
            atlasURL: SPRITES.EFFECTS.JSON.replace(/{\w+}/g, langCode),
        })

        this.load.atlas({
            key: SPRITES.GAMEPLAY_32.KEY,
            textureURL: SPRITES.GAMEPLAY_32.TEXTURE,
            atlasURL: SPRITES.GAMEPLAY_32.JSON,
        })

        this.load.atlas({
            key: SPRITES.GAMEPLAY.KEY,
            textureURL: SPRITES.GAMEPLAY.TEXTURE,
            atlasURL: SPRITES.GAMEPLAY.JSON,
        })

        if (this.world.isLandscape()) {
            this.load.image(IMAGES.BACKGROUND.KEY, IMAGES.BACKGROUND.FILE_LANDSCAPE)
        } else {
            this.load.image(IMAGES.BACKGROUND.KEY, IMAGES.BACKGROUND.FILE_PORTRAIT)
        }

        this.load.image(IMAGES.AVATAR.KEY, IMAGES.AVATAR.FILE)

        this.load.spine(
            SPINES.BEST_SCORE.KEY,
            SPINES.BEST_SCORE.JSON.replace(/{\w+}/g, langCode),
            SPINES.BEST_SCORE.ATLAS.replace(/{\w+}/g, langCode)
        )

        this.load.spine(SPINES.LOGO.KEY, SPINES.LOGO.JSON, [SPINES.LOGO.ATLAS], true)

        // Profile
        this.player.updateData().then(this.processAfterUpdatePlayerProfile).catch(sendException)
    }

    public create() {
        this.audio.initSound()
        this.audio.importSoundEffectKeys(SOUNDS.EFFECTS)

        this.analytics.event(AnalyticsEvents.LOAD_COMPLETE)

        this.facebook.on('startgame', this.handleFBInstantGameStarted)
        this.facebook.gameStarted()

        this.initModules()
        this.setupGlobalScene()
        this.lazyLoadResource()
        // this.handleShowAdWhenStartGame()

        this.startGame()
    }

    private getLangCode(): string {
        // return '/tr'

        let langCode = ''
        const locale = this.facebook.getLocale()

        switch (locale) {
            case 'ru':
                langCode = '/ru'
                break
            case 'pt':
                langCode = '/pt'
                break
            case 'fr':
                langCode = '/fr'
                break
            case 'hi':
                langCode = '/hi'
                break
            case 'it':
                langCode = '/it'
                break
            case 'id':
                langCode = '/id'
                break
            case 'de':
                langCode = '/de'
                break
            case 'ja':
                langCode = '/ja'
                break
            case 'es':
                langCode = '/es'
                break
            case 'zh':
                langCode = '/zh'
                break
            case 'ar':
                langCode = '/ar'
                break
            case 'tr':
                langCode = '/tr'
                break
        }

        // if (SupportedLanguage.indexOf(locale) !== -1) {
        //     langCode = `/${locale}`
        // }

        return langCode
    }

    private handleFBInstantGameStarted = () => {
        window.__fbGameReady = true

        // ? Call after FBInstant startGameAsync
        // * If await this request will be blocked with a black scene
        this.player.requestConnectedPlayers()
    }

    private processAfterUpdatePlayerProfile = (): void => {
        if (!Notification.Enable) return

        // ? Sync player profile to notification service
        this.updatePlayerProfileToNotificationService()

        if (Notification.DisableSendNotification) return

        // ? When have playerASID, send a notification
        this.sendNotificationForNewUser()
    }

    private updatePlayerProfileToNotificationService(): void {
        const player = this.player.getPlayer()
        const { playerId, name, photo, locale, ASID } = player

        const profileData = {
            appId: AppId,
            playerId,
            name,
            photo,
            locale,
            ASID,
        }

        console.info('🚀 > profileData', profileData)

        updatePlayerProfileNotificationAsync(profileData)
    }

    private async sendNotificationForNewUser(): Promise<void> {
        try {
            const isNewUser = this.player.getPlayerIsNew()
            if (!isNewUser) return

            const playerASID = this.player.getPlayerASID()
            if (!playerASID) return

            const data = (await FBInstant.player.getDataAsync(['isNotificationFirstSent'])) || {}
            const { isNotificationFirstSent } = data

            if (isNotificationFirstSent === true) return

            this.facebook.sendNotificationAsync({
                message: `Hi @[${playerASID}] your friends are waiting to play with you, play now!`,
                delayTime: 14400, // 4 hours
            })

            FBInstant.player.setDataAsync({ isNotificationFirstSent: true })
        } catch (error) {
            console.warn('🚀 > sendNotificationForNewUser', error)
        }
    }

    private setupGlobalScene(): void {
        const scene = this.scene.get(SceneKeys.GLOBAL_SCENE)
        if (!(scene instanceof GlobalScene)) return

        scene.setup()
    }

    private startGame = (): void => {
        // ! Navigation dev scene
        /* this.time.delayedCall(500, () => {
            this.scene.switch(SceneKeys.TEST_SCENE)
        })
        return */

        this.analytics.event(AnalyticsEvents.APP_READY)

        this.storage.dispatch(updateActiveSceneKey(SceneKeys.LOAD_SCENE))

        this.storage.dispatch(processContextData())
    }

    private initModules(): void {
        new ModuleMissions(this.game)
        new ModuleDailyTasks(this.game)
    }

    private lazyLoadResource(): void {
        // ? Don't use time.delayedCall, because it will be paused by scene.switch
        setTimeout(() => {
            // ? Resume this scene for run loader
            this.scene.wake()

            this.loadSounds()

            this.lazyLoadLevel()

            this.lazyLoadLives()

            // this.loadTexture32Bit(SPRITES.EFFECTS.KEY, [SPRITES.EFFECTS.TEXTURE_32BIT])
            // this.loadTexture32Bit(SPRITES.GAMEPLAY.KEY, [SPRITES.GAMEPLAY.TEXTURE_32BIT])
            // this.loadTexture32Bit(SPRITES.DEFAULT.KEY, SPRITES.DEFAULT.TEXTURE_32BIT)

            this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                this.scene.sleep()
            })
        }, 1500)
    }

    private async lazyLoadLevel(): Promise<void> {
        try {
            const state = this.storage.getState()
            const level = getJourneyMatchLevel(state)

            if (level) return

            await this.storage.dispatch(loadLevel())

            this.loadLevelConfig()
        } catch (error) {
            sendException(error)
        }
    }

    private async lazyLoadLives(): Promise<void> {
        try {
            await this.storage.dispatch(loadLives())
        } catch (error) {
            sendException(error)
        }
    }

    private loadLevelConfig(): void {
        try {
            const state = this.storage.getState()
            const level = getJourneyMatchLevel(state)
            let levelData = GAME_LEVELS[level]

            if (!levelData) {
                levelData = GAME_LEVELS[GAME_LEVELS.length - 1]
            }

            const { key, mapJson } = levelData

            if (this.cache.tilemap.exists(key)) {
                return
            }

            this.load.tilemapTiledJSON(key, mapJson)
            this.load.start()
        } catch (error) {
            sendException(error)
        }
    }

    private loadSounds(): void {
        this.loadSoundEffects()
        // this.loadMusic()
    }

    private loadSoundEffects(): void {
        const keys = Object.keys(SOUNDS.EFFECTS) as SoundKey[]

        keys.forEach((key) => {
            this.load.audio(key, SOUNDS.EFFECTS[key])
        })
    }

    public loadMusic() {
        if (this.isMusicLoaded) return
        this.isMusicLoaded = true

        const { FILE_KEY_COMPLETE } = Phaser.Loader.Events

        this.load.once(
            `${FILE_KEY_COMPLETE}audio-${SOUNDS.BACKGROUND.KEY}`,
            this.handleLoadMusicCompleted
        )

        this.load.audio(SOUNDS.BACKGROUND.KEY, SOUNDS.BACKGROUND.FILE)

        this.load.start()
    }

    private handleLoadMusicCompleted = (): void => {
        this.audio.initMusic(SOUNDS.BACKGROUND.KEY)

        const { player } = this.game
        const isMusicEnabled = !!player.getPlayerSetting('music')

        if (!isMusicEnabled) return

        this.audio.playMusic()
    }

    private handleShowAdWhenStartGame() {
        const { InterstitialAdOptions } = GameCore.Configs.Ads
        if (!InterstitialAdOptions.showWhenStartGame) return

        const now = this.time.now
        const timeToLoadAd = GameCore.Utils.Device.isDesktop() ? 4000 : 7000
        const timeForWaiting = Math.max(timeToLoadAd - now, 10)

        //? create loading screen by using HTML for make sure all games work fine without conflicts.

        const showingAdsTexts: { [key: string]: string } = {
            en: 'Initializing...',
            ru: 'Инициализация...',
            pt: 'Inicializando...',
            es: 'Inicializando...',
            ar: 'تهيئة...',
            hi: 'प्रारंभ कर रहा है...',
            zh: '初始化中...',
            tr: 'Başlatılıyor...',
            ja: '初期化中...',
            fr: 'Initialisation en cours...',
            id: 'Menginisialisasi...',
            de: 'Initialisierung...',
            it: 'Inizializzazione...',
        }

        const showingAdsText = showingAdsTexts[this.lang.getCurrentLanguage() || ''] || ''
        const loadingScreen = document.createElement('div')
        loadingScreen.id = 'wait-ads-mask'
        const loadingElement = document.createElement('div')
        loadingElement.id = 'wait-ads-content'
        loadingScreen.appendChild(loadingElement)
        const loadingIcon = document.createElement('div')
        loadingIcon.id = 'wait-ads-dual-ring'
        loadingElement.appendChild(loadingIcon)

        const loadingText = document.createElement('div')
        loadingText.id = 'wait-ads-text'
        loadingText.innerHTML = showingAdsText
        loadingElement.appendChild(loadingText)

        document.body.appendChild(loadingScreen)

        //? make sure interstitial ad is loaded (Some platform don't have preload ads)
        this.audio.muteAll()

        setTimeout(async () => {
            try {
                this.audio.stopMusic()
                this.audio.muteAll()
                //? make the flow correct
                await this.ads.preloadPreRollAdAsync()

                await this.ads.showPreRollAdAsync()
            } catch (error) {
                sendException(error)
            } finally {
                loadingScreen.remove()
                //? reload interstitial ad -> make sure next interstitial work fine.
                this.ads.preloadInterstitialAdAsync().catch(() => {
                    // ? is safe
                })
                this.audio.unmuteAll()
                this.audio.playMusic()
            }
        }, timeForWaiting)
    }

    private loadTexture32Bit(sourceKey: string, textureURL: string[]): void {
        const listKeys: string[] = []

        textureURL.forEach((url) => {
            const tempKey = GameCore.Utils.String.generateObjectId()

            this.load.image(tempKey, url)

            listKeys.push(tempKey)
        })

        this.load.start()

        const callback = (key: string) => {
            const idx = listKeys.indexOf(key)

            if (idx === -1) return

            console.log('loadTexture32Bit', sourceKey)

            const textures32Bit = this.textures.get(key)
            const texture8Bit = this.textures.get(sourceKey)

            texture8Bit.source[idx].glTexture = textures32Bit.source[0].glTexture
            texture8Bit.source[idx].glIndex = textures32Bit.source[0].glIndex
            texture8Bit.source[idx].glIndexCounter = textures32Bit.source[0].glIndexCounter

            // this.textures.off(Phaser.Textures.Events.ADD, callback)
        }

        this.textures.on(Phaser.Textures.Events.ADD, callback)
    }
}

export default LoadScene
