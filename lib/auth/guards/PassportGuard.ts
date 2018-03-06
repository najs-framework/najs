import { Guard } from './Guard'
import { IAuthenticatable } from '../interfaces/IAuthenticatable'

export class PassportGuard extends Guard {
  protected getSessionKey() {
    return 'passport.user'
  }

  hasUser(): boolean
  hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean
  hasUser<T extends IAuthenticatable = IAuthenticatable>(user?: T): boolean {
    const sessionKey = this.getSessionKey()
    const cookieKey = this.getCookieRememberKey()
    if (typeof user === 'undefined') {
      return this.controller.session.has(sessionKey) || this.controller.cookie.has(cookieKey)
    }

    if (this.controller.session.has(sessionKey)) {
      return this.controller.request['user'][user.getAuthIdentifierName()] === user.getAuthIdentifier()
    }

    return this.getRememberData().id === user.getAuthIdentifier()
  }

  /**
   * Get the currently authenticated user.
   */
  async retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined> {
    const user = this.controller.request['user']
    if (!user) {
      const rememberData = this.getRememberData()
      const rememberUser = this.provider.retrieveByToken<T>(rememberData.id, rememberData.token)
      if (rememberUser) {
        this.controller.request['login'](rememberUser)
      }
      return rememberUser
    }
    return user
  }

  /**
   * Save the user to request.
   *
   * @param {IAuthenticatable} user
   * @param {boolean} remember
   */
  async attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void> {
    this.controller.request['login'](user)
    if (remember) {
      await this.rememberUser(this.getCookieRememberKey(), user)
    }
  }

  /**
   * Remove the user and out of request.
   *
   * @param {IAuthenticatable} user
   */
  async detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void> {
    this.controller.request['logout']()
    this.controller.cookie.forget(this.getCookieRememberKey())
  }
}
