import { IGuard } from './IGuard'
import { IAuthenticatable } from './IAuthenticatable'

export interface IAuth {
  /**
   * Get current guard instance
   */
  getCurrentGuard(): IGuard

  /**
   * Get a guard instance by name.
   *
   * @param {string} guard
   */
  guard(name: string): IAuth

  /**
   * Login by user
   *
   * @param {IAuthenticatable} user
   */
  login<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void>
  /**
   * Login by user
   *
   * @param {IAuthenticatable} user
   */
  login<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void>

  /**
   * Logout current user
   */
  logout(): Promise<void>

  /**
   * Login by user's credentials
   *
   * @param {Object} credentials
   */
  attempt(credentials: Object, remember: boolean): Promise<boolean>

  /**
   * Validate a user's credentials.
   *
   * @param {Object} credentials
   */
  validate(credentials: Object): Promise<boolean>

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
   * Set the authenticated user.
   */
  setUser<T extends IAuthenticatable = IAuthenticatable>(user: T): void

  /**
   * Get the currently authenticated user.
   */
  getUser<T extends IAuthenticatable = IAuthenticatable>(): T | undefined
}
