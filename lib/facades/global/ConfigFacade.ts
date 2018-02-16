import '../../../lib/config/Config'
import { Facade } from '../Facade'
import { IFacade, IFacadeBase } from '../interfaces/IFacadeGrammar'
import { IConfig } from '../../../lib/config/IConfig'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<IConfig>(<any>Najs, 'config', function() {
  return make<IConfig>(GlobalFacadeClass.Config)
})

export const Config: IConfig & IFacadeBase = facade
export const ConfigFacade: IConfig & IFacade = facade
