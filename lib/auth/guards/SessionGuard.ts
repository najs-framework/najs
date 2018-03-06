import { Guard } from './Guard'
import { IAuthenticatable } from '../interfaces/IAuthenticatable'
import * as Crypto from 'crypto'

export type RememberData = {
  id: any
  token: string
}

export class SessionGuard extends Guard {
  protected getRememberData(): RememberData {
    return this.controller.cookie.get<RememberData>(this.getCookieKey(), { id: undefined, token: '' })
  }

  protected getSessionKey() {
    return 'user'
  }

  protected getCookieKey() {
    return 'user'
  }

  hasUser(): boolean
  hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean
  hasUser<T extends IAuthenticatable = IAuthenticatable>(user?: T): boolean {
    const sessionKey = this.getSessionKey()
    const cookieKey = this.getCookieKey()
    if (typeof user === 'undefined') {
      return this.controller.session.has(sessionKey) || this.controller.cookie.has(cookieKey)
    }

    if (this.controller.session.has(sessionKey)) {
      return this.controller.request[sessionKey] === user.getAuthIdentifier()
    }
    return this.getRememberData().id === user.getAuthIdentifier()
  }

  async retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined> {
    if (this.hasUser()) {
      const user = await this.provider.retrieveById<T>(this.controller.request[this.getSessionKey()])
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
      const token = Crypto.randomBytes(48).toString('base64')
      this.provider.updateRememberToken(user, token)
      this.controller.cookie.forever(this.getCookieKey(), <RememberData>{ id: user.getAuthIdentifier(), token: token })
    }
  }

  async detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void> {
    this.controller.session.forget(this.getSessionKey())
    this.controller.cookie.forget(this.getCookieKey())
  }
}
