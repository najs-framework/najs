import 'jest'
import { ServiceProvider } from '../../lib'
import { isPromise } from '../../lib/private/isPromise'

describe('ServiceProvider', function() {
  describe('.register()', function() {
    it('is used to bind or register class with special name', function() {
      const service = Reflect.construct(ServiceProvider, [{}])
      expect(isPromise(service.register())).toBe(true)
    })
  })

  describe('.boot()', function() {
    it('is used to boot a service with special name', function() {
      const service = Reflect.construct(ServiceProvider, [{}])
      expect(isPromise(service.boot())).toBe(true)
    })
  })
})
