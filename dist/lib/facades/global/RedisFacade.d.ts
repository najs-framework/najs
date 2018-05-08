/// <reference path="../../contracts/Redis.d.ts" />
import '../../../lib/redis/RedisClient';
import { IFacade, IFacadeBase } from 'najs-facade';
import * as NodeRedis from 'redis';
export declare const Redis: Najs.Contracts.Redis<NodeRedis.RedisClient> & IFacadeBase;
export declare const RedisFacade: Najs.Contracts.Redis<NodeRedis.RedisClient> & IFacade;
