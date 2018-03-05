import { register } from 'najs-binding'
import { IGenericUser } from './interfaces/IGenericUser'
import { IAuthenticatable } from './interfaces/IAuthenticatable'
import { IUserProvider } from './interfaces/IUserProvider'
import { AuthClass } from '../constants'
import { Eloquent, EloquentMongooseSpec } from 'najs-eloquent'
import { Schema } from 'mongoose'
import * as Crypto from 'crypto'

export const GenericUserBase: EloquentMongooseSpec<IGenericUser, GenericUser> = Eloquent.Mongoose<
  IGenericUser,
  GenericUser
>()
export class GenericUser extends GenericUserBase implements IAuthenticatable, IUserProvider {
  static className: string = AuthClass.GenericUser

  getClassName() {
    return GenericUser.className
  }

  getSchema() {
    return new Schema(
      {
        email: { type: String, required: true },
        password: { type: String, required: true },
        password_salt: { type: String, required: true },
        remember_token: { type: String }
      },
      { collection: 'users' }
    )
  }

  protected isValidCredentials(credentials: Object) {
    return credentials['email'] && credentials['password']
  }

  protected createQueryByCredentials(credentials: Object): any {
    return this.where('email', credentials['email'])
  }

  protected hashPassword(password: string, passwordSalt: string) {
    const hash: Crypto.Hmac = Crypto.createHmac('sha512', this.password_salt)
    hash.update(password)
    return hash.digest('base64')
  }

  getAuthIdentifierName(): string {
    return 'id'
  }

  getAuthIdentifier(): any {
    return this.id
  }

  getAuthPassword(): string {
    return this.password
  }

  getRememberToken(): string {
    return this.remember_token
  }

  setRememberToken(value: string): void {
    this.remember_token = value
  }

  getRememberTokenName(): string {
    return 'remember_token'
  }

  async retrieveById<T extends IAuthenticatable = IAuthenticatable>(identifier: any): Promise<T | undefined> {
    return this.where('id', identifier).first()
  }

  async retrieveByToken<T extends IAuthenticatable = IAuthenticatable>(
    identifier: any,
    token: string
  ): Promise<T | undefined> {
    return this.where(this.getAuthIdentifierName(), identifier)
      .where(this.getRememberTokenName(), token)
      .first()
  }

  async updateRememberToken<T extends IAuthenticatable = IAuthenticatable>(user: T, token: string): Promise<void> {
    this.where(user.getAuthIdentifierName(), user.getAuthIdentifier()).update({
      [user.getRememberTokenName()]: token
    })
  }

  async retrieveByCredentials<T extends IAuthenticatable = IAuthenticatable>(
    credentials: Object
  ): Promise<T | undefined> {
    if (this.isValidCredentials(credentials)) {
      return this.createQueryByCredentials(credentials).first()
    }
    return undefined
  }

  async validateCredentials<T extends IAuthenticatable = IAuthenticatable>(
    user: T,
    credentials: Object
  ): Promise<boolean> {
    const hashedPassword = this.hashPassword(credentials['password'], user['password_salt'])
    return hashedPassword === user.getAuthPassword()
  }
}
register(GenericUser)
