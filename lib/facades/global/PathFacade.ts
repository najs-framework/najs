import '../../../lib/core/Path'
import { Facade } from '../Facade'
import { IFacade, IFacadeBase } from '../interfaces/IFacadeGrammar'
import { IPath } from '../../../lib/core/IPath'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

const facade = Facade.create<IPath>(<any>Najs, 'path', function() {
  return make<IPath>(GlobalFacade.Path)
})

export const Path: IPath & IFacadeBase = facade
export const PathFacade: IPath & IFacade = facade
