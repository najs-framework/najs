import { IAutoload, register, make } from 'najs-binding'
import { ContextualFacade } from 'najs-facade'
import { IGuard, GuardConfiguration } from './interfaces/IGuard'
import { IAuth } from './interfaces/IAuth'
import { IAuthenticatable } from './interfaces/IAuthenticatable'
import { Controller } from '../http/controller/Controller'
import { EventFacade } from '../facades/global/EventFacade'
import { ConfigFacade } from './../facades/global/ConfigFacade'
import { AuthEvent, ConfigurationKeys, ContextualFacadeClass } from '../constants'

export class AuthManager extends ContextualFacade<Controller> implements IAuth, IAutoload {
  static className: string = ContextualFacadeClass.Auth

  /**
   * The currently authenticated user.
   */
  protected currentUser: IAuthenticatable | undefined
  /**
   * The currently guard.
   */
  protected currentGuard: IGuard
  /**
   * Indicates if the logout method has been called.
   */
  protected loggedOut = false
  /**
   * Guard's configuration
   */
  protected configurations: {
    [key: string]: GuardConfiguration
  }
  /**
   * guard's instance bag
   */
  protected guardBag: { [key: string]: IGuard }

  constructor(controller: Controller) {
    super(controller)
    this.guardBag = {}
    this.configurations = ConfigFacade.get(ConfigurationKeys.Auth.guards, {
      web: {
        driver: 'Najs.SessionGuard',
        provider: 'Najs.GenericUser',
        isDefault: true
      }
    })
    this.guard(this.findDefaultGuardName())
  }

  getClassName() {
    return ContextualFacadeClass.Auth
  }

  findDefaultGuardName(): string {
    let firstName: string | undefined
    for (const name in this.configurations) {
      if (!this.configurations[name].isDefault) {
        if (!firstName) {
          firstName = name
        }
        continue
      }
      return name
    }
    return <string>firstName
  }

  resolveGuard(name: string): IGuard | undefined {
    let config = this.configurations[name]
    if (!config) {
      config = this.configurations[this.findDefaultGuardName()]
    }
    const provider = make(config.provider)
    return make<IGuard>(config.driver, [this.context, provider])
  }

  getCurrentGuard(): IGuard {
    return this.currentGuard
  }

  guard(name: string): IAuth {
    if (this.guardBag[name]) {
      this.currentGuard = this.guardBag[name]
    } else {
      const guard = this.resolveGuard(name)
      if (guard) {
        this.guardBag[name] = guard
        this.currentGuard = this.guardBag[name]
      }
    }
    return this
  }

  async login(user: IAuthenticatable): Promise<void>
  async login(user: IAuthenticatable, remember: boolean): Promise<void>
  async login(user: IAuthenticatable, remember: boolean = false): Promise<void> {
    EventFacade.emit(AuthEvent.Login, user, remember)

    this.currentGuard.attachUser(user, remember)
    this.setUser(user)
  }

  async logout(): Promise<void> {
    EventFacade.emit(AuthEvent.Logout, this.currentUser)

    if (!this.loggedOut && this.currentUser) {
      if (this.currentGuard.hasUser(this.currentUser)) {
        this.currentGuard.detachUser(this.currentUser)
      }
      this.currentUser = undefined
      this.loggedOut = true
    }
  }

  async attempt(credentials: Object, remember: boolean = false, login: boolean = true): Promise<boolean> {
    EventFacade.emit(AuthEvent.Attempt, credentials, remember, login)

    const user = await this.currentGuard.getUserProvider().retrieveByCredentials(credentials)
    if (user && this.currentGuard.getUserProvider().validateCredentials(user, credentials)) {
      if (login) {
        await this.login(user, remember)
      }
      return true
    }
    return false
  }

  async validate(credentials: Object): Promise<boolean> {
    return this.attempt(credentials, false, false)
  }

  check(): boolean {
    return !!this.getUser()
  }

  guest(): boolean {
    return !this.check()
  }

  user<T extends IAuthenticatable = IAuthenticatable>(): T | undefined {
    return this.getUser()
  }

  id<T extends any = string>(): T | undefined {
    if (this.loggedOut || !this.currentUser) {
      return undefined
    }
    return this.currentUser.getAuthIdentifier()
  }

  getUser<T extends IAuthenticatable = IAuthenticatable>(): T | undefined {
    if (this.loggedOut) {
      return undefined
    }
    return <T>this.currentUser
  }

  setUser<T extends IAuthenticatable = IAuthenticatable>(user: T): void {
    this.currentUser = user
    this.loggedOut = false
  }
}
register(AuthManager)
