import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { Application } from '../../lib/core/Application'
import { Facade } from 'najs-facade'
import { ClassRegistry } from 'najs-binding'

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
    expect(app.getClassName()).toEqual('Najs.Application')
    expect(ClassRegistry.has('Najs.Application')).toBe(true)
  })

  describe('.register()', function() {
    it('proxies register() function', function() {
      const app = new Application()
      const registerSpy = Sinon.spy(NajsBinding, 'register')

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
      const makeSpy = Sinon.spy(NajsBinding, 'make')

      app.make(Test)
      expect(makeSpy.calledWith(Test)).toBe(true)

      app.make('Test')
      expect(makeSpy.calledWith('Test')).toBe(true)
      makeSpy.restore()
    })
  })

  describe('.makeWith()', function() {
    it('proxies make() function', function() {
      const app = new Application()
      const makeStub = Sinon.stub(NajsBinding, 'make')

      app.makeWith(Test, { data: 'any' })
      expect(makeStub.calledWith(Test)).toBe(true)

      app.makeWith('Something', { data: 'any' })
      expect(makeStub.calledWith('Something', { data: 'any' })).toBe(true)

      app.makeWith(Test, ['anything'])
      expect(makeStub.calledWith(Test)).toBe(true)

      app.makeWith('Something', ['anything'])
      expect(makeStub.calledWith('Something', { data: 'any' })).toBe(true)
      makeStub.restore()
    })
  })

  describe('.bind()', function() {
    it('proxies bind() function', function() {
      const app = new Application()
      const bindSpy = Sinon.spy(NajsBinding, 'bind')

      app.bind('Cache', 'RedisCached')
      expect(bindSpy.calledWith('Cache', 'RedisCached')).toBe(true)

      const servicePoolInstanceCreator = function() {}
      app.bind('ServicePool', servicePoolInstanceCreator)
      expect(bindSpy.calledWith('ServicePool', servicePoolInstanceCreator)).toBe(true)
      bindSpy.restore()
    })
  })

  describe('.extend()', function() {
    it('proxies extend() function', function() {
      const app = new Application()
      const extendSpy = Sinon.spy(NajsBinding, 'extend')

      const servicePoolInstanceCreator = function() {}
      app.extend('ServicePool', servicePoolInstanceCreator)
      expect(extendSpy.calledWith('ServicePool', servicePoolInstanceCreator)).toBe(true)
      extendSpy.restore()
    })
  })
})
