import '../../../lib/cache/RedisCache'
import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { ICache } from '../../../lib/cache/ICache'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

export const CacheFacade: ICache & IFacade = Facade.create<ICache>(Najs, 'cache', function() {
  return make<ICache>(GlobalFacade.Cache)
})
