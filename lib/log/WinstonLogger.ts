import { ILogger, LoggerLevels } from './ILogger'
import { register } from '../core/register'
import * as Winston from 'winston'
import * as Config from 'config'

@register()
export class WinstonLogger implements ILogger {
  static className = 'WinstonLogger'

  logger: Winston.LoggerInstance
  levels: LoggerLevels = {
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
    this.logger = new Winston.Logger(
      Object.assign(
        {},
        {
          colors: Winston.config.syslog.colors,
          levels: Winston.config.syslog.levels
        },
        Config.get(WinstonLogger.className)
      )
    )
  }

  emergency(message: string): this
  emergency(message: string, ...meta: any[]): this {
    return this.log(this.levels.emergency, message, ...meta)
  }

  alert(message: string): this
  alert(message: string, ...meta: any[]): this {
    return this.log(this.levels.alert, message, ...meta)
  }

  critical(message: string): this
  critical(message: string, ...meta: any[]): this {
    return this.log(this.levels.critical, message, ...meta)
  }

  error(message: string): this
  error(message: string, ...meta: any[]): this {
    return this.log(this.levels.error, message, ...meta)
  }

  warning(message: string): this
  warning(message: string, ...meta: any[]): this {
    return this.log(this.levels.warning, message, ...meta)
  }

  notice(message: string): this
  notice(message: string, ...meta: any[]): this {
    return this.log(this.levels.notice, message, ...meta)
  }

  info(message: string): this
  info(message: string, ...meta: any[]): this {
    return this.log(this.levels.info, message, ...meta)
  }

  debug(message: string): this
  debug(message: string, ...meta: any[]): this {
    return this.log(this.levels.debug, message, ...meta)
  }

  log(level: string, message: string): this
  log(level: string, message: string, ...meta: any[]): this {
    this.logger.log(level, message, ...meta)
    return this
  }
}
