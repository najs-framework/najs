import { ILogger, LoggerLevels } from './ILogger';
import * as Winston from 'winston';
export declare class WinstonLogger implements ILogger {
    static className: string;
    logger: Winston.LoggerInstance;
    levels: LoggerLevels;
    constructor();
    emergency(message: string): this;
    alert(message: string): this;
    critical(message: string): this;
    error(message: string): this;
    warning(message: string): this;
    notice(message: string): this;
    info(message: string): this;
    debug(message: string): this;
    log(level: string, message: string): this;
}
