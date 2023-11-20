import FBInstantAdapter from './adapters/facebook/FBInstantAdapter'
import MsGamesAdapter from './adapters/msgames/MsGamesAdapter'

if ('FBInstant' in window) {
    window.GameSDK = new FBInstantAdapter(window.FBInstant)
}

if ('$msstart' in window) {
    window.GameSDK = new MsGamesAdapter(window.$msstart)
}

// ? Reference for Phaser Plugin FBInstant, Mock FBInstant,...
//@ts-expect-error override some method
window.FBInstant = window.GameSDK
