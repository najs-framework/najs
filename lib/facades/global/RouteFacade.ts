import '../../../lib/http/routing/RouteFactory'
import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { IRouteFactory } from '../../../lib/http/routing/interfaces/IRouteFactory'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

export const RouteFacade: IRouteFactory & IFacade = Facade.create<IRouteFactory>(Najs, 'route', function() {
  return make<IRouteFactory>(GlobalFacade.Route)
})
