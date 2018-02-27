import { Controller } from '../../http/controller/Controller'

export abstract class HandlebarsHelper {
  protected context: any
  protected controller?: Controller
  protected options: any

  constructor(context: any, controller?: Controller) {
    this.context = context
    this.controller = controller
  }

  abstract run(): any

  isBlockHelper(): boolean {
    return typeof this.options.fn === 'function'
  }

  static createInstanceLevelHelper(controller: Controller, helper: typeof HandlebarsHelper) {
    return function(this: any) {
      const options = arguments[arguments.length - 1]
      const instance: HandlebarsHelper = Reflect.construct(helper, [this, controller])
      instance.options = options
      return instance.run.apply(instance, arguments)
    }
  }

  static createGlobalHelper(helper: typeof HandlebarsHelper): any {
    return function(this: any) {
      const options = arguments[arguments.length - 1]
      const instance: HandlebarsHelper = Reflect.construct(helper, [this])
      instance.options = options
      return instance.run.apply(instance, arguments)
    }
  }
}
