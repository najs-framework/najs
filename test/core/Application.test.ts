import 'jest'
import * as Sinon from 'sinon'
import * as Register from '../../lib/core/register'
import * as Make from '../../lib/core/make'
import * as Bind from '../../lib/core/bind'
import { Application } from '../../lib/core/Application'
import { Facade } from '../../lib/facades/Facade'
import { GlobalFacadeClass } from '../../lib/constants'
import { ClassRegistry } from '../../lib/core/ClassRegistry'

class Test {
  static className: string = 'Test'
}

class FakeHttpDriver {
  static className: string = 'FakeHttpDriver'
  start(options: Object) {}
}

describe('Application', function() {
  it('extends from Facade so it definitely a FacadeClass', function() {
    const app = new Application()
    expect(app).toBeInstanceOf(Facade)
    expect(app.getClassName()).toEqual(GlobalFacadeClass.Application)
    expect(ClassRegistry.has(GlobalFacadeClass.Application)).toBe(true)
  })

  describe('.register()', function() {
    it('proxies register() function', function() {
      const app = new Application()
      const registerSpy = Sinon.spy(Register, 'register')

      app.register(FakeHttpDriver)
      expect(registerSpy.calledWith(FakeHttpDriver)).toBe(true)

      app.register(Test, 'Test')
      expect(registerSpy.calledWith(Test, 'Test')).toBe(true)

      app.register(Test, 'Something', false)
      expect(registerSpy.calledWith(Test, 'Something', false)).toBe(true)

      app.register(Test, 'SomethingNew', true, false)
      expect(registerSpy.calledWith(Test, 'SomethingNew', true, false)).toBe(true)
    })
  })

  describe('.make()', function() {
    it('proxies make() function', function() {
      const app = new Application()
      const makeSpy = Sinon.spy(Make, 'make')

      app.make(Test)
      expect(makeSpy.calledWith(Test)).toBe(true)

      app.make('Test')
      expect(makeSpy.calledWith('Test')).toBe(true)

      app.make('Something', { data: 'any' })
      expect(makeSpy.calledWith('Something', { data: 'any' })).toBe(true)
    })
  })

  describe('.bind()', function() {
    it('proxies bind() function', function() {
      const app = new Application()
      const bindSpy = Sinon.spy(Bind, 'bind')

      app.bind('Cache', 'RedisCached')
      expect(bindSpy.calledWith('Cache', 'RedisCached')).toBe(true)

      const servicePoolInstanceCreator = function() {}
      app.bind('ServicePool', servicePoolInstanceCreator)
      expect(bindSpy.calledWith('ServicePool', servicePoolInstanceCreator)).toBe(true)
    })
  })
})
