/// <reference path="../contracts/Config.ts" />

import { Najs } from '../constants'
import { Facade } from 'najs-facade'
import * as ConfigLib from 'config'
import { register } from 'najs-binding'

export class Config extends Facade implements Najs.Contracts.Config {
  static className: string = Najs.Config
  protected config: ConfigLib.IConfig = ConfigLib

  getClassName() {
    return Najs.Config
  }

  get<T>(name: string, defaultValue?: T): T | undefined {
    if (typeof defaultValue !== 'undefined' && !this.config.has(name)) {
      return defaultValue
    }
    return this.config.get<T>(name)
  }

  has(setting: string): boolean {
    return this.config.has(setting)
  }
}
register(Config, Najs.Config)
