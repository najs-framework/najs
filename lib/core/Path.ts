import { IAutoload, register } from 'najs-binding'
import { Facade } from 'najs-facade'
import { IPath } from './IPath'
import { ConfigFacade } from '../facades/global/ConfigFacade'
import { ConfigurationKeys, GlobalFacadeClass } from '../constants'
import * as SystemPath from 'path'
import { Najs } from './Najs'

export class Path extends Facade implements IPath, IAutoload {
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

  app(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths.app, 'app'), ...args)
  }

  config(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths.config, 'config'), ...args)
  }

  layout(...args: string[]): string {
    return this.cwd(
      ConfigFacade.get(ConfigurationKeys.Paths.layout, SystemPath.join('resources', 'view', 'layout')),
      ...args
    )
  }

  public(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths.public, 'public'), ...args)
  }

  resource(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths.resource, 'resources'), ...args)
  }

  route(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths.route, 'routes'), ...args)
  }

  storage(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths.storage, SystemPath.join('app', 'storage')), ...args)
  }

  view(...args: string[]): string {
    return this.cwd(ConfigFacade.get(ConfigurationKeys.Paths.view, SystemPath.join('resources', 'view')), ...args)
  }
}
register(Path, GlobalFacadeClass.Path)
