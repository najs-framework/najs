import { ExpressHttpDriver } from '../../driver/ExpressHttpDriver'
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase'
import { IAutoload, register } from 'najs-binding'
import { Path } from '../../../facades/global/PathFacade'
import * as Express from 'express'

export class StaticMiddleware extends ExpressMiddlewareBase implements IAutoload {
  static className: string = 'Najs.StaticMiddleware'
  protected publicPath: string
  protected directory: string

  getClassName() {
    return StaticMiddleware.className
  }

  // The format of this middleware looks like
  //  - static:~/public:/
  //  - static:~/css:/css
  protected parseParams(name: string, directory?: string, publicPath?: string) {
    if (directory) {
      this.directory = Path.cwd(directory.indexOf('~/') === 0 ? directory.substr(2) : directory)
    } else {
      this.directory = Path.public()
    }

    this.publicPath = publicPath || '/'
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    return Express.static(this.directory)
  }

  native(driver: ExpressHttpDriver): Express.Handler | Express.Handler[] | undefined {
    driver.getNativeDriver().use(<any>this.publicPath, <any>this.createMiddleware())
    return undefined
  }
}
register(StaticMiddleware)
