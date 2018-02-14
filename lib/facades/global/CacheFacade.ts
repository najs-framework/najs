import '../../../lib/cache/RedisCache'
import { Facade } from '../Facade'
import { IFacade, IFacadeBase } from '../interfaces/IFacadeGrammar'
import { ICache } from '../../../lib/cache/ICache'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

const facade = Facade.create<ICache>(<any>Najs, 'cache', function() {
  return make<ICache>(GlobalFacade.Cache)
})

export const Cache: ICache & IFacadeBase = facade
export const CacheFacade: ICache & IFacade = facade
