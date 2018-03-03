import { IGuard } from '../interfaces/IGuard'
import { IUserProvider } from '../interfaces/IUserProvider'
import { IAuthenticatable } from '../interfaces/IAuthenticatable'
import { Controller } from '../../http/controller/Controller'

export abstract class Guard implements IGuard {
  protected controller: Controller
  protected provider: IUserProvider

  // The constructor must be in string literal otherwise typescript don't understand the constructor
  // prettier-ignore
  "constructor"(controller: Controller, provider: IUserProvider) {
    this.controller = controller
    this.provider = provider
  }

  /**
   * Get user provider.
   */
  getUserProvider(): IUserProvider {
    return this.provider
  }

  /**
   * Determine if there is a user in request.
   */
  abstract hasUser(): boolean
  /**
   * Determine if there is a user in request.
   */
  abstract hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean

  /**
   * Get the currently authenticated user.
   */
  abstract retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined>

  /**
   * Save the user to request.
   *
   * @param {IAuthenticatable} user
   * @param {boolean} remember
   */
  abstract attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void>

  /**
   * Remove the user and out of request.
   *
   * @param {IAuthenticatable} user
   */
  abstract detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void>
}
