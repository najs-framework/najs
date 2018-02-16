"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const register_1 = require("../core/register");
const Facade_1 = require("../facades/Facade");
const Winston = require("winston");
class WinstonLogger extends Facade_1.Facade {
    constructor() {
        super();
        this.logger = this.setup();
    }
    getClassName() {
        return constants_1.GlobalFacadeClass.Log;
    }
    setup() {
        const logger = new Winston.Logger(this.getDefaultOptions());
        return logger;
    }
    getDefaultOptions() {
        const defaultOptions = {
            level: 'info',
            transports: [
                new Winston.transports.Console({
                    colorize: true,
                    timestamp: true,
                    stderrLevels: Object.values(WinstonLogger.levels)
                })
                // new Winston.transports.File({
                //   name: 'info',
                //   filename: Path.join(storage, 'najs.log'),
                //   level: 'info'
                // }),
                // new Winston.transports.File({
                //   name: 'error',
                //   filename: Path.join(storage, 'najs-errors.log'),
                //   level: 'error'
                // })
            ],
            colors: Winston.config.syslog.colors,
            levels: Winston.config.syslog.levels
        };
        return Object.assign({}, defaultOptions);
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
WinstonLogger.className = constants_1.GlobalFacadeClass.Log;
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
register_1.register(WinstonLogger);
register_1.register(WinstonLogger, constants_1.GlobalFacadeClass.Log);
