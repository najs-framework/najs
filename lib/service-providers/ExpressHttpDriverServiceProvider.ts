import { Najs } from '../constants'
import { ServiceProvider } from '../core/ServiceProvider'

export class ExpressHttpDriverServiceProvider extends ServiceProvider {
  static className: string = 'Najs.ExpressHttpDriverServiceProvider'

  getClassName() {
    return ExpressHttpDriverServiceProvider.className
  }

  async register() {
    this.app.bind(Najs.Http.HttpDriver, Najs.Http.ExpressHttpDriver)
  }
}
