import '../../../lib/core/Application'
import { Facade } from '../Facade'
import { IFacade, IFacadeBase } from '../interfaces/IFacadeGrammar'
import { IApplication } from '../../../lib/core/IApplication'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<IApplication>(<any>Najs, 'app', function() {
  return make<IApplication>(GlobalFacadeClass.Application)
})

export const App: IApplication & IFacadeBase = facade
export const AppFacade: IApplication & IFacade = facade
