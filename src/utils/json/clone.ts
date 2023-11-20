import decode from './decode'
import encode from './encode'

const func = (object: unknown): unknown => {
    return decode(encode(object))
}

export default func
