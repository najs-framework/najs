import '../../../lib/config/Config'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { IConfig } from '../../../lib/config/IConfig'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<IConfig>(<any>Najs, 'config', function() {
  return make<IConfig>(GlobalFacadeClass.Config)
})

export const Config: IConfig & IFacadeBase = facade
export const ConfigFacade: IConfig & IFacade = facade
