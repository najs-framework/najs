import 'jest'
import * as Sinon from 'sinon'
import { AuthClass } from '../../lib/constants'
import { EloquentUserProvider } from '../../lib/auth/EloquentUserProvider'
import { GenericUser } from '../../lib/auth/GenericUser'

describe('EloquentUserProvider', function() {
  it('implements IAutoload', function() {
    const userProvider = new EloquentUserProvider()
    expect(userProvider.getClassName()).toEqual(AuthClass.EloquentUserProvider)
  })

  describe('constructor()', function() {
    it('makes model by using make() and the class name provided by .getModelName()', function() {
      const userProvider = new EloquentUserProvider()
      expect(userProvider.model).toBeInstanceOf(GenericUser)
    })
  })

  describe('.getModelName()', function() {
    it('returns GenericUser.className by default', function() {
      const userProvider = new EloquentUserProvider()
      expect(userProvider.getModelName()).toEqual(GenericUser.className)
    })
  })

  describe('.getLoginName()', function() {
    it('returns "email" literal string', function() {
      const userProvider = new EloquentUserProvider()
      expect(userProvider.getLoginName()).toEqual('email')
    })
  })

  describe('.getPasswordName()', function() {
    it('returns "password" literal string', function() {
      const userProvider = new EloquentUserProvider()
      expect(userProvider.getPasswordName()).toEqual('password')
    })
  })

  describe('protected .isValidCredentials()', function() {
    it('returns true if there is .getLoginName() and .getPasswordName() in credentials', function() {
      const userProvider = new EloquentUserProvider()
      expect(userProvider['isValidCredentials']({})).toBe(false)
      expect(userProvider['isValidCredentials']({ email: '' })).toBe(false)
      expect(userProvider['isValidCredentials']({ password: '' })).toBe(false)
      expect(userProvider['isValidCredentials']({ email: '', password: '' })).toBe(false)
      expect(userProvider['isValidCredentials']({ email: 'test', password: 'test' })).toBe(true)
    })
  })

  describe('.retrieveById()', function() {
    it('simply calls .where() with model.getAuthIdentifierName() then calls .first()', function() {
      const userProvider = new EloquentUserProvider()
      // TODO: update the test when Eloquent implemented Facade
      const getAuthIdentifierNameSpy = Sinon.spy(userProvider.model, 'getAuthIdentifierName')
      const whereSpy = Sinon.spy(userProvider.model, 'where')
      userProvider.retrieveById('000000000000000000000000')
      expect(whereSpy.calledWith('id', '000000000000000000000000')).toBe(true)
      expect(getAuthIdentifierNameSpy.called).toBe(true)
    })
  })

  describe('.retrieveByToken()', function() {
    it('simply calls .where() with model.getAuthIdentifierName() then calls .first()', function() {
      const userProvider = new EloquentUserProvider()
      // TODO: update the test when Eloquent implemented Facade
      userProvider.retrieveByToken('000000000000000000000000', 'test')
    })
  })

  describe('.updateRememberToken()', function() {
    it('simply calls .where() with model.getAuthIdentifierName() then calls .update()', function() {
      const userProvider = new EloquentUserProvider()
      // TODO: update the test when Eloquent implemented Facade
      userProvider.updateRememberToken(
        <any>{
          getRememberTokenName() {
            return 'remember_me'
          },
          getAuthIdentifierName() {
            return 'id'
          },
          getAuthIdentifier() {
            return '000000000000000000000000'
          }
        },
        'test'
      )
    })
  })

  describe('.retrieveByCredentials()', function() {
    it('returns undefined if the credentials is invalid', async function() {
      const userProvider = new EloquentUserProvider()
      expect(await userProvider.retrieveByCredentials({})).toBeUndefined()
    })

    it('simply calls .where() with model.getAuthIdentifierName() then calls .first()', async function() {
      const userProvider = new EloquentUserProvider()
      // TODO: update the test when Eloquent implemented Facade
      const whereSpy = Sinon.spy(userProvider.model, 'where')
      userProvider.retrieveByCredentials({ email: 'test', password: 'test' })
      expect(whereSpy.calledWith('email', 'test')).toBe(true)
    })
  })

  describe('.validateCredentials()', function() {
    it('returns true if the password in user and hashed password in credentials is equal', async function() {
      const userProvider = new EloquentUserProvider()
      const user = new GenericUser()
      user.password = 'test'
      expect(await userProvider.validateCredentials(user, { password: 'test' })).toBe(true)
      expect(await userProvider.validateCredentials(user, { password: 'fail' })).toBe(false)
    })
  })
})
