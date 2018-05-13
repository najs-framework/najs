/// <reference path="../../contracts/Application.ts" />

import '../../../lib/core/Application'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../../constants'

const facade = Facade.create<Najs.Contracts.Application>(<any>Najs, 'app', function() {
  return make<Najs.Contracts.Application>(NajsClasses.Application)
})

export const App: Najs.Contracts.Application & IFacadeBase = facade
export const AppFacade: Najs.Contracts.Application & IFacade = facade
