"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("../core/register");
const constants_1 = require("../constants");
const Winston = require("winston");
class WinstonLogger {
    constructor() {
        this.logger = this.setup();
    }
    setup() {
        return new Winston.Logger(this.getDefaultOptions());
    }
    getDefaultOptions() {
        return Object.assign({}, {
            level: 'info',
            transports: [
                new Winston.transports.Console({
                    colorize: true,
                    timestamp: true,
                    stderrLevels: Object.values(WinstonLogger.levels)
                })
            ],
            colors: Winston.config.syslog.colors,
            levels: Winston.config.syslog.levels
        });
    }
    emergency(message, ...meta) {
        return this.log(WinstonLogger.levels.emergency, message, ...meta);
    }
    alert(message, ...meta) {
        return this.log(WinstonLogger.levels.alert, message, ...meta);
    }
    critical(message, ...meta) {
        return this.log(WinstonLogger.levels.critical, message, ...meta);
    }
    error(message, ...meta) {
        return this.log(WinstonLogger.levels.error, message, ...meta);
    }
    warning(message, ...meta) {
        return this.log(WinstonLogger.levels.warning, message, ...meta);
    }
    notice(message, ...meta) {
        return this.log(WinstonLogger.levels.notice, message, ...meta);
    }
    info(message, ...meta) {
        return this.log(WinstonLogger.levels.info, message, ...meta);
    }
    debug(message, ...meta) {
        return this.log(WinstonLogger.levels.debug, message, ...meta);
    }
    log(level, message, ...meta) {
        this.logger.log(level, message, ...meta);
        return this;
    }
}
WinstonLogger.className = 'WinstonLogger';
WinstonLogger.levels = {
    emergency: 'emerg',
    alert: 'alert',
    critical: 'crit',
    error: 'error',
    warning: 'warning',
    notice: 'notice',
    info: 'info',
    debug: 'debug'
};
exports.WinstonLogger = WinstonLogger;
// register WinstonLogger and using it as a default LoggerClass
register_1.register(WinstonLogger);
register_1.register(WinstonLogger, constants_1.LoggerClass);
