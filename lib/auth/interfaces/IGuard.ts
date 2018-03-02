import { IAuthenticatable } from './IAuthenticatable'

export interface IGuard {
  /**
   * Determine if the current user is authenticated.
   */
  check(): boolean

  /**
   * Determine if the current user is a guest.
   */
  guest(): boolean

  /**
   * Get the currently authenticated user.
   */
  user<T extends IAuthenticatable = IAuthenticatable>(): T | undefined

  /**
   * Get the ID for the currently authenticated user.
   */
  id<T extends any = string>(): T | undefined

  /**
   * Validate a user's credentials.
   *
   * @param {Object} credentials
   */
  validate(credentials: Object): Promise<boolean>

  /**
   * Set the current user.
   *
   * @param {IAuthenticatable} user
   */
  setUser<T extends IAuthenticatable = IAuthenticatable>(user: T): void
}
