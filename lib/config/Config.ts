import { GlobalFacadeClass } from '../constants'
import { Facade } from 'najs-facade'
import { IConfig } from './IConfig'
import * as ConfigLib from 'config'
import { IAutoload, register } from 'najs-binding'

export class Config extends Facade implements IConfig, IAutoload {
  static className: string = GlobalFacadeClass.Config
  protected config: ConfigLib.IConfig = ConfigLib

  getClassName() {
    return Config.className
  }

  get<T>(setting: string): T | undefined
  get<T>(setting: string, defaultValue: T): T
  get<T>(setting: string, defaultValue?: T): T | undefined {
    if (typeof defaultValue !== 'undefined' && !this.config.has(setting)) {
      return defaultValue
    }
    return this.config.get<T>(setting)
  }

  has(setting: string): boolean {
    return this.config.has(setting)
  }
}
register(Config, GlobalFacadeClass.Config)
