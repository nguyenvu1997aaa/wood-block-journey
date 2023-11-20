/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// var HTML5AudioSoundManager = require('phaser/sound/html5/HTML5AudioSoundManager')
// var NoAudioSoundManager = require('phaser/sound/noaudio/NoAudioSoundManager')
var WebAudioSoundManager = require('phaser/sound/webaudio/WebAudioSoundManager')

/**
 * Creates a Web Audio, HTML5 Audio or No Audio Sound Manager based on config and device settings.
 *
 * Be aware of https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
 *
 * @function Phaser.Sound.SoundManagerCreator
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - Reference to the current game instance.
 *
 * @return {(Phaser.Sound.HTML5AudioSoundManager|Phaser.Sound.WebAudioSoundManager|Phaser.Sound.NoAudioSoundManager)} The Sound Manager instance that was created.
 */
var SoundManagerCreator = {
    create: function (game) {
        return new WebAudioSoundManager(game)
    },
}

module.exports = SoundManagerCreator
