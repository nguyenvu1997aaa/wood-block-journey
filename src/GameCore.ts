import Utils from '@/utils'
import Configs from '@/configs'
import LiveUpdate from '@/modules/live-update'

const GameCore = { Configs, Utils, LiveUpdate }

window.GameCore = GameCore

const NODE_ENV = import.meta.env.SNOWPACK_PUBLIC_NODE_ENV
console.warn(NODE_ENV, { Configs, isDebugger: Utils.Valid.isDebugger() })

export default GameCore
