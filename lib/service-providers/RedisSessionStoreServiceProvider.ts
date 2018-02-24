import { ServiceProvider } from '../core/ServiceProvider'
// import * as RedisStore from 'connect-redis'

export class RedisSessionStoreServiceProvider extends ServiceProvider {
  static className: string = 'Najs.RedisSessionStoreServiceProvider'

  getClassName() {
    return RedisSessionStoreServiceProvider.className
  }

  async register() {
    // this.app.s
  }
}
