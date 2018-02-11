import '../../../lib/log/WinstonLogger'
import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { ILogger } from '../../../lib/log/ILogger'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

export const LogFacade: ILogger & IFacade = Facade.create<ILogger>(Najs, 'log', function() {
  return make<ILogger>(GlobalFacade.Log)
})
