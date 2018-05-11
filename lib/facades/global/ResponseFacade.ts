/// <reference path="../../contracts/ResponseFactory.ts" />

import '../../../lib/http/response/ResponseFactory'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../../constants'

const facade = Facade.create<Najs.Contracts.ResponseFactory>(<any>Najs, 'response', function() {
  return make<Najs.Contracts.ResponseFactory>(NajsClasses.Http.ResponseFactory)
})

export const Response: Najs.Contracts.ResponseFactory & IFacadeBase = facade
export const ResponseFacade: Najs.Contracts.ResponseFactory & IFacade = facade
