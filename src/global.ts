import InfluxWriter, { InfluxWriteOptions } from './InfluxWriter'

let globalWriter: InfluxWriter

export const connect = function (options: InfluxWriteOptions): void {
    globalWriter = new InfluxWriter(options)
}

export const writePoint = function (measurement: string, tags: Record<string, string>, fields: Record<string, unknown>, time: Date = new Date()): void {
    if (globalWriter) {
        globalWriter.writePoint(measurement, tags, fields, time)
    }
}
