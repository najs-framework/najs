/// <reference path="../contracts/Log.d.ts" />
import { Facade } from 'najs-facade';
import * as Winston from 'winston';
export interface WinstonLogger extends Najs.Contracts.Log {
}
export declare class WinstonLogger extends Facade implements Najs.Contracts.Log {
    static className: string;
    protected logger: Winston.LoggerInstance;
    constructor();
    getClassName(): string;
    protected setup(): Winston.LoggerInstance;
    protected getDefaultOptions(): {
        level: string;
        transports: Winston.TransportInstance[];
        colors: Winston.SyslogConfigSetColors;
        levels: Winston.SyslogConfigSetLevels;
    };
    static readonly Levels: Najs.Log.LoggerLevels;
    log(level: string, message: string, ...meta: any[]): this;
}
