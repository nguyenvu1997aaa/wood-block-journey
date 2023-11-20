export interface iGameLevel {
    key: string
    mapJson: string
}

const isDebug = GameCore.Utils.Valid.isDebugger()

console.log('WWWWWWWWWWWWWWWW ', isDebug)

const GAME_LEVELS = [
    {
        key: 'level-0',
        mapJson: './assets/json/levels/level-0.json',
    },
    // ? Alway start with index 1 (level 1)
]

for (let i = 1; i <= 200; i++) {
    GAME_LEVELS.push({
        key: `level-${i}`,
        mapJson: `./assets/json/levels/level-${i}.json`,
    })
}

// if (GameCore.Utils.Valid.isDebugger()) {
//     for (let i = 1; i <= 76; i++) {
//         GAME_LEVELS.push({
//             key: `level-${i}`,
//             mapJson: `https://colorball-dev.sunstudio.io/level-${i}.json`,
//         })
//     }
// } else {
//     for (let i = 1; i <= 76; i++) {
//         GAME_LEVELS.push({
//             key: `level-${i}`,
//             mapJson: `./assets/json/levels/level-${i}.json`,
//         })
//     }
// }

export default GAME_LEVELS
