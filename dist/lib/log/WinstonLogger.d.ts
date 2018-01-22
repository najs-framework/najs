import { ILogger } from './ILogger';
import * as Winston from 'winston';
export declare class WinstonLogger implements ILogger {
    static className: string;
    protected logger: Winston.LoggerInstance;
    private static levels;
    constructor();
    protected getOptions(): {
        level: string;
        transports: Winston.TransportInstance[];
        colors: Winston.SyslogConfigSetColors;
        levels: Winston.SyslogConfigSetLevels;
    };
    protected loggerDidCreate(): void;
    emergency(message: string): this;
    emergency(message: string, ...meta: any[]): this;
    alert(message: string): this;
    alert(message: string, ...meta: any[]): this;
    critical(message: string): this;
    critical(message: string, ...meta: any[]): this;
    error(message: string): this;
    error(message: string, ...meta: any[]): this;
    warning(message: string): this;
    warning(message: string, ...meta: any[]): this;
    notice(message: string): this;
    notice(message: string, ...meta: any[]): this;
    info(message: string): this;
    info(message: string, ...meta: any[]): this;
    debug(message: string): this;
    debug(message: string, ...meta: any[]): this;
    log(level: string, message: string): this;
    log(level: string, message: string, ...meta: any[]): this;
}
