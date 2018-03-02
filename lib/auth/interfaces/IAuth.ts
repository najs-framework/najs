import { IGuard } from './IGuard'

export interface IAuth extends IGuard {
  /**
   * Set the default guard the factory should serve.
   *
   * @param {string} guard
   */
  shouldUse(guard: string): IAuth
  /**
   * Set the default guard the factory should serve by class definition
   *
   * @param {Function} guard
   */
  shouldUse(guard: Function): IAuth

  /**
   * Get a guard instance by name.
   *
   * @param {string} guard
   */
  guard(name: string): IAuth
  /**
   * Get a guard instance by class definition.
   *
   * @param {Function} guard
   */
  guard(name: Function): IAuth
}
