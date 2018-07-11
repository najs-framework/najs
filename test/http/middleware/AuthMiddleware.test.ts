import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import * as Middleware from '../../../lib/http/middleware/AuthMiddleware'
import { Facade, FacadeContainer } from 'najs-facade'
import { ConfigFacade } from '../../../lib/facades/global/ConfigFacade'
import { AuthManager } from '../../../lib/auth/AuthManager'

describe('AuthMiddleware', function() {
  it('is fit for najs-binding', function() {
    expect(Middleware.AuthMiddleware.className).toEqual('Najs.AuthMiddleware')
  })

  describe('.before()', function() {
    async function test_before_function(guardCalled: boolean) {
      class TestGuard {
        static className = 'TestGuard'
        controller: any
        provider: any

        constructor(controller: any, provider: any) {
          this.controller = controller
          this.provider = provider
        }
      }
      register(TestGuard)

      class TestProvider {
        static className = 'TestProvider'
      }
      register(TestProvider)

      const guardSpy = Sinon.spy(AuthManager.prototype, 'guard')
      const getStub = Facade(ConfigFacade).createStub('get')
      getStub.returns({
        web: {
          driver: 'TestGuard',
          provider: 'TestProvider',
          isDefault: true
        }
      })

      const middleware = new Middleware.AuthMiddleware(guardCalled ? 'test' : undefined)
      const request = {}
      const response = {}
      const controller = {}
      await middleware.before(<any>request, <any>response, <any>controller)
      expect(controller['auth']).toBeInstanceOf(AuthManager)
      expect(guardSpy.calledWith('test')).toBe(guardCalled)

      guardSpy.restore()
      FacadeContainer.verifyAndRestoreAllFacades()
    }

    it('simply create AuthContextualFacade for the given controller', function() {
      return test_before_function(false)
    })

    it('changes guard if provided by syntax "auth:web"', function() {
      return test_before_function(true)
    })
  })
})
