import '../view/handlebars/HandlebarsViewResponse'
import { ResponseTypeClass } from '../constants'
import { ServiceProvider } from '../core/ServiceProvider'
import * as Handlebars from 'handlebars'
import { flatten } from 'lodash'
const HelperLoader = require('handlebars-helpers')

export class HandlebarsViewServiceProvider extends ServiceProvider {
  static className: string = 'Najs.HandlebarsViewServiceProvider'

  getClassName() {
    return HandlebarsViewServiceProvider.className
  }

  async register() {
    this.app.bind(ResponseTypeClass.View, ResponseTypeClass.HandlebarsView)
  }

  /**
   * Load handlebars helpers by package name, please checkout full helpers and package name in
   * https://github.com/helpers/handlebars-helpers
   *
   * @param {string} packageName the package name
   */
  static withHandlebarsHelpers(packageName: string): typeof HandlebarsViewServiceProvider
  /**
   * Load handlebars helpers by package name, please checkout full helpers and package name in
   * https://github.com/helpers/handlebars-helpers
   *
   * @param {string[]} packages the package name
   */
  static withHandlebarsHelpers(packages: string[]): typeof HandlebarsViewServiceProvider
  /**
   * Load handlebars helpers by package name, please checkout full helpers and package name in
   * https://github.com/helpers/handlebars-helpers
   *
   * @param {string[]|string} packageName the package name
   */
  static withHandlebarsHelpers(...packageName: Array<string | string[]>): typeof HandlebarsViewServiceProvider
  static withHandlebarsHelpers(...args: Array<string | string[]>): typeof HandlebarsViewServiceProvider {
    const packages = flatten(args)
    if (packages.length === 0) {
      // load all helpers
      Handlebars.registerHelper(HelperLoader())
    } else {
      // load helpers defined in packages
      Handlebars.registerHelper(HelperLoader(packages))
    }
    return this
  }
}
