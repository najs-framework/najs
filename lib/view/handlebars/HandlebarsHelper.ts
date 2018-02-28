import { make } from 'najs-binding'
import { Controller } from '../../http/controller/Controller'

export abstract class HandlebarsHelper<Context extends Object = {}, Ctrl extends Controller = Controller> {
  protected context: Context
  protected controller?: Ctrl
  protected options: any

  protected constructor(context: Context)
  protected constructor(context: Context, controller: Ctrl)
  protected constructor(context: Context, controller?: Ctrl) {
    this.context = context
    this.controller = controller
  }

  abstract run(...args: any[]): any

  isBlockHelper(): boolean {
    return typeof this.options !== 'undefined' && typeof this.options.fn === 'function'
  }

  renderChildren(blockParams: any[]): any {
    return this.options.fn(this.context, { data: this.options.data, blockParams: blockParams })
  }

  static create(helper: typeof HandlebarsHelper): Function
  static create(helper: typeof HandlebarsHelper, controller: Controller): Function
  static create(helper: typeof HandlebarsHelper, controller: Controller, ...args: any[]): Function
  static create(helper: typeof HandlebarsHelper, controller?: Controller, ...args: any[]): Function {
    return function(this: any) {
      const options = arguments[arguments.length - 1]
      const instance: HandlebarsHelper = make(helper, [this, controller, ...args])
      instance.options = options
      return instance.run.apply(instance, arguments)
    }
  }
}
