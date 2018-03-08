import { Guard } from './Guard'
import { IAuthenticatable } from '../interfaces/IAuthenticatable'

export class SessionGuard extends Guard {
  protected getSessionKey() {
    return 'user'
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
      return this.controller.session.get(sessionKey) === user.getAuthIdentifier()
    }
    return this.getRememberData().id === user.getAuthIdentifier()
  }

  async retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined> {
    if (this.hasUser()) {
      const user = await this.provider.retrieveById<T>(this.controller.session.get(this.getSessionKey()))
      if (!user) {
        const rememberData = this.getRememberData()
        return this.provider.retrieveByToken<T>(rememberData.id, rememberData.token)
      }
      return user
    }
    return undefined
  }

  async attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void> {
    this.controller.session.put(this.getSessionKey(), user.getAuthIdentifier())
    if (remember) {
      await this.rememberUser(user)
    }
  }

  async detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void> {
    this.controller.session.forget(this.getSessionKey())
    this.controller.cookie.forget(this.getCookieRememberKey())
  }
}
