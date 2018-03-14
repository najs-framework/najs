import { IAutoload, register } from 'najs-binding'
import { Facade } from 'najs-facade'
import { ConfigFacade } from '../facades/global/ConfigFacade'
import { ConfigurationKeys, GlobalFacadeClass } from '../constants'
import * as SystemPath from 'path'
import { Najs } from './Najs'

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

// implements IPath implicitly
export class Path extends Facade implements IAutoload {
  static className: string = GlobalFacadeClass.Path

  getClassName() {
    return Path.className
  }

  get(...args: string[]): string {
    return this.cwd(...args)
  }

  cwd(...args: string[]): string {
    return SystemPath.resolve(Najs['cwd'], ...args)
  }
}

// add missing IPath functions
for (const name in NajsPaths) {
  Path.prototype[name] = function(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths[name], NajsPaths[name]), ...args)
  }
}

register(Path, GlobalFacadeClass.Path)
