import { Controller } from '../../http/controller/Controller'

export abstract class HandlebarsHelper {
  protected context: any
  protected controller: Controller
  protected options: any

  constructor(context: any, controller: Controller) {
    this.context = context
    this.controller = controller
  }

  abstract run(): any

  isBlockHelper(): boolean {
    return typeof this.options.fn === 'function'
  }

  static create(name: string, controller: Controller, helper: typeof HandlebarsHelper): any {
    return {
      [name]: function() {
        const options = arguments[arguments.length - 1]
        const instance: HandlebarsHelper = Reflect.construct(helper, [this, controller])
        instance.options = options
        return instance.run.apply(instance, arguments)
      }
    }
  }
}
