import { Controller } from '../../http/controller/Controller'

export abstract class HandlebarsHelper {
  protected context: any
  protected controller?: Controller
  protected options: any

  protected constructor(context: any)
  protected constructor(context: any, controller: Controller)
  protected constructor(context: any, controller?: Controller) {
    this.context = context
    this.controller = controller
  }

  abstract run(): any

  isBlockHelper(): boolean {
    return typeof this.options !== 'undefined' && typeof this.options.fn === 'function'
  }

  static create(helper: typeof HandlebarsHelper): Function
  static create(helper: typeof HandlebarsHelper, controller: Controller): Function
  static create(helper: typeof HandlebarsHelper, controller?: Controller): Function {
    return function(this: any) {
      const options = arguments[arguments.length - 1]
      const instance: HandlebarsHelper = Reflect.construct(helper, [this, controller])
      instance.options = options
      return instance.run.apply(instance, arguments)
    }
  }
}
