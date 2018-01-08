import 'jest'
import * as Sinon from 'sinon'
import * as Register from '../../lib/core/register'
import * as Make from '../../lib/core/make'
import { Najs } from '../../lib/core/Najs'

class Test {
  static className: string = 'Test'
}

class FakeHttpDriver {
  static className: string = 'FakeHttpDriver'
  start(options: Object) {}
}

const DefaultOptions = {
  port: 3000,
  host: 'localhost',
  httpDriver: 'ExpressHttpDriver'
}
describe('Najs', function() {
  describe('use(options: Object)', function() {
    it('assigns default options if use is not called', function() {
      expect(Najs['options']).toEqual(DefaultOptions)
    })

    it('assigns default options if options is undefined', function() {
      Najs.use(undefined)
      expect(Najs['options']).toEqual(DefaultOptions)
    })

    it('assigns default options if options is empty', function() {
      Najs.use({})
      expect(Najs['options']).toEqual(DefaultOptions)
    })

    it('modified options by parameter', function() {
      Najs.use({ port: 30000 })
      expect(Najs['options']).toEqual(Object.assign({}, DefaultOptions, { port: 30000 }))
    })
  })

  describe('Najs.register()', function() {
    it('proxies register() function', function() {
      const registerSpy = Sinon.spy(Register, 'register')
      Najs.register(FakeHttpDriver)
      expect(registerSpy.calledWith(FakeHttpDriver)).toBe(true)
      Najs.register(Test, 'Test')
      expect(registerSpy.calledWith(Test, 'Test')).toBe(true)
      Najs.register(Test, 'Something', false)
      expect(registerSpy.calledWith(Test, 'Something', false)).toBe(true)
      Najs.register(Test, 'SomethingNew', true, false)
      expect(registerSpy.calledWith(Test, 'SomethingNew', true, false)).toBe(true)
    })
  })

  describe('Najs.make()', function() {
    it('proxies make() function', function() {
      const makeSpy = Sinon.spy(Make, 'make')
      Najs.make(Test)
      expect(makeSpy.calledWith(Test)).toBe(true)
      Najs.make('Test')
      expect(makeSpy.calledWith('Test')).toBe(true)
      Najs.make('Something', { data: 'any' })
      expect(makeSpy.calledWith('Something', { data: 'any' })).toBe(true)
    })
  })

  describe('start(options?: Object)', function() {
    it('called use(options) if provided', function() {
      const useSpy = Sinon.spy(Najs, 'use')
      Najs.start({
        httpDriver: FakeHttpDriver.className
      })
      expect(
        useSpy.calledWith({
          httpDriver: FakeHttpDriver.className
        })
      ).toBe(true)
    })

    it('use Najs.options if do not pass options', function() {
      Najs.use({
        httpDriver: FakeHttpDriver.className
      })
      Najs.start()
    })
  })
})
