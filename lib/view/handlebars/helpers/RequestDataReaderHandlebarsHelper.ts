import { register, IAutoload } from 'najs-binding'
import { HandlebarsHelper } from '../HandlebarsHelper'
import { ExpressController } from '../../../http/controller/ExpressController'

const GET_RESULT_ACTIONS = ['has', 'exists', 'all', 'except', 'only']

export class RequestDataReaderHandlebarsHelper extends HandlebarsHelper<any, ExpressController> implements IAutoload {
  static className: string = 'Najs.RequestDataReaderHandlebarsHelper'
  protected property: string

  constructor(context: any, controller: ExpressController, property?: string) {
    super(context, controller)
    this.property = <any>property
  }

  getClassName() {
    return RequestDataReaderHandlebarsHelper.className
  }

  protected isValid() {
    return !this.controller || !this.controller[this.property] ? false : true
  }

  protected handleBlockHelper(key: string): any {
    if (!this.isValid()) {
      return undefined
    }
    return (this.controller as ExpressController)[this.property].has(key) ? this.renderChildren([]) : undefined
  }

  protected handleHelper(command: string, ...args: any[]): any {
    if (!this.isValid()) {
      return ''
    }

    if (GET_RESULT_ACTIONS.indexOf(command) !== -1) {
      return Reflect.apply(
        (this.controller as ExpressController)[this.property][command],
        (this.controller as ExpressController)[this.property],
        Array.from(arguments).slice(1, arguments.length)
      )
    }

    if (arguments.length === 2) {
      return (this.controller as ExpressController)[this.property].get(command)
    }
    return (this.controller as ExpressController)[this.property].get(arguments[1])
  }

  run(command: string, ...args: any[]): undefined | boolean | string {
    if (this.isBlockHelper()) {
      return this.handleBlockHelper(command)
    }
    return this.handleHelper(command, ...args)
  }
}
register(RequestDataReaderHandlebarsHelper)
