/// <reference path="../../contracts/RouteFactory.ts" />

import '../../http/routing/RouteFactory'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClass } from '../../constants'

const facade = Facade.create<Najs.Contracts.RouteFactory>(<any>Najs, 'route', function() {
  return make<Najs.Contracts.RouteFactory>(NajsClass.Http.RouteFactory)
})

export const Route: Najs.Contracts.RouteFactory & IFacadeBase = facade
export const RouteFacade: Najs.Contracts.RouteFactory & IFacade = facade
