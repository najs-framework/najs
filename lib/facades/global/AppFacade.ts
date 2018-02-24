import '../../../lib/core/Application'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { IApplication } from '../../../lib/core/IApplication'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<IApplication>(<any>Najs, 'app', function() {
  return make<IApplication>(GlobalFacadeClass.Application)
})

export const App: IApplication & IFacadeBase = facade
export const AppFacade: IApplication & IFacade = facade
