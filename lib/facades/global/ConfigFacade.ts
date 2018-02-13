import '../../../lib/config/Config'
import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { IConfig } from '../../../lib/config/IConfig'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

export const ConfigFacade: IConfig & IFacade = Facade.create<IConfig>(<any>Najs, 'config', function() {
  return make<IConfig>(GlobalFacade.Config)
})
