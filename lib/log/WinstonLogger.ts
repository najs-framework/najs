/// <reference path="../contracts/Log.ts" />

import { register } from 'najs-binding'
import { Najs } from '../constants'
import { Facade } from 'najs-facade'
import * as Winston from 'winston'

const SyslogLevels: Najs.Log.LoggerLevels = {
  emergency: 'emerg',
  alert: 'alert',
  critical: 'crit',
  error: 'error',
  warning: 'warning',
  notice: 'notice',
  info: 'info',
  debug: 'debug'
}

export interface WinstonLogger extends Najs.Contracts.Log {}
export class WinstonLogger extends Facade implements Najs.Contracts.Log {
  static className: string = Najs.Log.WinstonLogger

  protected logger: Winston.LoggerInstance

  constructor() {
    super()
    this.logger = this.setup()
  }

  getClassName(): string {
    return Najs.Log.WinstonLogger
  }

  protected setup(): Winston.LoggerInstance {
    const logger = new Winston.Logger(this.getDefaultOptions())
    return logger
  }

  protected getDefaultOptions() {
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
    }
    return Object.assign({}, defaultOptions)
  }

  static get Levels() {
    return SyslogLevels
  }

  log(level: string, message: string, ...meta: any[]): this {
    this.logger.log(level, message, ...meta)
    return this
  }
}

// implicit implements Najs.Contracts.Log
for (const name in SyslogLevels) {
  WinstonLogger.prototype[name] = function(message: string, ...meta: any[]) {
    return this.log(SyslogLevels[name], message, ...meta)
  }
}

register(WinstonLogger, Najs.Log.WinstonLogger)
