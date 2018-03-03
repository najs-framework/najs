import { Guard } from './Guard'
import { IAuthenticatable } from '../interfaces/IAuthenticatable'

export class PassportGuard extends Guard {
  hasUser(): boolean
  hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean
  hasUser<T extends IAuthenticatable = IAuthenticatable>(user?: T): boolean {
    if (typeof user === 'undefined') {
      return this.controller.session.has('passport.user')
    }
    return this.controller.request['user'][user.getAuthIdentifierName()] === user.getAuthIdentifier()
  }

  /**
   * Get the currently authenticated user.
   */
  async retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined> {
    return this.controller.request['user']
  }

  /**
   * Save the user to request.
   *
   * @param {IAuthenticatable} user
   * @param {boolean} remember
   */
  async attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void> {
    this.controller.request['login'](user)
  }

  /**
   * Remove the user and out of request.
   *
   * @param {IAuthenticatable} user
   */
  async detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void> {
    this.controller.request['logout']()
  }
}
