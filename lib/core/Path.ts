import { IAutoload, register } from 'najs-binding'
import { Facade } from 'najs-facade'
import { IPath, IPathConstructor } from './IPath'
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

// IPath is implements implicitly to reduce repetition
class PathClass extends Facade implements IAutoload {
  static className: string = GlobalFacadeClass.Path

  getClassName() {
    return PathClass.className
  }

  get(...args: string[]): string {
    return this.cwd(...args)
  }

  cwd(...args: string[]): string {
    return SystemPath.resolve(Najs['cwd'], ...args)
  }
}

for (const name in NajsPaths) {
  PathClass.prototype[name] = function(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths[name], NajsPaths[name]), ...args)
  }
}

register(PathClass, GlobalFacadeClass.Path)
export const Path: IPath & IPathConstructor = <any>PathClass
