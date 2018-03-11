import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { ClassRegistry } from 'najs-binding'
import { HttpKernel } from '../../lib/http/HttpKernel'
import { SystemClass } from '../../lib/constants'

describe('HttpKernel', function() {
  it('is a base class which contains middleware configuration', function() {})

  it('auto register to ClassRegistry with name HttpKernel', function() {
    expect(ClassRegistry.has(SystemClass.HttpKernel)).toBe(true)

    const instance = new HttpKernel()
    expect(instance.getClassName() === SystemClass.HttpKernel)
  })

  describe('.findMiddlewareByName()', function() {
    it('returns middleware in "this.middleware" if found', function() {
      const instance = new HttpKernel()
      instance['middleware'] = {
        'custom-middleware': 'CustomMiddleware'
      }
      instance['globalMiddleware'] = {
        'custom-middleware': 'GlobalMiddleware'
      }
      expect(instance['findMiddlewareByName']('custom-middleware')).toEqual('CustomMiddleware')
    })

    it('returns middleware in "this.globalMiddleware" if "this.middleware" not found', function() {
      const instance = new HttpKernel()
      instance['middleware'] = {
        'custom-middleware': 'CustomMiddleware'
      }
      instance['globalMiddleware'] = {
        middleware: 'GlobalMiddleware'
      }
      expect(instance['findMiddlewareByName']('middleware')).toEqual('GlobalMiddleware')
    })

    it('returns undefined if not found in "this.middleware" AND "this.globalMiddleware"', function() {
      const instance = new HttpKernel()
      instance['middleware'] = {
        'custom-middleware': 'CustomMiddleware'
      }
      instance['globalMiddleware'] = {
        middleware: 'GlobalMiddleware'
      }
      expect(instance['findMiddlewareByName']('not-found')).toBeUndefined()
    })
  })

  describe('.getMiddleware()', function() {
    it('calls .findMiddlewareByName() then call .createMiddleware() if the result of findMiddlewareByName() is array or string', function() {
      const instance = new HttpKernel()
      const findMiddlewareByNameStub = Sinon.stub(instance, <any>'findMiddlewareByName')
      const createMiddlewareStub = Sinon.stub(instance, <any>'createMiddleware')
      const createGroupMiddlewareStub = Sinon.stub(instance, <any>'createGroupMiddleware')

      findMiddlewareByNameStub.returns([])
      instance.getMiddleware('test')
      expect(createMiddlewareStub.called).toBe(true)
      expect(createGroupMiddlewareStub.called).toBe(false)

      findMiddlewareByNameStub.returns('test')
      instance.getMiddleware('test')
      expect(createMiddlewareStub.called).toBe(true)
      expect(createGroupMiddlewareStub.called).toBe(false)
    })

    it('calls .findMiddlewareByName() then call .createGroupMiddleware() if the result of findMiddlewareByName() is object', function() {
      const instance = new HttpKernel()
      const findMiddlewareByNameStub = Sinon.stub(instance, <any>'findMiddlewareByName')
      const createMiddlewareStub = Sinon.stub(instance, <any>'createMiddleware')
      const createGroupMiddlewareStub = Sinon.stub(instance, <any>'createGroupMiddleware')

      findMiddlewareByNameStub.returns({})
      instance.getMiddleware('test')
      expect(createMiddlewareStub.called).toBe(false)
      expect(createGroupMiddlewareStub.called).toBe(true)
    })
  })

  describe('protected .createMiddleware()', function() {
    it('returns empty array if middleware not found', function() {
      const instance = new HttpKernel()
      expect(instance.getMiddleware('not-found')).toEqual([])
    })

    it('calls make() and push middleware to result if middleware instance is exists', function() {
      const middleware = {}
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(middleware)

      const instance = new HttpKernel()
      instance['middleware']['test'] = 'something'
      const result = instance.getMiddleware('test')
      expect(result).toHaveLength(1)
      expect(result[0] === middleware).toBe(true)
      expect(makeStub.calledWith('something', ['test'])).toBe(true)
      makeStub.restore()
    })

    it('calls make() and does not push middleware to result if middleware instance not exists', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(undefined)

      const instance = new HttpKernel()
      instance['middleware']['test'] = 'something'
      const result = instance.getMiddleware('test')
      expect(result).toHaveLength(0)
      expect(makeStub.calledWith('something', ['test'])).toBe(true)
      makeStub.restore()
    })

    it('maps all if the middleware is an array, does the same thing as string param', function() {
      const middleware = {}
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.withArgs('something').returns(middleware)
      makeStub.withArgs('not-found').returns(undefined)

      const instance = new HttpKernel()
      instance['middleware']['test'] = ['something', 'not-found']
      const result = instance.getMiddleware('test')
      expect(result).toHaveLength(1)
      expect(result[0] === middleware).toBe(true)
      expect(makeStub.calledWith('something', ['test'])).toBe(true)
      makeStub.restore()
    })

    it('splits the middleware name by ":" and pass all to middleware constructor', function() {
      const middleware = {}
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.withArgs('something').returns(middleware)
      makeStub.withArgs('not-found').returns(undefined)

      const instance = new HttpKernel()
      instance['middleware']['test'] = ['something', 'not-found']
      const result = instance.getMiddleware('test:param')
      expect(result).toHaveLength(1)
      expect(result[0] === middleware).toBe(true)
      expect(makeStub.calledWith('something', ['test', 'param'])).toBe(true)
      expect(makeStub.lastCall.args[1]).toEqual(['test', 'param'])
      makeStub.restore()
    })
  })

  describe('protected .createGroupMiddleware()', function() {
    it('does same behavior of .createMiddleware() but with name is key of settings', function() {
      const middleware = {}
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.withArgs('something').returns(middleware)
      makeStub.withArgs('not-found').returns(undefined)

      const instance = new HttpKernel()
      instance['middleware']['group'] = {
        a: 'something',
        'a:options': 'something',
        'b:api': 'not-found'
      }

      const result = instance.getMiddleware('group')
      expect(result).toHaveLength(2)
      expect(result[0] === middleware).toBe(true)
      expect(result[1] === middleware).toBe(true)
      expect(makeStub.firstCall.calledWith('something', ['a'])).toBe(true)
      expect(makeStub.secondCall.calledWith('something', ['a', 'options'])).toBe(true)
      expect(makeStub.lastCall.calledWith('not-found', ['b', 'api'])).toBe(true)
      makeStub.restore()
    })
  })
})
