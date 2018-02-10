import '../../../lib/core/Path'
import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { IPath } from '../../../lib/core/IPath'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

export const PathFacade: IPath & IFacade = Facade.create<IPath>(Najs, 'path', function() {
  return make<IPath>(GlobalFacade.Path)
})
