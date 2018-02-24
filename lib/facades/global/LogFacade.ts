import '../../../lib/log/WinstonLogger'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { ILogger } from '../../../lib/log/ILogger'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<ILogger>(<any>Najs, 'log', function() {
  return make<ILogger>(GlobalFacadeClass.Log)
})

export const Log: ILogger & IFacadeBase = facade
export const LogFacade: ILogger & IFacade = facade
