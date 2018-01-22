"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("../core/register");
const Winston = require("winston");
const Config = require("config");
let WinstonLogger = WinstonLogger_1 = class WinstonLogger {
    constructor() {
        this.levels = {
            emergency: 'emerg',
            alert: 'alert',
            critical: 'crit',
            error: 'error',
            warning: 'warning',
            notice: 'notice',
            info: 'info',
            debug: 'debug'
        };
        this.logger = new Winston.Logger(Object.assign({}, {
            colors: Winston.config.syslog.colors,
            levels: Winston.config.syslog.levels
        }, Config.get(WinstonLogger_1.className)));
    }
    emergency(message, ...meta) {
        return this.log(this.levels.emergency, message, ...meta);
    }
    alert(message, ...meta) {
        return this.log(this.levels.alert, message, ...meta);
    }
    critical(message, ...meta) {
        return this.log(this.levels.critical, message, ...meta);
    }
    error(message, ...meta) {
        return this.log(this.levels.error, message, ...meta);
    }
    warning(message, ...meta) {
        return this.log(this.levels.warning, message, ...meta);
    }
    notice(message, ...meta) {
        return this.log(this.levels.notice, message, ...meta);
    }
    info(message, ...meta) {
        return this.log(this.levels.info, message, ...meta);
    }
    debug(message, ...meta) {
        return this.log(this.levels.debug, message, ...meta);
    }
    log(level, message, ...meta) {
        this.logger.log(level, message, ...meta);
        return this;
    }
};
WinstonLogger.className = 'WinstonLogger';
WinstonLogger = WinstonLogger_1 = __decorate([
    register_1.register()
], WinstonLogger);
exports.WinstonLogger = WinstonLogger;
var WinstonLogger_1;
