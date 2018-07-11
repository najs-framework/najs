/// <reference path="../../contracts/Log.ts" />

import '../../log/WinstonLogger'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../../constants'

const facade = Facade.create<Najs.Contracts.Log>(<any>Najs, 'log', function() {
  return make<Najs.Contracts.Log>(NajsClasses.Log.WinstonLogger)
})

export const Log: Najs.Contracts.Log & IFacadeBase = facade
export const LogFacade: Najs.Contracts.Log & IFacade = facade
