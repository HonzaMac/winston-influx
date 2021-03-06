import { connect, writePoint } from './global'
import InfluxTransport from './InfluxTransport'
import Batcher from './Batcher'
import InfluxWriter from './InfluxWriter'

export default {
    InfluxWriter,
    InfluxTransport,
    Batcher,
    connect,
    writePoint
}
