import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { IConfig } from '../../../lib/config/IConfig'
import { Config } from '../../../lib/config/Config'
import { Najs } from '../../../lib/core/Najs'

export const ConfigFacade: IConfig & IFacade = Facade.create<IConfig>(Najs, 'config', function() {
  return new Config()
})
