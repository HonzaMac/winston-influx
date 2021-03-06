import InfluxWriter, { InfluxWriteOptions } from "./InfluxWriter"

let globalWriter: InfluxWriter;

export const connect = function (options: InfluxWriteOptions) {
    globalWriter = new InfluxWriter(options);
}

export const writePoint = function (measurement: string, tags: Record<string, string>, fields: Record<string, any>, time = new Date()) {
    if (globalWriter) {
        globalWriter.writePoint(measurement, tags, fields, time);
    }
}
