import 'jest'
import '../../../lib/auth/guards/SessionGuard'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { Facade, FacadeContainer } from 'najs-facade'
import { Auth } from '../../../lib/facades/contextual/AuthContextualFacade'
import { ConfigFacade } from '../../../lib/facades/global/ConfigFacade'
import { ContextualFacadeClass } from '../../../lib/constants'

describe('AuthContextualFacade', function() {
  it('is created only one time if context has no "auth" property', function() {
    class TestProvider {
      static className = 'TestProvider'
    }
    NajsBinding.register(TestProvider)

    const getStub = Facade(ConfigFacade).createStub('get')
    getStub.returns({
      web: {
        driver: 'Najs.SessionGuard',
        provider: 'TestProvider',
        isDefault: true
      }
    })

    const request = {
      method: 'GET'
    }
    const context = { request: request }
    const makeSpy = Sinon.spy(NajsBinding, 'make')

    Auth.of(<any>context)
    expect(context['auth'] === Auth.of(<any>context)).toBe(true)
    expect(context['auth'] === Auth.of(<any>context)).toBe(true)
    expect(makeSpy.calledWith(ContextualFacadeClass.Auth)).toBe(true)
    FacadeContainer.verifyAndRestoreAllFacades()
  })
})
