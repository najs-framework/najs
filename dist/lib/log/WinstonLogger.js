"use strict";
/// <reference path="../contracts/Log.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const najs_facade_1 = require("najs-facade");
const Winston = require("winston");
const SyslogLevels = {
    emergency: 'emerg',
    alert: 'alert',
    critical: 'crit',
    error: 'error',
    warning: 'warning',
    notice: 'notice',
    info: 'info',
    debug: 'debug'
};
class WinstonLogger extends najs_facade_1.Facade {
    constructor() {
        super();
        this.logger = this.setup();
    }
    getClassName() {
        return constants_1.Najs.Log.WinstonLogger;
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
                    stderrLevels: Object.values(SyslogLevels)
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
    static get Levels() {
        return SyslogLevels;
    }
    log(level, message, ...meta) {
        this.logger.log(level, message, ...meta);
        return this;
    }
}
WinstonLogger.className = constants_1.Najs.Log.WinstonLogger;
exports.WinstonLogger = WinstonLogger;
// implicit implements Najs.Contracts.Log
for (const name in SyslogLevels) {
    WinstonLogger.prototype[name] = function (message, ...meta) {
        return this.log(SyslogLevels[name], message, ...meta);
    };
}
najs_binding_1.register(WinstonLogger, constants_1.Najs.Log.WinstonLogger);
