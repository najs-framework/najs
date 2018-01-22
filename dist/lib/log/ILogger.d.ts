export declare type LoggerLevels = {
    emergency: string;
    alert: string;
    critical: string;
    error: string;
    warning: string;
    notice: string;
    info: string;
    debug: string;
};
export interface ILogger {
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
