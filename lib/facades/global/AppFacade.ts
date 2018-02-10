import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { IApplication } from '../../../lib/core/IApplication'
import { Application } from '../../../lib/core/Application'
import { Najs } from '../../../lib/core/Najs'

export const AppFacade: IApplication & IFacade = Facade.create<IApplication>(Najs, 'app', function() {
  return new Application()
})
