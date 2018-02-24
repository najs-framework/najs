import { ContextualFacadeClass } from './../../constants'
import { IAutoload, register } from 'najs-binding'
import { ContextualFacade } from 'najs-facade'
import { Controller } from '../controller/Controller'
import { ISession } from './ISession'
import { RequestDataWriter } from '../request/RequestDataWriter'
import { ExpressController } from '../controller/ExpressController'

export class Session extends ContextualFacade<Controller> implements ISession, IAutoload {
  protected data: Object

  constructor(controller: Controller) {
    super(controller)
    controller.session = this
    if (controller instanceof ExpressController) {
      this.data = <Object>(controller as ExpressController).request.session
    }
  }

  getClassName() {
    return ContextualFacadeClass.Session
  }

  clear(): this {
    delete this.data
    if (this.context instanceof ExpressController) {
      delete (this.context as ExpressController).request.session
    }
    return this
  }

  // -------------------------------------------------------------------------------------------------------------------

  get<T extends any>(name: string): T
  get<T extends any>(name: string, defaultValue: T): T
  get<T extends any>(name: string, defaultValue?: T): T {
    return RequestDataWriter.prototype.get.apply(this, arguments)
  }

  has(name: string): boolean {
    return RequestDataWriter.prototype.has.apply(this, arguments)
  }

  exists(name: string): boolean {
    return RequestDataWriter.prototype.exists.apply(this, arguments)
  }

  all(): Object {
    return RequestDataWriter.prototype.all.apply(this, arguments)
  }

  only(name: string): Object
  only(names: string[]): Object
  only(...args: Array<string | string[]>): Object
  only(...args: Array<string | string[]>): Object {
    return RequestDataWriter.prototype.only.apply(this, arguments)
  }

  except(name: string): Object
  except(names: string[]): Object
  except(...args: Array<string | string[]>): Object
  except(...args: Array<string | string[]>): Object {
    return RequestDataWriter.prototype.except.apply(this, arguments)
  }

  set<T extends any>(path: string, value: T): this {
    return RequestDataWriter.prototype.set.apply(this, arguments)
  }

  put<T extends any>(path: string, value: T): this {
    return this.set(path, value)
  }

  push<T extends any>(path: string, value: T): this {
    return this.set(path, value)
  }

  pull<T extends any>(path: string): T
  pull<T extends any>(path: string, defaultValue: T): T
  pull<T extends any>(path: string, defaultValue?: T): T {
    return RequestDataWriter.prototype.pull.apply(this, arguments)
  }

  delete(path: string): this {
    return RequestDataWriter.prototype.delete.apply(this, arguments)
  }

  remove(path: string): this {
    return this.delete(path)
  }

  forget(path: string): this {
    return this.delete(path)
  }

  flush(): this {
    return this.clear()
  }
}

register(Session)
