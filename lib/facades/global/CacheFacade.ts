/// <reference path="../../contracts/Cache.ts" />

import '../../../lib/cache/RedisCache'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../../constants'

const facade = Facade.create<Najs.Contracts.Cache>(<any>Najs, 'cache', function() {
  return make<Najs.Contracts.Cache>(NajsClasses.Cache.RedisCache)
})

export const Cache: Najs.Contracts.Cache & IFacadeBase = facade
export const CacheFacade: Najs.Contracts.Cache & IFacade = facade
