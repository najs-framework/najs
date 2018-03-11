import { flatten } from 'lodash'
import { IAutoload } from 'najs-binding'
import { Log } from '../../facades/global/LogFacade'

export type MemberProxySetting = {
  chainable?: string[]
  returnUndefined?: string[]
  returnTrue?: string[]
  returnFalse?: string[]
  returnEmptyObject?: string[]
  returnPromiseUndefined?: string[]
  [key: string]: any
}

const supportedSettingKeys = [
  'chainable',
  'returnUndefined',
  'returnTrue',
  'returnFalse',
  'returnEmptyObject',
  'returnPromiseUndefined'
]

export class MemberProxy implements IAutoload {
  static className = 'Najs.MemberProxy'
  protected message: string
  protected members: string[]
  protected settings: MemberProxySetting
  protected proxy: any

  constructor(message: string, settings: MemberProxySetting) {
    this.message = message
    this.settings = settings

    const members: string[][] = []
    for (const name in settings) {
      members.push(supportedSettingKeys.indexOf(name) === -1 ? [name] : this.settings[name])
    }
    this.members = Array.from(new Set(flatten(members)))
    this.proxy = this.createProxy()
    return this.proxy
  }

  getClassName() {
    return MemberProxy.className
  }

  protected createProxy() {
    const proxy = new Proxy(this, {
      get(target: MemberProxy, key: string): any {
        const customReturns = {
          chainable: target.proxy,
          returnTrue: true,
          returnFalse: false,
          returnUndefined: undefined,
          returnEmptyObject: {},
          returnPromiseUndefined: Promise.resolve(undefined)
        }
        for (const name in customReturns) {
          if (target.settings[name] && target.settings[name].indexOf(key) !== -1) {
            return function() {
              Log.warning(target.message.replace('{{key}}', key))
              return customReturns[name]
            }
          }
        }
        return target.settings[key] || target[key]
      }
    })
    return proxy
  }
}
