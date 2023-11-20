import { merge } from 'merge-anything'
import configs from './config.defaults'

import configDevelopmentCustom from './config.development.custom'
import configDevelopmentDefaults from './config.development.defaults'

import configProductionCustom from './config.production.custom'
import configProductionDefaults from './config.production.defaults'

let config = configs
const NODE_ENV = import.meta.env.SNOWPACK_PUBLIC_NODE_ENV

switch (NODE_ENV) {
    case 'development':
        // @ts-expect-error is valid
        config = merge({ ...config }, configDevelopmentDefaults)

        // @ts-expect-error is valid
        config = merge({ ...config }, configDevelopmentCustom)
        break
    case 'production':
        // @ts-expect-error is valid
        config = merge({ ...config }, configProductionDefaults)

        // @ts-expect-error is valid
        config = merge({ ...config }, configProductionCustom)
        break
}

export default config
