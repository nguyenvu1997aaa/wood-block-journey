const imageScale = GameCore.Utils.Image.getImageScale()

const IMAGES = {
    AVATAR: {
        KEY: 'avatar',
        FILE: './assets/images/others/avatar.png',
        CONFIG: {},
    },
    ICON_EARTH: {
        KEY: 'icon-earth',
        FILE: './assets/images/others/icon-earth.png',
        CONFIG: {},
    },
    BACKGROUND: {
        KEY: 'background',
        FILE_LANDSCAPE: `./assets/images/${imageScale}x/background-landscape.jpg`,
        FILE_PORTRAIT: `./assets/images/${imageScale}x/background-portrait.jpg`,
        CONFIG: {},
    },
}

export default IMAGES
