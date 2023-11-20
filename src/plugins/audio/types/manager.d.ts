interface IAudioManager {
    initMusic(key: string): void
    initSound(): void
    playSound(key: string, config?: Phaser.Types.Sound.SoundConfig): void
    stopSound(key: string): void
    /**
     * Should not use this method in gameplay
     *
     * This function use to avoid conflict logic with `muteAll`
     */
    pauseAllSounds(): void
    /**
     * Should not use this method in gameplay
     *
     * This function use to avoid conflict logic with `unmuteAll`
     */
    resumeAllSounds(): void
    importSoundEffectKeys(keys: TObject): void
    playMusic(config?: Phaser.Types.Sound.SoundConfig): void
    pauseMusic(): void
    stopMusic(): void
    setSoundVolume(volume: number): void
    setMusicVolume(volume: number): void
    muteAll(): void
    unmuteAll(): void
}
