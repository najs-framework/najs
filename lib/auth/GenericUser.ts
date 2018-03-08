import { register } from 'najs-binding'
import { IGenericUser } from './interfaces/IGenericUser'
import { IAuthenticatable } from './interfaces/IAuthenticatable'
import { AuthClass } from '../constants'
import { Eloquent, EloquentMongooseSpec } from 'najs-eloquent'
import { Schema } from 'mongoose'
import * as Crypto from 'crypto'

export const GenericUserBase: EloquentMongooseSpec<IGenericUser, GenericUser> = Eloquent.Mongoose<
  IGenericUser,
  GenericUser
>()
export class GenericUser extends GenericUserBase implements IAuthenticatable {
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

  set password(password: string) {
    this.attributes['password'] = this.hashPassword(password)
  }

  get password_salt(): string {
    if (!this.attributes['password_salt']) {
      this.attributes['password_salt'] = Crypto.randomBytes(24).toString('base64')
    }
    return this.attributes['password_salt']
  }

  protected hashPassword(password: string) {
    const hash: Crypto.Hmac = Crypto.createHmac('sha512', this.password_salt)
    hash.update(password)
    return hash.digest('base64')
  }

  protected cleanSecretAttribute(value: Object) {
    delete value['remember_token']
    delete value['password']
    delete value['password_salt']
    return value
  }

  toObject() {
    return this.cleanSecretAttribute(super.toObject())
  }

  toJson() {
    return this.cleanSecretAttribute(super.toJson())
  }

  // -------------------------------------------------------------------------------------------------------------------

  getAuthIdentifierName(): string {
    return 'id'
  }

  getAuthIdentifier(): any {
    return this.id
  }

  getAuthPassword(password?: string): string {
    if (password) {
      return this.hashPassword(password)
    }
    return this.attributes['password']
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
}
register(GenericUser)
