import { register, IAutoload } from 'najs-binding'
import { HandlebarsHelper } from '../HandlebarsHelper'
import { ExpressController } from '../../../http/controller/ExpressController'

export class CookieHandlebarsHelper extends HandlebarsHelper<any, ExpressController> implements IAutoload {
  static className: string = 'Najs.CookieHandlebarsHelper'

  getClassName() {
    return CookieHandlebarsHelper.className
  }

  protected isValid() {
    return !this.controller || !this.controller.cookie ? false : true
  }

  protected handleBlockHelper(key: string): any {
    if (!this.isValid()) {
      return undefined
    }
    return (this.controller as ExpressController).cookie.has(key) ? this.renderChildren([]) : undefined
  }

  protected handleHelper(command: string, ...args: any[]): string {
    if (!this.isValid()) {
      return ''
    }

    const getResultActions = ['has', 'exists', 'all', 'except', 'only']
    if (getResultActions.indexOf(command) !== -1) {
      return Reflect.apply(
        (this.controller as ExpressController).cookie[command],
        (this.controller as ExpressController).cookie,
        Array.from(arguments).slice(1, arguments.length)
      )
    }

    if (arguments.length === 2) {
      return (this.controller as ExpressController).cookie.get(command)
    }
    return (this.controller as ExpressController).cookie.get(arguments[1])
  }

  run(command: string, ...args: any[]): undefined | boolean | string {
    if (this.isBlockHelper()) {
      return this.handleBlockHelper(command)
    }
    return this.handleHelper(command, ...args)
  }
}
register(CookieHandlebarsHelper)
