import { IAutoload, bind, register } from 'najs-binding'
import { SystemClass } from '../../constants'
import * as Session from 'express-session'

export class ExpressSessionMemoryStore extends Session.MemoryStore implements IAutoload {
  static className: string = 'ExpressSessionMemoryStore'

  getClassName() {
    return ExpressSessionMemoryStore.className
  }
}
register(ExpressSessionMemoryStore)
bind(SystemClass.ExpressSessionStore, ExpressSessionMemoryStore.className)
