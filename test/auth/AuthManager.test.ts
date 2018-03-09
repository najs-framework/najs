import 'jest'
import '../../lib/auth/guards/SessionGuard'
import '../../lib/auth/GenericUser'
import * as Sinon from 'sinon'
import { ContextualFacade, Facade, FacadeContainer } from 'najs-facade'
import { AuthEvent } from '../../lib/constants'
import { SessionGuard } from '../../lib/auth/guards/SessionGuard'
import { AuthManager } from '../../lib/auth/AuthManager'
import { ContextualFacadeClass } from '../../lib/constants'
import { EventFacade } from '../../lib/facades/global/EventFacade'
import { register } from 'najs-binding'
import { IMongooseProvider } from 'najs-eloquent'
import { Schema, Document, model } from 'mongoose'
const mongoose = require('mongoose')

class MongooseProvider implements IMongooseProvider {
  static className: string = 'MongooseProvider'

  getClassName() {
    return MongooseProvider.className
  }

  getMongooseInstance() {
    return mongoose
  }

  createModelFromSchema<T extends Document>(modelName: string, schema: Schema) {
    return model<T>(modelName, schema)
  }
}
register(MongooseProvider)

describe('AuthManager', function() {
  it('extends from ContextualFacade', function() {
    const authManager = new AuthManager(<any>{})
    expect(authManager).toBeInstanceOf(ContextualFacade)
  })

  it('implements IAutoload', function() {
    const authManager = new AuthManager(<any>{})
    expect(authManager.getClassName()).toEqual(ContextualFacadeClass.Auth)
  })

  describe('constructor()', function() {
    it('gets guard configurations and load guard when constructed', function() {
      const guardSpy = Sinon.spy(AuthManager.prototype, 'guard')
      const findDefaultGuardNameSpy = Sinon.spy(AuthManager.prototype, 'findDefaultGuardName')

      new AuthManager(<any>{})
      expect(findDefaultGuardNameSpy.called).toBe(true)
      expect(guardSpy.called).toBe(true)

      findDefaultGuardNameSpy.restore()
      guardSpy.restore()
    })
  })

  describe('.findDefaultGuardName()', function() {
    it('loops all configuration and returns the one which has isDefault=true', function() {
      const authManager = new AuthManager(<any>{})
      authManager['configurations'] = {
        test: {
          driver: 'Najs.SessionGuard',
          provider: 'Najs.GenericUser'
        },
        default: {
          driver: 'Najs.SessionGuard',
          provider: 'Najs.GenericUser',
          isDefault: true
        }
      }

      expect(authManager.findDefaultGuardName()).toEqual('default')
    })

    it('return the first one if no guard settings has isDefault', function() {
      const authManager = new AuthManager(<any>{})
      authManager['configurations'] = {
        test: {
          driver: 'Najs.SessionGuard',
          provider: 'Najs.GenericUser'
        },
        default: {
          driver: 'Najs.SessionGuard',
          provider: 'Najs.GenericUser'
        }
      }

      expect(authManager.findDefaultGuardName()).toEqual('test')
    })
  })

  describe('.resolveGuard()', function() {
    it('auto switches to defaultGuardName if the name not in configuration', function() {
      const authManager = new AuthManager(<any>{})
      expect(authManager.resolveGuard('not-found')).toBeInstanceOf(SessionGuard)
    })

    it('resolves Guard by make, the provider also resolved', function() {
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

      const controller = {}
      const authManager = new AuthManager(<any>controller)
      authManager['configurations'] = {
        test: {
          driver: TestGuard.className,
          provider: TestProvider.className
        }
      }
      const instance: any = authManager.resolveGuard('test')
      expect(instance).toBeInstanceOf(TestGuard)
      expect(instance['controller'] === controller).toBe(true)
      expect(instance['provider']).toBeInstanceOf(TestProvider)
    })
  })

  describe('.guard()', function() {
    it('is chain-able', function() {
      const authManager = new AuthManager(<any>{})
      expect(authManager.guard('web') === authManager).toBe(true)
    })

    it('just assigns currentGuard if the name already in guardBag (cached)', function() {
      const authManager = new AuthManager(<any>{})
      const guard = {}
      authManager['guardBag']['test'] = <any>guard
      authManager.guard('test')
      expect(authManager.getCurrentGuard() === guard).toBe(true)
    })

    it('calls .resolveGuard() and assign to currentGuard if has result', function() {
      const authManager = new AuthManager(<any>{})
      const guard = {}
      const resolveGuardStub = Sinon.stub(authManager, 'resolveGuard')
      resolveGuardStub.returns(guard)
      authManager.guard('test')
      expect(authManager['guardBag']['test'] === guard).toBe(true)
      expect(authManager.getCurrentGuard() === guard).toBe(true)
    })

    it('it does nothing if the .resolveGuard() returns no result', function() {
      const authManager = new AuthManager(<any>{})
      const guard = {}
      authManager['guardBag']['test'] = <any>guard
      authManager.guard('test')
      const resolveGuardStub = Sinon.stub(authManager, 'resolveGuard')
      resolveGuardStub.returns(undefined)
      authManager.guard('default')
      expect(authManager.getCurrentGuard() === guard).toBe(true)
    })
  })

  describe('.getCurrentGuard()', function() {
    it('simple returns "currentGuard" member', function() {
      const authManager = new AuthManager(<any>{})
      expect(authManager.getCurrentGuard() === authManager['currentGuard']).toBe(true)
    })
  })

  describe('.login()', function() {
    it('triggers event Login, case 1', function() {
      const user = {}
      const guard = {
        attachUser() {}
      }
      Facade(EventFacade)
        .shouldReceive('emit')
        .withArgs(AuthEvent.Login, user, true)

      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard
      authManager.login(<any>user, true)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('triggers event Login, case 2', function() {
      const user = {}
      const guard = {
        attachUser() {}
      }
      Facade(EventFacade)
        .shouldReceive('emit')
        .withArgs(AuthEvent.Login, user, false)

      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard
      authManager.login(<any>user)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('calls guard.attachUser() then call .setUser()', async function() {
      const user = {}
      const guard = {
        attachUser() {}
      }

      const authManager = new AuthManager(<any>{})
      const setUserSpy = Sinon.spy(authManager, 'setUser')
      const attachUserSpy = Sinon.spy(guard, 'attachUser')
      authManager['currentGuard'] = <any>guard

      await authManager.login(<any>user, true)
      expect(setUserSpy.calledWith(user)).toBe(true)
      expect(attachUserSpy.calledWith(user, true)).toBe(true)

      await authManager.login(<any>user, false)
      expect(setUserSpy.calledWith(user)).toBe(true)
      expect(attachUserSpy.calledWith(user, false)).toBe(true)
    })
  })

  describe('.logout()', function() {
    it('triggers event Logout', function() {
      const user = {}
      Facade(EventFacade)
        .shouldReceive('emit')
        .withArgs(AuthEvent.Logout, user)

      const authManager = new AuthManager(<any>{})
      authManager['currentUser'] = <any>user
      authManager['loggedOut'] = true
      authManager.logout()
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('does nothing if loggedOut is true', function() {
      const guard = {
        hasUser() {},
        detachUser() {}
      }
      const detachUserSpy = Sinon.spy(guard, 'detachUser')
      const hasUserSpy = Sinon.spy(guard, 'hasUser')

      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard
      authManager['loggedOut'] = true
      authManager.logout()
      expect(detachUserSpy.called).toBe(false)
      expect(hasUserSpy.called).toBe(false)
    })

    it('does nothing if currentUser is undefined', function() {
      const guard = {
        hasUser() {},
        detachUser() {}
      }
      const detachUserSpy = Sinon.spy(guard, 'detachUser')
      const hasUserSpy = Sinon.spy(guard, 'hasUser')

      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard
      authManager['currentUser'] = <any>undefined
      authManager['loggedOut'] = false
      authManager.logout()
      expect(detachUserSpy.called).toBe(false)
      expect(hasUserSpy.called).toBe(false)
    })

    it('assigns currentUser to undefined, loggedOut = true, call guard.detachUser() depends on if guard.hasUser()', function() {
      const guard = {
        hasUser() {},
        detachUser() {}
      }
      const detachUserSpy = Sinon.spy(guard, 'detachUser')
      const hasUserStub = Sinon.stub(guard, 'hasUser')

      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard
      authManager['currentUser'] = <any>{}
      authManager['loggedOut'] = false
      hasUserStub.returns(false)
      authManager.logout()

      expect(detachUserSpy.called).toBe(false)
      expect(hasUserStub.called).toBe(true)
      expect(authManager['currentUser']).toBeUndefined()
      expect(authManager['loggedOut']).toEqual(true)

      authManager['currentGuard'] = <any>guard
      authManager['currentUser'] = <any>{}
      authManager['loggedOut'] = false
      hasUserStub.returns(true)
      authManager.logout()

      expect(detachUserSpy.called).toBe(true)
      expect(hasUserStub.called).toBe(true)
      expect(authManager['currentUser']).toBeUndefined()
      expect(authManager['loggedOut']).toEqual(true)
    })
  })

  describe('.attempt()', function() {
    it('triggers event Attempt', function() {
      const guard = {
        getUserProvider() {
          return {
            retrieveByCredentials() {
              return undefined
            }
          }
        }
      }
      const credentials = {}
      Facade(EventFacade)
        .shouldReceive('emit')
        .withArgs(AuthEvent.Attempt, credentials, false, true)

      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard
      authManager.attempt(credentials)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('calls guard.getUserProvider().retrieveByCredentials(), returns false if the result is not found', async function() {
      const guard = {
        getUserProvider() {
          return {
            retrieveByCredentials() {
              return undefined
            }
          }
        }
      }
      const credentials = {}
      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard
      expect(await authManager.attempt(credentials, true, false)).toEqual(false)
    })

    it('returns false is .retrieveByCredentials() returns user but .validateCredentials() returns false', async function() {
      const guard = {
        getUserProvider() {
          return {
            retrieveByCredentials() {
              return {}
            },
            validateCredentials() {
              return false
            }
          }
        }
      }
      const credentials = {}
      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard
      expect(await authManager.attempt(credentials, true, false)).toEqual(false)
    })

    it('returns true is .retrieveByCredentials() returns an user and .validateCredentials() returns true', async function() {
      const guard = {
        getUserProvider() {
          return {
            retrieveByCredentials() {
              return {}
            },
            validateCredentials() {
              return true
            }
          }
        }
      }
      const credentials = {}
      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard
      expect(await authManager.attempt(credentials, true, false)).toEqual(true)
    })

    it('calls .login() if the login param is true', async function() {
      const user = {}
      const guard = {
        getUserProvider() {
          return {
            retrieveByCredentials() {
              return user
            },
            validateCredentials() {
              return true
            }
          }
        }
      }
      const credentials = {}
      const authManager = new AuthManager(<any>{})
      authManager['currentGuard'] = <any>guard

      const loginStub = Sinon.stub(authManager, 'login')
      loginStub.callsFake(() => {})

      await authManager.attempt(credentials, true, false)
      expect(loginStub.calledWith(user, true)).toBe(false)

      await authManager.attempt(credentials, false, true)
      expect(loginStub.calledWith(user, false)).toBe(true)
    })
  })

  describe('.validate()', function() {
    it('simply calls .attempt() with remember = false and login = false', function() {
      const attemptStub = Sinon.stub(AuthManager.prototype, 'attempt')
      attemptStub.returns(Promise.resolve(true))
      attemptStub.callsFake(() => {})

      const credentials: Object = {}
      const authManager = new AuthManager(<any>{})
      authManager.validate(credentials)
      expect(attemptStub.calledWith(credentials, false, false)).toBe(true)

      attemptStub.restore()
    })
  })

  describe('.check()', function() {
    it('returns true if .getUser() returns truly value', function() {
      const authManager = new AuthManager(<any>{})
      const getUserStub = Sinon.stub(authManager, 'getUser')
      getUserStub.returns(undefined)
      expect(authManager.check()).toBe(false)
      getUserStub.returns(false)
      expect(authManager.check()).toBe(false)
      getUserStub.returns('')
      expect(authManager.check()).toBe(false)
      getUserStub.returns('id')
      expect(authManager.check()).toBe(true)
      getUserStub.returns(true)
      expect(authManager.check()).toBe(true)
      getUserStub.returns({})
      expect(authManager.check()).toBe(true)
    })
  })

  describe('.guest()', function() {
    it('returns !value of if .check()', function() {
      const authManager = new AuthManager(<any>{})
      const checkStub = Sinon.stub(authManager, 'check')
      checkStub.returns(true)
      expect(authManager.guest()).toBe(false)
      checkStub.returns(false)
      expect(authManager.guest()).toBe(true)
    })
  })

  describe('.user()', function() {
    it('is an alias of .getUser()', function() {
      const authManager = new AuthManager(<any>{})
      const getUserSpy = Sinon.spy(authManager, 'getUser')
      authManager.user()
      expect(getUserSpy.called).toBe(true)
    })
  })

  describe('.id()', function() {
    it('returns undefined if loggedOut is true', function() {
      const authManager = new AuthManager(<any>{})
      authManager['loggedOut'] = true
      const user = {
        getAuthIdentifier() {
          return 'test'
        }
      }
      authManager['currentUser'] = <any>user
      expect(authManager.id()).toBeUndefined()
    })

    it('returns undefined if loggedOut is false but currentUser is not found', function() {
      const authManager = new AuthManager(<any>{})
      authManager['loggedOut'] = true
      authManager['currentUser'] = undefined
      expect(authManager.id()).toBeUndefined()
    })

    it('returns "currentUser.getAuthIdentifier()"', function() {
      const authManager = new AuthManager(<any>{})
      authManager['loggedOut'] = false
      const user = {
        getAuthIdentifier() {
          return 'test'
        }
      }
      authManager['currentUser'] = <any>user
      expect(authManager.id()).toEqual('test')
    })
  })

  describe('.getUser()', function() {
    it('always returns undefined if loggedOut is true', function() {
      const authManager = new AuthManager(<any>{})
      authManager['loggedOut'] = true
      const user = {}
      authManager['currentUser'] = <any>user
      expect(authManager.getUser()).toBeUndefined()
    })

    it('returns "currentUser" member if loggedOut is false', function() {
      const authManager = new AuthManager(<any>{})
      authManager['loggedOut'] = false
      const user = {}
      authManager['currentUser'] = <any>user
      expect(authManager.getUser() === user).toBe(true)
    })
  })

  describe('.setUser()', function() {
    it('assigns user to "currentUser" and set loggedOut to false', function() {
      const authManager = new AuthManager(<any>{})
      authManager['loggedOut'] = true
      const user = {}
      authManager.setUser(<any>user)
      expect(authManager['currentUser'] === user).toBe(true)
      expect(authManager['loggedOut']).toBe(false)
    })
  })
})
