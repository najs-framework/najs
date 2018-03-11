import 'jest'
import { FacadeContainer } from 'najs-facade'
import { LogFacade } from './../../../lib/facades/global/LogFacade'
import { MemberProxy } from '../../../lib/http/controller/MemberProxy'
import { isPromise } from '../../../lib/private/isPromise'

describe('MemberProxy', function() {
  it('implements IAutoload', function() {
    const proxy = new MemberProxy('test', {})
    expect(proxy.getClassName()).toEqual(MemberProxy.className)
  })

  it('provides proxy for members which can be a function or variable', function() {
    const proxy = new MemberProxy('test', {
      var: 'var',
      doSomething: function() {
        return 'something'
      }
    })
    expect((proxy as any).var).toEqual('var')
    expect((proxy as any).doSomething()).toEqual('something')
  })

  describe('constructor()', function() {
    it('initialize with a message, this message will be use for Log with warning level', function() {
      LogFacade.shouldReceive('warning')
        .withArgs('please use Middleware xxx before use .set()')
        .once()
      const proxy = new MemberProxy('please use Middleware xxx before use .{{key}}()', {
        chainable: ['set']
      })
      expect((proxy as any).set()).toBeInstanceOf(MemberProxy)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('extracts all members from settings with supported keys or not', function() {
      const proxy = new MemberProxy('please use Middleware xxx before use .{{key}}()', {
        chainable: ['set', 'test'],
        returnTrue: ['ok', 'test'],
        returnUndefined: ['ok', 'undefined'],
        custom: 123,
        test: 123
      })
      expect(proxy['members']).toEqual(['set', 'test', 'ok', 'undefined', 'custom'])
    })

    it('returns instance of Proxy(MemberProxy) instead of MemberProxy', function() {
      const instance = new MemberProxy('test', {})
      expect(instance).toBeInstanceOf(MemberProxy)
      expect(instance === instance['proxy']).toBe(true)
    })
  })

  describe('.createProxy()', function() {
    it('returns undefined if the key not defined in settings', function() {
      const proxy = new MemberProxy('please use Middleware xxx before use .{{key}}()', {
        chainable: ['set', 'test'],
        returnTrue: ['ok', 'test'],
        returnUndefined: ['ok', 'undefined'],
        custom: 123,
        test: 123
      })
      expect((proxy as any).custom).toEqual(123)
      expect((proxy as any).notFound).toBeUndefined()
    })

    it('returns a chainable function with Log.warning if it defined in chainable', function() {
      LogFacade.shouldReceive('warning')
        .withArgs('please use Middleware xxx before use .test()')
        .twice()
      const proxy = new MemberProxy('please use Middleware xxx before use .{{key}}()', {
        chainable: ['test']
      })
      expect((proxy as any).test().test()).toBeInstanceOf(MemberProxy)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('returns a function with returns undefined with Log.warning if it defined in returnUndefined', function() {
      LogFacade.shouldReceive('warning')
        .withArgs('please use Middleware xxx before use .test()')
        .once()
      const proxy = new MemberProxy('please use Middleware xxx before use .{{key}}()', {
        returnUndefined: ['test']
      })
      expect((proxy as any).test()).toBeUndefined()
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('returns a function with returns undefined with Log.warning if it defined in returnTrue', function() {
      LogFacade.shouldReceive('warning')
        .withArgs('please use Middleware xxx before use .test()')
        .once()
      const proxy = new MemberProxy('please use Middleware xxx before use .{{key}}()', {
        returnTrue: ['test']
      })
      expect((proxy as any).test()).toBe(true)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('returns a function with returns undefined with Log.warning if it defined in returnFalse', function() {
      LogFacade.shouldReceive('warning')
        .withArgs('please use Middleware xxx before use .test()')
        .once()
      const proxy = new MemberProxy('please use Middleware xxx before use .{{key}}()', {
        returnFalse: ['test']
      })
      expect((proxy as any).test()).toBe(false)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('returns a function with returns undefined with Log.warning if it defined in returnEmptyObject', function() {
      LogFacade.shouldReceive('warning')
        .withArgs('please use Middleware xxx before use .test()')
        .once()
      const proxy = new MemberProxy('please use Middleware xxx before use .{{key}}()', {
        returnEmptyObject: ['test']
      })
      expect((proxy as any).test()).toEqual({})
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('returns a function with returns undefined with Log.warning if it defined in returnPromiseUndefined', async function() {
      LogFacade.shouldReceive('warning')
        .withArgs('please use Middleware xxx before use .test()')
        .once()
      const proxy = new MemberProxy('please use Middleware xxx before use .{{key}}()', {
        returnPromiseUndefined: ['test']
      })
      const result = (proxy as any).test()
      expect(isPromise(result)).toBe(true)
      expect(await result).toBeUndefined()
      FacadeContainer.verifyAndRestoreAllFacades()
    })
  })
})
