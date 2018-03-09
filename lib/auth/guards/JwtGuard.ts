import { ConfigurationKeys } from '../../constants'
import { ConfigFacade } from '../../facades/global/ConfigFacade'
import { Guard } from './Guard'
import { IAuthenticatable } from '../interfaces/IAuthenticatable'
import Base64Url from 'base64url'
import * as Crypto from 'crypto'
import * as JWT from 'jsonwebtoken'
import * as Moment from 'moment'

export type JwtGuardOptions = {
  secret: string
  expireInMinute: number
  encrypt: boolean
  encryptPassword: string
  encryptAlgorithm: string
  encryptedPrefix: string
}

export class JwtGuard extends Guard {
  protected options: JwtGuardOptions

  protected initialize() {
    this.options = ConfigFacade.get<JwtGuardOptions>(ConfigurationKeys.Auth.jwtGuard, {
      secret: 'najs',
      expireInMinute: 30,
      encrypt: false,
      encryptPassword: '',
      encryptAlgorithm: 'aes256',
      encryptedPrefix: ''
    })
  }

  protected getToken(): string {
    if (this.controller.request.headers['x-auth-token']) {
      return <string>this.controller.request.headers['x-auth-token']
    }

    if (this.controller.request.headers['authorization']) {
      // 'Bearer ' has 7 characters
      return (<string>this.controller.request.headers['authorization']).substr(7)
    }

    if (this.controller.cookie.exists('token')) {
      return this.controller.cookie.get('token', '')
    }

    return process.env.NODE_ENV !== 'production' && this.controller.request['query']['token']
      ? this.controller.request['query']['token']
      : ''
  }

  protected encryptToken(token: string): string {
    if (!this.options.encrypt) {
      return token
    }

    const cipher = Crypto.createCipher(this.options.encryptAlgorithm, this.options.encryptPassword)
    let encrypted: string = cipher.update(token, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return this.options.encryptedPrefix + Base64Url.fromBase64(encrypted)
  }

  protected decryptToken(input: string): string {
    if (!this.options.encrypt) {
      return input
    }
    const encrypted: string = Base64Url.toBase64(input.substr(this.options.encryptedPrefix.length))
    const decipher = Crypto.createDecipher(this.options.encryptAlgorithm, this.options.encryptPassword)
    let token: string = decipher.update(encrypted, 'base64', 'utf8')
    token += decipher.final('utf8')
    return token
  }

  hasUser(): boolean
  hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean
  hasUser<T extends IAuthenticatable = IAuthenticatable>(user?: T): boolean {
    return !!this.getToken()
  }

  async retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined> {
    const rawToken = this.getToken()
    if (!rawToken) {
      return undefined
    }

    try {
      const token: string = this.decryptToken(rawToken)
      const payload: any = JWT.verify(this.decryptToken(token), this.options.secret)
      return payload.data
    } catch (exception) {
      if (exception instanceof JWT.TokenExpiredError) {
      }
      return undefined
    }
  }

  async attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void> {
    const now = Moment()
    const expired = remember ? now.add(this.options.expireInMinute, 'minutes').toDate() : now.add(5, 'years').toDate()
    const payload = {
      exp: Math.floor(expired.getTime() / 1000),
      data: user
    }
    const token = this.encryptToken(JWT.sign(payload, this.options.secret))
    this.controller.response.setHeader('X-Auth-Token', token)
    this.controller.cookie.forever('token', token)
  }

  async detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void> {
    // TODO: forget token
    this.controller.cookie.forget('token')
  }
}
