/// <reference path="../contracts/Path.ts" />

import { IAutoload, register } from 'najs-binding'
import { Facade } from 'najs-facade'
import { ConfigFacade } from '../facades/global/ConfigFacade'
import { ConfigurationKeys, Najs as NajsClasses } from '../constants'
import * as SystemPath from 'path'
import { Najs } from '../core/Najs'

const NajsPaths = {
  app: 'app',
  config: 'config',
  layout: SystemPath.join('resources', 'view', 'layout'),
  public: 'public',
  resource: 'resources',
  route: 'routes',
  storage: SystemPath.join('app', 'storage'),
  view: SystemPath.join('resources', 'view')
}

export interface Path extends Najs.Contracts.Path {}
export class Path extends Facade implements IAutoload {
  static className: string = NajsClasses.FileSystem.Path

  getClassName() {
    return NajsClasses.FileSystem.Path
  }

  get(...args: string[]): string {
    return this.cwd(...args)
  }

  cwd(...args: string[]): string {
    return SystemPath.resolve(Najs['cwd'], ...args)
  }
}

for (const name in NajsPaths) {
  Path.prototype[name] = function(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths[name], NajsPaths[name]), ...args)
  }
}

register(Path, NajsClasses.FileSystem.Path)
