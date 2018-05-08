/// <reference path="../../contracts/Config.ts" />

import '../../config/Config'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../../constants'

const facade = Facade.create<Najs.Contracts.Config>(<any>Najs, 'config', function() {
  return make<Najs.Contracts.Config>(NajsClasses.Config)
})

export const Config: Najs.Contracts.Config & IFacadeBase = facade
export const ConfigFacade: Najs.Contracts.Config & IFacade = facade
