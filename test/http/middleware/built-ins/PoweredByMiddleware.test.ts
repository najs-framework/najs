import 'jest'
import * as Sinon from 'sinon'
import { ClassRegistry } from 'najs-binding'
import * as Middleware from '../../../../lib/http/middleware/built-ins/PoweredByMiddleware'
import { ExpressMiddlewareBase } from '../../../../lib/http/middleware/ExpressMiddlewareBase'

describe('PoweredByMiddleware', function() {
  it('extends ExpressMiddlewareBase', function() {
    const middleware = new Middleware.PoweredByMiddleware('test')
    expect(middleware).toBeInstanceOf(ExpressMiddlewareBase)
  })

  it('implements IAutoload and register automatically', function() {
    const middleware = new Middleware.PoweredByMiddleware('test')
    expect(middleware.getClassName()).toEqual(Middleware.PoweredByMiddleware.className)
    expect(ClassRegistry.has(Middleware.PoweredByMiddleware.className)).toBe(true)
  })

  describe('protected .parseIdentify()', function() {
    it('always returns "powered-by"', function() {
      const middleware = new Middleware.PoweredByMiddleware('test', 'app')
      expect(middleware['parseIdentify']()).toEqual('powered-by')
      expect(middleware['parseIdentify']('any', 'thing')).toEqual('powered-by')
    })
  })

  describe('protected .parseLevel()', function() {
    it('always returns true', function() {
      const middleware = new Middleware.PoweredByMiddleware('test', 'app')
      expect(middleware['parseLevel']('app')).toEqual(true)
      expect(middleware['parseLevel']('test')).toEqual(true)
    })
  })

  describe('protected .parseParams()', function() {
    it('sets arguments in index #1 to poweredBy variable, otherwise use Najs/Express by default', function() {
      const middleware = new Middleware.PoweredByMiddleware('test', 'app')
      expect(middleware['parseParams']('app')).toEqual('Najs/Express')
      expect(middleware['parseParams']('test', 'Najs')).toEqual('Najs')
    })
  })

  describe('.createMiddleware()', function() {
    it('creates "PoweredBySetter" only one time and returns it', function() {
      expect(Middleware.PoweredBySetter).toBeUndefined()
      const middleware = new Middleware.PoweredByMiddleware('test')
      expect(middleware.createMiddleware() === Middleware.PoweredBySetter).toBe(true)
      expect(typeof Middleware.PoweredBySetter).toEqual('function')
      const tmp = Middleware.PoweredBySetter
      expect(middleware.createMiddleware() === tmp).toBe(true)
      expect(middleware.createMiddleware() === tmp).toBe(true)
      expect(middleware.createMiddleware() === tmp).toBe(true)
    })
  })

  describe('PoweredBySetter', function() {
    it('simply calls setHeader("X-Powered-By", this.poweredBy)', function() {
      const response = { setHeader() {} }
      const next = () => {}
      const setHeaderSpy = Sinon.spy(response, 'setHeader')
      const nextSpy = Sinon.spy(next)

      Middleware.PoweredBySetter(<any>{}, <any>response, nextSpy)
      expect(setHeaderSpy.calledWith('X-Powered-By', 'Najs/Express')).toBe(true)
      expect(nextSpy.called).toBe(true)
    })
  })
})
