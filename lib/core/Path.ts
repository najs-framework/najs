import { IPath } from './IPath'
import { ConfigFacade } from '../facades/global/ConfigFacade'
import { ConfigurationKeys } from '../constants'
import * as SystemPath from 'path'
import { Najs } from './Najs'

export class Path implements IPath {
  protected workingDirectory: string

  constructor() {
    this.workingDirectory = Najs['cwd'] || ''
  }

  get(...args: string[]): string {
    return SystemPath.resolve(this.workingDirectory, ...args)
  }

  cwd(...args: string[]): string {
    return SystemPath.resolve(this.workingDirectory, ...args)
  }

  app(...args: string[]): string {
    return SystemPath.resolve(this.workingDirectory, ConfigFacade.get(ConfigurationKeys.Paths.app, 'app'), ...args)
  }

  config(...args: string[]): string {
    return SystemPath.resolve(
      this.workingDirectory,
      ConfigFacade.get(ConfigurationKeys.Paths.config, 'config'),
      ...args
    )
  }

  layout(...args: string[]): string {
    return SystemPath.resolve(
      this.workingDirectory,
      ConfigFacade.get(ConfigurationKeys.Paths.layout, SystemPath.join('resources', 'view', 'layout')),
      ...args
    )
  }

  public(...args: string[]): string {
    return SystemPath.resolve(
      this.workingDirectory,
      ConfigFacade.get(ConfigurationKeys.Paths.public, 'public'),
      ...args
    )
  }

  resource(...args: string[]): string {
    return SystemPath.resolve(
      this.workingDirectory,
      ConfigFacade.get(ConfigurationKeys.Paths.resource, 'resources'),
      ...args
    )
  }

  route(...args: string[]): string {
    return SystemPath.resolve(this.workingDirectory, ConfigFacade.get(ConfigurationKeys.Paths.route, 'routes'), ...args)
  }

  storage(...args: string[]): string {
    return SystemPath.resolve(
      this.workingDirectory,
      ConfigFacade.get(ConfigurationKeys.Paths.storage, SystemPath.join('app', 'storage')),
      ...args
    )
  }

  view(...args: string[]): string {
    return SystemPath.resolve(
      this.workingDirectory,
      ConfigFacade.get(ConfigurationKeys.Paths.view, SystemPath.join('resources', 'view')),
      ...args
    )
  }
}
