import { IAutoload } from 'najs-binding'
import { HandlebarsHelper } from '../HandlebarsHelper'
import { ExpressController } from '../../../http/controller/ExpressController'

export class SessionHandlebarsHelper extends HandlebarsHelper<any, ExpressController> implements IAutoload {
  static className: string = 'Najs.SessionHandlebarsHelper'

  getClassName() {
    return SessionHandlebarsHelper.className
  }

  run(command: string, ...args: any[]): undefined | boolean | string {
    const isBlockHelper = this.isBlockHelper()
    if (!this.controller || !this.controller.session) {
      return isBlockHelper ? undefined : ''
    }

    // if this is block helper, it's perform "has" function
    if (isBlockHelper) {
      return this.controller.session.has(command) ? this.renderChildren([]) : undefined
    }

    switch (command.toLowerCase()) {
      case 'reflash':
      case 'keep':
      case 'flash':
      case 'clear':
      case 'flush':
      case 'delete':
      case 'remove':
      case 'forget':
      case 'set':
      case 'put':
      case 'push':
      case 'except':
      case 'only':
        Reflect.apply(
          this.controller.session[command],
          this.controller.session,
          Array.from(arguments).slice(1, arguments.length)
        )
        return undefined

      case 'has':
      case 'exists':
      case 'pull':
      case 'all':
        return Reflect.apply(
          this.controller.session[command],
          this.controller.session,
          Array.from(arguments).slice(1, arguments.length)
        )

      default:
        if (arguments.length === 2) {
          return this.controller.session.get(command)
        }
        return this.controller.session.get(arguments[1])
    }
  }
}
