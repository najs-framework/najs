import { IGuard } from './IGuard'

export interface IAuth extends IGuard {
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
