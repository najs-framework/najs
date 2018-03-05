import { register, IAutoload } from 'najs-binding'
import { HandlebarsHelper } from '../HandlebarsHelper'
import { ExpressController } from '../../../http/controller/ExpressController'

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

  run(command: string, ...args: any[]): undefined | boolean | string {
    const isBlockHelper = this.isBlockHelper()
    if (!this.controller || !this.controller[this.property]) {
      return isBlockHelper ? undefined : ''
    }

    // if this is block helper, it's perform "has" function
    if (isBlockHelper) {
      return this.controller[this.property].has(command) ? this.renderChildren([]) : undefined
    }

    switch (command.toLowerCase()) {
      case 'has':
      case 'exists':
      case 'all':
      case 'except':
      case 'only':
        return Reflect.apply(
          this.controller[this.property][command],
          this.controller[this.property],
          Array.from(arguments).slice(1, arguments.length)
        )

      default:
        if (arguments.length === 2) {
          return this.controller[this.property].get(command)
        }
        return this.controller[this.property].get(arguments[1])
    }
  }
}
register(RequestDataReaderHandlebarsHelper)
