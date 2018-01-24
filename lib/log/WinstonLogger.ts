import { ILogger, LoggerLevels } from './ILogger'
import { register } from '../core/register'
import { LoggerClass } from '../constants'
import * as Winston from 'winston'

export class WinstonLogger implements ILogger {
  static className = 'WinstonLogger'

  protected logger: Winston.LoggerInstance
  private static levels: LoggerLevels = {
    emergency: 'emerg',
    alert: 'alert',
    critical: 'crit',
    error: 'error',
    warning: 'warning',
    notice: 'notice',
    info: 'info',
    debug: 'debug'
  }

  constructor() {
    this.logger = new Winston.Logger(this.getOptions())
    this.loggerDidCreate()
  }

  protected getOptions() {
    return Object.assign(
      {},
      {
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
      }
    )
  }

  protected loggerDidCreate() {}

  emergency(message: string): this
  emergency(message: string, ...meta: any[]): this
  emergency(message: string, ...meta: any[]): this {
    return this.log(WinstonLogger.levels.emergency, message, ...meta)
  }

  alert(message: string): this
  alert(message: string, ...meta: any[]): this
  alert(message: string, ...meta: any[]): this {
    return this.log(WinstonLogger.levels.alert, message, ...meta)
  }

  critical(message: string): this
  critical(message: string, ...meta: any[]): this
  critical(message: string, ...meta: any[]): this {
    return this.log(WinstonLogger.levels.critical, message, ...meta)
  }

  error(message: string): this
  error(message: string, ...meta: any[]): this
  error(message: string, ...meta: any[]): this {
    return this.log(WinstonLogger.levels.error, message, ...meta)
  }

  warning(message: string): this
  warning(message: string, ...meta: any[]): this
  warning(message: string, ...meta: any[]): this {
    return this.log(WinstonLogger.levels.warning, message, ...meta)
  }

  notice(message: string): this
  notice(message: string, ...meta: any[]): this
  notice(message: string, ...meta: any[]): this {
    return this.log(WinstonLogger.levels.notice, message, ...meta)
  }

  info(message: string): this
  info(message: string, ...meta: any[]): this
  info(message: string, ...meta: any[]): this {
    return this.log(WinstonLogger.levels.info, message, ...meta)
  }

  debug(message: string): this
  debug(message: string, ...meta: any[]): this
  debug(message: string, ...meta: any[]): this {
    return this.log(WinstonLogger.levels.debug, message, ...meta)
  }

  log(level: string, message: string): this
  log(level: string, message: string, ...meta: any[]): this
  log(level: string, message: string, ...meta: any[]): this {
    this.logger.log(level, message, ...meta)
    return this
  }
}

// register WinstonLogger and using it as a default LoggerClass
register(WinstonLogger)
register(WinstonLogger, LoggerClass)
