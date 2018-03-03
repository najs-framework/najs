import { IAuthenticatable } from './IAuthenticatable'
import { IUserProvider } from './IUserProvider'
import { Controller } from '../../http/controller/Controller'

export type GuardConfiguration = {
  driver: string
  provider: string
  isDefault?: boolean
}

export interface IGuard {
  /**
   * Create new instance of IGuard
   */
  constructor(controller: Controller, provider: IUserProvider): any

  /**
   * Get user provider.
   */
  getUserProvider(): IUserProvider

  /**
   * Determine if there is a user in request.
   */
  hasUser(): boolean
  /**
   * Determine if there is a user in request.
   */
  hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean

  /**
   * Get the currently authenticated user.
   */
  retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined>

  /**
   * Save the user to request.
   *
   * @param {IAuthenticatable} user
   * @param {boolean} remember
   */
  attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void>

  /**
   * Remove the user and out of request.
   *
   * @param {IAuthenticatable} user
   */
  detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void>
}
