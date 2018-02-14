import '../../../lib/log/WinstonLogger'
import { Facade } from '../Facade'
import { IFacade, IFacadeBase } from '../interfaces/IFacadeGrammar'
import { ILogger } from '../../../lib/log/ILogger'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

const facade = Facade.create<ILogger>(<any>Najs, 'log', function() {
  return make<ILogger>(GlobalFacade.Log)
})

export const Log: ILogger & IFacadeBase = facade
export const LogFacade: ILogger & IFacade = facade
