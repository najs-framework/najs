import 'jest'
import { Najs } from '../../lib/core/Najs'
import { AppFacade } from '../../lib/facades/global/AppFacade'
import { ExpressHttpDriverServiceProvider } from '../../lib/service-providers/ExpressHttpDriverServiceProvider'
import { SystemClass } from '../../lib/constants'
import { ExpressHttpDriver } from '../../lib/http/driver/ExpressHttpDriver'

describe('ExpressHttpDriverServiceProvider', function() {
  it('has getClassName with namespace Najs', function() {
    const serviceProvider = new ExpressHttpDriverServiceProvider(<any>{})
    expect(serviceProvider.getClassName()).toEqual(ExpressHttpDriverServiceProvider.className)
  })

  describe('.register()', function() {
    it('binds ExpressHttpDriver class as default HttpDriver', async function() {
      const spy = AppFacade.spy('bind')
      const serviceProvider = new ExpressHttpDriverServiceProvider(Najs['app'])
      await serviceProvider.register()
      expect(spy.calledWith(SystemClass.HttpDriver, ExpressHttpDriver.className)).toBe(true)
      AppFacade.restoreFacade()
    })
  })
})
