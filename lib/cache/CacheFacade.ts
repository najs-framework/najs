import { make } from '../core/make'
import { ICache } from './ICache'
import { NajsFacade } from '../core/NajsFacade'
import { ConfigurationKeys, CacheClass } from '../constants'

export let CacheFacade: ICache = make<ICache>(NajsFacade.getConfig(ConfigurationKeys.Cache.engine, CacheClass))
export function reload(): ICache {
  CacheFacade = make<ICache>(CacheClass)
  return CacheFacade
}
