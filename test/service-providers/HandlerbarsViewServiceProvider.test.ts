import 'jest'
import { Najs } from '../../lib/core/Najs'
import { AppFacade } from '../../lib/facades/global/AppFacade'
import { HandlebarsViewServiceProvider } from '../../lib/service-providers/HandlebarsViewServiceProvider'

describe('HandlebarsViewServiceProvider', function() {
  it('has getClassName with namespace Najs', function() {
    const serviceProvider = new HandlebarsViewServiceProvider(<any>{})
    expect(serviceProvider.getClassName()).toEqual(HandlebarsViewServiceProvider.className)
  })

  describe('.register()', function() {
    it('binds ExpressHttpDriver class as default HttpDriver', async function() {
      const spy = AppFacade.spy('bind')
      const serviceProvider = new HandlebarsViewServiceProvider(Najs['app'])
      await serviceProvider.register()
      expect(spy.calledWith('Najs.Http.Response.ViewResponse', 'Najs.Http.Response.HandlebarsViewResponse')).toBe(true)
      AppFacade.restoreFacade()
    })
  })

  describe('static .withHandlebarsHelpers', function() {
    it('returns typeof HandlebarsViewServiceProvider', function() {
      expect(HandlebarsViewServiceProvider.withHandlebarsHelpers() === HandlebarsViewServiceProvider).toBe(true)
    })

    it('fattens params and pass to "handlebars-helpers" package', function() {
      HandlebarsViewServiceProvider.withHandlebarsHelpers(['array', 'code'])
    })
  })
})
