import { SystemClass } from '../constants'
import { ServiceProvider } from '../core/ServiceProvider'
import { ExpressHttpDriver } from '../http/driver/ExpressHttpDriver'

export class ExpressHttpDriverServiceProvider extends ServiceProvider {
  static className: string = 'Najs.ExpressHttpDriverServiceProvider'

  getClassName() {
    return ExpressHttpDriverServiceProvider.className
  }

  async register() {
    this.app.bind(SystemClass.HttpDriver, ExpressHttpDriver.className)
  }
}
