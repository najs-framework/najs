import 'jest'
import * as Sinon from 'sinon'
import { FacadeContainer } from 'najs-facade'
import { ConfigFacade } from '../../../lib/facades/global/ConfigFacade'
import { ConfigurationKeys } from '../../../lib/constants'
import { AuthClass } from '../../../lib/constants'
import { LoginController } from '../../../lib/auth/controller/LoginController'

describe('LoginController', function() {
  it('implements IAutoload', function() {
    const controller = new LoginController(<any>{ method: 'GET' }, <any>{})
    expect(controller.getClassName()).toEqual(AuthClass.LoginController)
  })

  describe('protected .getUrl()', function() {
    it('returns an url which in configuration by ConfigFacade', function() {
      ConfigFacade.shouldReceive('get').withArgs(ConfigurationKeys.Auth.url + '.loginSuccess')

      const controller = new LoginController(<any>{ method: 'GET' }, <any>{})
      controller['getUrl']('loginSuccess')

      FacadeContainer.verifyAndRestoreAllFacades()
    })
  })

  describe('.login()', function() {
    it('redirects to "loginSuccess" if current user already logged in', async function() {
      ConfigFacade.shouldReceive('get').withArgs(ConfigurationKeys.Auth.url + '.loginSuccess')
      const controller = new LoginController(<any>{ method: 'GET' }, <any>{})
      controller.auth = <any>{
        check() {
          return true
        }
      }
      await controller.login()
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('calls auth.attempt with credentials is input.all() and remember also from input', async function() {
      ConfigFacade.shouldReceive('get').withArgs(ConfigurationKeys.Auth.url + '.loginSuccess')
      const controller = new LoginController(<any>{ method: 'POST', body: { user: 'test', remember: true } }, <any>{})
      controller.auth = <any>{
        check() {
          return false
        },

        attempt() {
          return true
        }
      }
      const attemptSpy = Sinon.spy(controller.auth, 'attempt')
      await controller.login()
      expect(attemptSpy.calledWith({ user: 'test', remember: true }, true)).toBe(true)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('redirects to "loginFailure" if attempt returns false', async function() {
      ConfigFacade.shouldReceive('get').withArgs(ConfigurationKeys.Auth.url + '.loginFailure')
      const controller = new LoginController(<any>{ method: 'POST', body: { user: 'test', remember: true } }, <any>{})
      controller.auth = <any>{
        check() {
          return false
        },

        attempt() {
          return false
        }
      }
      await controller.login()
      FacadeContainer.verifyAndRestoreAllFacades()
    })
  })

  describe('.logout()', function() {
    it('always redirects to "logoutRedirect"', async function() {
      ConfigFacade.shouldReceive('get').withArgs(ConfigurationKeys.Auth.url + '.logoutRedirect')
      const controller = new LoginController(<any>{ method: 'GET' }, <any>{})
      controller.auth = <any>{
        check() {
          return false
        },
        logout() {}
      }
      const logoutSpy = Sinon.spy(controller.auth, 'logout')
      await controller.logout()
      expect(logoutSpy.called).toBe(false)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('calls auth.logout() then redirects to "logoutRedirect" if there is a user', async function() {
      ConfigFacade.shouldReceive('get').withArgs(ConfigurationKeys.Auth.url + '.logoutRedirect')
      const controller = new LoginController(<any>{ method: 'GET' }, <any>{})
      controller.auth = <any>{
        check() {
          return true
        },
        logout() {}
      }
      const logoutSpy = Sinon.spy(controller.auth, 'logout')
      await controller.logout()
      expect(logoutSpy.called).toBe(true)
      FacadeContainer.verifyAndRestoreAllFacades()
    })
  })
})
