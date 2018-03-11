import 'jest'
import * as Sinon from 'sinon'
import { ExpressMiddlewareBase } from '../../../lib/http/middleware/ExpressMiddlewareBase'

describe('ExpressMiddlewareBase', function() {
  describe('constructor()', function() {
    it('sets the first param to name, call .parseLevel(), .parseParams(), .parseIdentify()', function() {
      const parseLevelSpy = Sinon.spy(ExpressMiddlewareBase.prototype, <any>'parseLevel')
      const parseParamsSpy = Sinon.spy(ExpressMiddlewareBase.prototype, <any>'parseParams')
      const parseIdentifySpy = Sinon.spy(ExpressMiddlewareBase.prototype, <any>'parseIdentify')
      const instance = new ExpressMiddlewareBase('test', 'a')

      expect(instance['name']).toEqual('test')
      expect(parseLevelSpy.called).toBe(true)
      expect(parseParamsSpy.called).toBe(true)
      expect(parseIdentifySpy.called).toBe(true)

      parseLevelSpy.restore()
      parseParamsSpy.restore()
      parseIdentifySpy.restore()
    })
  })

  describe('protected .parseLevel()', function() {
    it('returns true if level is "global", "app" or "app-level"', function() {
      const input = {
        global: true,
        default: false,
        app: true,
        'app-level': true,
        test: false,
        express: false
      }
      for (const name in input) {
        const instance = new ExpressMiddlewareBase('test', 'a')
        expect(instance['parseLevel'](name)).toBe(input[name])
        expect(instance['isAppLevel']).toBe(input[name])
      }
    })
  })

  describe('protected .parseParams()', function() {
    it('does nothing, child class should implement it', function() {})
  })

  describe('protected .parseIdentify()', function() {
    it('joins all arguments of constructor by ":", child class can override it', function() {
      const instance = new ExpressMiddlewareBase('test', 'a')
      expect(instance['identify']).toEqual('test:a')
      expect(instance['parseIdentify']('a', 'b', 'c')).toEqual('a:b:c')
    })
  })

  describe('.createMiddleware()', function() {
    it('does nothing, returns undefined, child class should implement it', function() {
      const instance = new ExpressMiddlewareBase('test', 'a')
      expect(instance.createMiddleware()).toBe(undefined)
    })
  })

  describe('.native()', function() {
    it('returns undefined if the .createMiddleware() return undefined', function() {
      const instance = new ExpressMiddlewareBase('test', 'a')

      const createMiddlewareStub = Sinon.stub(instance, 'createMiddleware')
      createMiddlewareStub.returns(undefined)

      expect(instance.native(<any>{})).toBe(undefined)
    })

    it('returns result of .createMiddleware() if "isAppLevel" = false', function() {
      const instance = new ExpressMiddlewareBase('test')

      const createMiddlewareStub = Sinon.stub(instance, 'createMiddleware')
      createMiddlewareStub.returns('any')

      expect(instance.native(<any>{})).toBe('any')
    })

    it('always returns "undefined" if "isAppLevel" is true', function() {
      const app = {
        use() {}
      }

      const driver = {
        getNativeDriver() {
          return app
        }
      }

      const instance = new ExpressMiddlewareBase('test', 'global')
      const createMiddlewareStub = Sinon.stub(instance, 'createMiddleware')
      createMiddlewareStub.returns('any')

      expect(instance.native(<any>driver)).toBeUndefined()
    })

    it('creates "_najsMiddleware" in nativeDriver if it not found, calls app.use()', function() {
      const app = {
        use() {}
      }

      const driver = {
        getNativeDriver() {
          return app
        }
      }

      const useSpy = Sinon.spy(app, 'use')

      const instance = new ExpressMiddlewareBase('test', 'global')

      const createMiddlewareStub = Sinon.stub(instance, 'createMiddleware')
      createMiddlewareStub.returns('any')

      expect(instance.native(<any>driver)).toBeUndefined()
      expect(useSpy.calledWith('any')).toBe(true)
      expect(app['_najsMiddleware']).toEqual({ 'test:global': ['any'] })
    })

    it('calls app.use() n times if the middleware is an array', function() {
      const app = {
        use() {}
      }

      const driver = {
        getNativeDriver() {
          return app
        }
      }

      const useSpy = Sinon.spy(app, 'use')

      const instance = new ExpressMiddlewareBase('test', 'global')

      const createMiddlewareStub = Sinon.stub(instance, 'createMiddleware')
      createMiddlewareStub.returns(['a', 'b'])

      expect(instance.native(<any>driver)).toBeUndefined()
      expect(useSpy.firstCall.calledWith('a')).toBe(true)
      expect(useSpy.secondCall.calledWith('b')).toBe(true)
      expect(app['_najsMiddleware']).toEqual({ 'test:global': ['a', 'b'] })
    })

    it('never calls app.use() if the "identify" in _najsMiddleware', function() {
      const app = {
        use() {},
        _najsMiddleware: {
          'test:global': []
        }
      }

      const driver = {
        getNativeDriver() {
          return app
        }
      }

      const useSpy = Sinon.spy(app, 'use')

      const instance = new ExpressMiddlewareBase('test', 'global')

      const createMiddlewareStub = Sinon.stub(instance, 'createMiddleware')
      createMiddlewareStub.returns('any')

      expect(instance.native(<any>driver)).toBeUndefined()
      expect(useSpy.calledWith('any')).toBe(false)
      expect(app['_najsMiddleware']).toEqual({ 'test:global': [] })
    })
  })
})
