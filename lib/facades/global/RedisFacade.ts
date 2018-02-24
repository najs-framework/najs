import '../../../lib/redis/RedisClient'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { IRedis } from '../../../lib/redis/IRedis'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<IRedis>(<any>Najs, 'redis', function() {
  return make<IRedis>(GlobalFacadeClass.Redis)
})

export const Redis: IRedis & IFacadeBase = facade
export const RedisFacade: IRedis & IFacade = facade
