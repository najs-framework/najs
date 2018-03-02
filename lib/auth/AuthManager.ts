import { ContextualFacade } from 'najs-facade'
import { IGuard } from './interfaces/IGuard'
import { IAuth } from './interfaces/IAuth'
import { IUserProvider } from './interfaces/IUserProvider'
import { IAuthenticatable } from './interfaces/IAuthenticatable'
import { Controller } from '../http/controller/Controller'
import { Event } from '../facades/global/EventFacade'
import { AuthEvent } from '../constants'

export class AuthManager extends ContextualFacade<Controller> implements IAuth {
  /**
   * The currently authenticated user.
   */
  protected currentUser: IAuthenticatable | undefined
  /**
   * The currently guard.
   */
  protected currentGuard: IGuard
  /**
   * The user provider implementation.
   */
  protected provider: IUserProvider
  /**
   * Indicates if the logout method has been called.
   */
  protected loggedOut = false

  constructor(controller: Controller) {
    super(controller)
  }

  check(): boolean {
    return !!this.user()
  }

  guest(): boolean {
    return !this.check()
  }

  user<T extends IAuthenticatable = IAuthenticatable>(): T | undefined {
    if (this.loggedOut) {
      return undefined
    }
    return <T>this.currentUser
  }

  id<T extends any = string>(): T | undefined {
    if (this.loggedOut || !this.currentUser) {
      return undefined
    }
    return this.currentUser.getAuthIdentifier()
  }

  async validate(credentials: Object): Promise<boolean> {
    return this.attempt(credentials, false, false)
  }

  setUser<T extends IAuthenticatable = IAuthenticatable>(user: T): void {
    this.currentUser = user
    this.loggedOut = false
  }

  guard(name: string): IAuth
  guard(name: Function): IAuth
  guard(name: any): IAuth {
    return this
  }

  login(user: IAuthenticatable, remember: boolean = false): void {
    Event.emit(AuthEvent.Login, user, remember)

    this.setUser(user)
  }

  logout(user: IAuthenticatable): void {
    Event.emit(AuthEvent.Logout, user)

    this.currentUser = undefined
    this.loggedOut = true
  }

  async attempt(credentials: Object, remember: boolean = false, login: boolean = true): Promise<boolean> {
    return false
  }
}
