import 'jest'
import { RedisCache } from '../../lib/cache/RedisCache'
import { CacheClass } from './../../lib/constants'
import { CacheFacade as Cache, reload } from '../../lib/cache/CacheFacade'
import { register } from '../../lib/core/register'

describe('Log', function() {
  it('implements ICache and registers to CacheClass by default', function() {
    expect(Cache).toBeInstanceOf(RedisCache)
  })

  it('.reload() can be used to reload the new instance of Cache after binding', function() {
    class Custom {
      static className: string = 'Custom'
    }
    register(Custom, CacheClass)
    expect(Cache).toBeInstanceOf(RedisCache)
    reload()
    expect(Cache).toBeInstanceOf(Custom)
  })
})
