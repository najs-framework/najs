/// <reference path="../../contracts/Redis.ts" />

import '../../../lib/redis/RedisClient'

import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../../constants'
import * as NodeRedis from 'redis'

const facade = Facade.create<Najs.Contracts.Redis<NodeRedis.RedisClient>>(<any>Najs, 'redis', function() {
  return make<Najs.Contracts.Redis<NodeRedis.RedisClient>>(NajsClasses.Redis.RedisClient)
})

export const Redis: Najs.Contracts.Redis<NodeRedis.RedisClient> & IFacadeBase = facade
export const RedisFacade: Najs.Contracts.Redis<NodeRedis.RedisClient> & IFacade = facade
