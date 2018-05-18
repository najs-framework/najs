import { ContextualFacadeClass } from '../../constants'
import { IAutoload, register } from 'najs-binding'
import { ContextualFacade } from 'najs-facade'
import { Controller } from '../controller/Controller'
import { FlashRegistry, ISession } from './ISession'
import { RequestDataWriter } from '../request/RequestDataWriter'
import { ExpressController } from '../controller/ExpressController'
import { flatten } from 'lodash'

export interface Session extends ISession {}
export class Session extends ContextualFacade<Controller> implements ISession, IAutoload {
  static FlashRegistryKey: string = '_flashRegistry'
  protected data: Object

  constructor(controller: Controller) {
    super(controller)
    controller.session = this
    if (controller instanceof ExpressController) {
      this.data = <Object>(controller as ExpressController).request.session
      if (this.data && this.data[Session.FlashRegistryKey]) {
        this.data[Session.FlashRegistryKey].reflash = false
        this.data[Session.FlashRegistryKey].keep = []
        if (!this.data[Session.FlashRegistryKey].flash) {
          this.data[Session.FlashRegistryKey].flash = []
        }
      }
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

  async regenerate(): Promise<void> {
    return <any>new Promise(resolve => {
      if (this.context instanceof ExpressController) {
        return this.data['regenerate'](() => {
          resolve()
        })
      }
      resolve()
    })
  }

  getFlashRegistry(): FlashRegistry {
    if (!this.data[Session.FlashRegistryKey]) {
      this.data[Session.FlashRegistryKey] = <FlashRegistry>{
        reflash: false,
        flash: [],
        keep: []
      }
    }
    return this.data[Session.FlashRegistryKey]
  }

  flash(path: string, value: any): this {
    const flashRegistry: FlashRegistry = this.getFlashRegistry()
    if (!flashRegistry.flash) {
      flashRegistry.flash = []
    }
    if (flashRegistry.flash.indexOf(path) === -1) {
      flashRegistry.flash.push(path)
    }
    return this.set(path, value)
  }

  reflash(): this {
    const flashRegistry: FlashRegistry = this.getFlashRegistry()
    flashRegistry.reflash = true
    return this
  }

  keep(path: string): this
  keep(paths: string[]): this
  keep(...args: Array<string | string[]>): this
  keep(...args: Array<any>): this {
    const paths: string[] = flatten(args)
    const flashRegistry: FlashRegistry = this.getFlashRegistry()
    if (!flashRegistry.keep) {
      flashRegistry.keep = []
    }
    flashRegistry.keep = Array.from(new Set(flashRegistry.keep.concat(paths)))
    return this
  }

  isFlashPath(path: string): boolean {
    const flashRegistry: FlashRegistry = this.getFlashRegistry()
    if (flashRegistry.reflash) {
      return false
    }
    if (flashRegistry.keep && flashRegistry.keep.indexOf(path) !== -1) {
      return false
    }
    if (flashRegistry.flash && flashRegistry.flash.indexOf(path) === -1) {
      return false
    }
    return true
  }

  // -------------------------------------------------------------------------------------------------------------------

  get<T extends any>(path: string): T
  get<T extends any>(path: string, defaultValue: T): T
  get<T extends any>(path: string, defaultValue?: T): T {
    if (this.isFlashPath(path)) {
      const value: T = RequestDataWriter.prototype.get.apply(this, arguments)
      this.delete(path)
      const flashRegistry: FlashRegistry = this.getFlashRegistry()
      flashRegistry.flash = flashRegistry.flash.filter(item => item !== path)
      return value
    }
    return RequestDataWriter.prototype.get.apply(this, arguments)
  }
}

// implements IRequestDataWriter implicitly
const IRequestDataWriterFunctions = [
  'has',
  'exists',
  'all',
  'only',
  'except',
  'set',
  'put',
  'push',
  'pull',
  'delete',
  'remove',
  'forget',
  'flush'
]
for (const name of IRequestDataWriterFunctions) {
  Session.prototype[name] = function() {
    return RequestDataWriter.prototype[name].apply(this, arguments)
  }
}

register(Session)
