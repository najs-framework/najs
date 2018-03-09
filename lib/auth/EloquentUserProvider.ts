import { register, make, IAutoload } from 'najs-binding'
import { GenericUser } from './GenericUser'
import { AuthClass } from './../constants'
import { IAuthenticatable } from './interfaces/IAuthenticatable'
import { IUserProvider } from './interfaces/IUserProvider'

export type EloquentQuery = {
  where(field: string, value: any): any
}

export class EloquentUserProvider implements IUserProvider, IAutoload {
  static className: string = AuthClass.EloquentUserProvider

  model: IAuthenticatable & EloquentQuery

  constructor() {
    this.model = make(this.getModelName())
  }

  getClassName() {
    return AuthClass.EloquentUserProvider
  }

  getModelName() {
    return GenericUser.className
  }

  getLoginName() {
    return 'email'
  }

  getPasswordName() {
    return 'password'
  }

  protected isValidCredentials(credentials: Object) {
    return !!credentials[this.getLoginName()] && !!credentials[this.getPasswordName()]
  }

  async retrieveById<T extends IAuthenticatable = IAuthenticatable>(identifier: any): Promise<T | undefined> {
    return this.model.where(this.model.getAuthIdentifierName(), identifier).first()
  }

  async retrieveByToken<T extends IAuthenticatable = IAuthenticatable>(
    identifier: any,
    token: string
  ): Promise<T | undefined> {
    return this.model
      .where(this.model.getAuthIdentifierName(), identifier)
      .where(this.model.getRememberTokenName(), token)
      .first()
  }

  async updateRememberToken<T extends IAuthenticatable = IAuthenticatable>(user: T, token: string): Promise<void> {
    this.model.where(user.getAuthIdentifierName(), user.getAuthIdentifier()).update({
      [user.getRememberTokenName()]: token
    })
  }

  async retrieveByCredentials<T extends IAuthenticatable = IAuthenticatable>(
    credentials: Object
  ): Promise<T | undefined> {
    if (this.isValidCredentials(credentials)) {
      return this.model.where(this.getLoginName(), credentials[this.getLoginName()]).first()
    }
    return undefined
  }

  async validateCredentials<T extends IAuthenticatable = IAuthenticatable>(
    user: T,
    credentials: Object
  ): Promise<boolean> {
    return user.getAuthPassword(credentials[this.getPasswordName()]) === user.getAuthPassword()
  }
}
register(EloquentUserProvider)
