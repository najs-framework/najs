import '../../../lib/redis/RedisClient'
import { Facade } from '../Facade'
import { IFacade, IFacadeBase } from '../interfaces/IFacadeGrammar'
import { IRedis } from '../../../lib/redis/IRedis'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<IRedis>(<any>Najs, 'redis', function() {
  return make<IRedis>(GlobalFacadeClass.Redis)
})

export const Redis: IRedis & IFacadeBase = facade
export const RedisFacade: IRedis & IFacade = facade
