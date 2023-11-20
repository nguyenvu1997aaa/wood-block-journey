const { ShowInspector } = GameCore.Configs.Debugger

const gameConfig: Phaser.Types.Core.GameConfig = {
    parent: 'app',
    type: Phaser.AUTO,
    width: 0,
    height: 0,
    scale: {
        autoRound: true,
    },
    dom: {
        createContainer: false,
    },
    // backgroundColor: '#333',
    loader: {
        maxParallelDownloads: 6,
        crossOrigin: 'no-cros',
    },
    input: {
        gamepad: false,
        keyboard: ShowInspector,
        touch: {
            capture: true, // set 'true' for smooth touch move
        },
        smoothFactor: 1, // smooth position when drag, 1 is not smooth: 0 -> 1
        activePointers: 1,
        windowEvents: false, // set 'true' for fix dragMove outsize of window
    },
    disableContextMenu: true,
    fps: {},
    render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: true,
        transparent: true, // some devices can't working, ex: crash and white scene on J2
        desynchronized: false, // set 'false' to fix some dropdown fps
        powerPreference: 'low-power',
        clearBeforeRender: false, // set 'true' when use for some feature need a transparent background
        roundPixels: false,
        // NEAREST             : use less cpu/gpu, output like pixel
        // LINEAR_MIPMAP_LINEAR: use more cpu/gpu, smooth and more ram
        // mipmapFilter: 'LINER',
    },
    plugins: {
        global: [],
    },
    // physics: {
    //     default: 'matter',
    // },
}

export default gameConfig
