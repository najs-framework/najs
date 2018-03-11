import { register, IAutoload } from 'najs-binding'
import { HandlebarsHelper } from '../HandlebarsHelper'
import { ExpressController } from '../../../http/controller/ExpressController'

const MODIFY_ACTIONS = [
  'reflash',
  'keep',
  'flash',
  'clear',
  'flush',
  'delete',
  'remove',
  'forget',
  'set',
  'put',
  'push'
]
const GET_RESULT_ACTIONS = ['has', 'exists', 'pull', 'all', 'except', 'only']

export class SessionHandlebarsHelper extends HandlebarsHelper<any, ExpressController> implements IAutoload {
  static className: string = 'Najs.SessionHandlebarsHelper'

  getClassName() {
    return SessionHandlebarsHelper.className
  }

  protected isValid() {
    return !this.controller || !this.controller.session ? false : true
  }

  protected handleBlockHelper(key: string): any {
    if (!this.isValid()) {
      return undefined
    }
    return (this.controller as ExpressController).session.has(key) ? this.renderChildren([]) : undefined
  }

  protected handleHelper(command: string, ...args: any[]): any {
    if (!this.isValid()) {
      return ''
    }

    const isGetResultAction = GET_RESULT_ACTIONS.indexOf(command) !== -1
    if (MODIFY_ACTIONS.indexOf(command) !== -1 || isGetResultAction) {
      const result = Reflect.apply(
        (this.controller as ExpressController).session[command],
        (this.controller as ExpressController).session,
        Array.from(arguments).slice(1, arguments.length)
      )
      return isGetResultAction ? result : undefined
    }

    if (arguments.length === 2) {
      return (this.controller as ExpressController).session.get(command)
    }
    return (this.controller as ExpressController).session.get(arguments[1])
  }

  run(command: string, ...args: any[]): undefined | boolean | string {
    if (this.isBlockHelper()) {
      return this.handleBlockHelper(command)
    }
    return this.handleHelper(command, ...args)
  }
}
register(SessionHandlebarsHelper)
