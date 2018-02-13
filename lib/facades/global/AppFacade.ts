import '../../../lib/core/Application'
import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { IApplication } from '../../../lib/core/IApplication'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

export const AppFacade: IApplication & IFacade = Facade.create<IApplication>(<any>Najs, 'app', function() {
  return make<IApplication>(GlobalFacade.Application)
})
