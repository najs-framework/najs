import '../../../lib/http/routing/RouteFactory'
import { Facade } from '../Facade'
import { IFacade, IFacadeBase } from '../interfaces/IFacadeGrammar'
import { IRouteFactory } from '../../../lib/http/routing/interfaces/IRouteFactory'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<IRouteFactory>(<any>Najs, 'route', function() {
  return make<IRouteFactory>(GlobalFacadeClass.Route)
})

export const Route: IRouteFactory & IFacadeBase = facade
export const RouteFacade: IRouteFactory & IFacade = facade
