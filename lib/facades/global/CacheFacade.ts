import '../../../lib/cache/RedisCache'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { ICache } from '../../../lib/cache/ICache'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<ICache>(<any>Najs, 'cache', function() {
  return make<ICache>(GlobalFacadeClass.Cache)
})

export const Cache: ICache & IFacadeBase = facade
export const CacheFacade: ICache & IFacade = facade
