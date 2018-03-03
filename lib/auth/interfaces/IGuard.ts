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
  new (controller: Controller, provider: IUserProvider): void

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

// hasUser(user): boolean
// async retrieveUser()
// async attachUser()
// async detachUser()
// async validate()

// async Auth.login(user): login as a user => calls Guard.attachUser()
// async Auth.logout(): logout user => calls Guard.detachUser() if current user is logged in via guard
// async Auth.attempt(): calls Guard.validate() and if login call Guard.attach()
// async Auth.validate(): calls Guard.validate()
// Auth.check(): check
// Auth.user(): get current user, an alias of .getUser()
// Auth.guest():
// Auth.id(): get current user's id
// Auth.setUser(): set current user only, do not call Guard.remember()
// Auth.getUser(): get current user
