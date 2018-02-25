import 'jest'
import * as Sinon from 'sinon'
import { ContextualFacade } from 'najs-facade'
import { Controller } from '../../../lib/http/controller/Controller'
import { ExpressController } from '../../../lib/http/controller/ExpressController'
import { Session } from '../../../lib/http/session/Session'
import { RequestDataWriter } from '../../../lib/http/request/RequestDataWriter'
import { ContextualFacadeClass } from '../../../lib/constants'
import { isPromise } from '../../../lib/private/isPromise'

describe('Session', function() {
  it('is a contextual facade', function() {
    const session = new Session(<any>{})
    expect(session).toBeInstanceOf(ContextualFacade)
    expect(session.getClassName()).toEqual(ContextualFacadeClass.Session)
  })

  describe('constructor()', function() {
    it('does nothing with controller is not ExpressController', function() {
      const rawSession = {}
      const controller = Reflect.construct(Controller, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      expect(session['data']).toBeUndefined()
      session.set('test', 'value')
      expect(session['data']).toBeUndefined()
    })

    it('assigns controller.request.session to "data" if the controller is ExpressController', function() {
      const rawSession = {}
      const expressController = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>expressController)
      expect(session['data'] === rawSession).toBe(true)
      session.set('test', 'value')
      expect(rawSession).toEqual({ test: 'value' })
    })

    it('assigns "reflash" to false, "keep" to an empty array if there FlashRegistry structure exists', function() {
      const rawSession = { [Session.FlashRegistryKey]: { reflash: true, keep: ['a', 'b'], flash: ['c'] } }
      const expressController = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      new Session(<any>expressController)
      expect(rawSession[Session.FlashRegistryKey]['reflash']).toBe(false)
      expect(rawSession[Session.FlashRegistryKey]['keep']).toEqual([])
      expect(rawSession[Session.FlashRegistryKey]['flash']).toEqual(['c'])
    })

    it('creates "flash" with empty array if there FlashRegistry structure exists and "flash" not found', function() {
      const rawSession = { [Session.FlashRegistryKey]: { reflash: true, keep: ['a', 'b'] } }
      const expressController = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      new Session(<any>expressController)
      expect(rawSession[Session.FlashRegistryKey]['flash']).toEqual([])
    })
  })

  describe('.regenerate()', function() {
    it('returns a promise', function() {
      const rawSession = { regenerate() {} }
      const expressController = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>expressController)
      expect(isPromise(session.regenerate())).toBe(true)
    })

    it('does nothing with controller is not ExpressController', async function() {
      const rawSession = { regenerate() {} }
      const regenerateSpy = Sinon.spy(rawSession, 'regenerate')
      const controller = Reflect.construct(Controller, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      await session.regenerate()
      expect(regenerateSpy.called).toBe(false)
    })

    it('calls raw session .regenerate if controller is ExpressController', async function() {
      const rawSession = {
        regenerate(cb: any) {
          cb()
        }
      }
      const regenerateSpy = Sinon.spy(rawSession, 'regenerate')
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      await session.regenerate()
      expect(regenerateSpy.called).toBe(true)
    })
  })

  describe('.getFlashRegistry()', function() {
    it('creates FlashRegistry structure if it does not exists in session', function() {
      const rawSession = {}
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      const registry = session.getFlashRegistry()
      expect(rawSession[Session.FlashRegistryKey] === registry).toBe(true)
    })

    it('simply returns FlashRegistry structure if it already in session', function() {
      const rawSession = {}
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      rawSession[Session.FlashRegistryKey] = {}
      expect(rawSession[Session.FlashRegistryKey]).toEqual({})
      const registry = session.getFlashRegistry()
      expect(rawSession[Session.FlashRegistryKey] === registry).toBe(true)
      expect(rawSession[Session.FlashRegistryKey]).toEqual({})
    })
  })

  describe('.flash()', function() {
    it('auto creates "flash" in FlashRegistry structure', function() {
      const rawSession = {}
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      session['data'][Session.FlashRegistryKey] = {}
      session.flash('test', 'value')
      expect(rawSession[Session.FlashRegistryKey]['flash']).toEqual(['test'])
    })

    it('pushes path to "flash" of FlashRegistry if the path does not in there', function() {
      const rawSession = { [Session.FlashRegistryKey]: {} }
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      session.flash('test', 'value')
      expect(rawSession[Session.FlashRegistryKey]['flash']).toEqual(['test'])
      session.flash('test-1', 'value')
      expect(rawSession[Session.FlashRegistryKey]['flash']).toEqual(['test', 'test-1'])
      session.flash('test', 'value')
      expect(rawSession[Session.FlashRegistryKey]['flash']).toEqual(['test', 'test-1'])
    })
  })

  describe('.reflash()', function() {
    it('sets "reflash" in FlashRegistry to true', function() {
      const rawSession = { [Session.FlashRegistryKey]: {} }
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      expect(rawSession[Session.FlashRegistryKey]['reflash']).toBe(false)
      session.reflash()
      expect(rawSession[Session.FlashRegistryKey]['reflash']).toBe(true)
    })
  })

  describe('.keep()', function() {
    it('auto creates "keep" in FlashRegistry structure', function() {
      const rawSession = {}
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      session['data'][Session.FlashRegistryKey] = {}
      session.keep('a', 'b')
      expect(rawSession[Session.FlashRegistryKey]['keep']).toEqual(['a', 'b'])
    })

    it('pushes path to "keep" of FlashRegistry if the path does not in there', function() {
      const rawSession = {}
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      session.keep('a')
      expect(rawSession[Session.FlashRegistryKey]['keep']).toEqual(['a'])
      session.keep(['a', 'b'])
      expect(rawSession[Session.FlashRegistryKey]['keep']).toEqual(['a', 'b'])
      session.keep('c', ['d'], 'a', 'e')
      expect(rawSession[Session.FlashRegistryKey]['keep']).toEqual(['a', 'b', 'c', 'd', 'e'])
    })
  })

  describe('.isFlashPath()', function() {
    it('returns false if "reflash" is true', function() {
      const rawSession = {}
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      session['data'][Session.FlashRegistryKey] = { reflash: true }
      expect(session.isFlashPath('any')).toBe(false)
    })

    it('returns false if path in "keep"', function() {
      const rawSession = {}
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      session['data'][Session.FlashRegistryKey] = { keep: ['a', 'b'], flash: ['b'] }
      expect(session.isFlashPath('a')).toBe(false)
      expect(session.isFlashPath('b')).toBe(false)
      expect(session.isFlashPath('c')).toBe(false)
    })

    it('returns false if path not in "flash"', function() {
      const rawSession = {}
      const controller = Reflect.construct(ExpressController, [{ method: 'get', session: rawSession }])

      const session = new Session(<any>controller)
      session['data'][Session.FlashRegistryKey] = { flash: ['c'] }
      expect(session.isFlashPath('a')).toBe(false)
      expect(session.isFlashPath('b')).toBe(false)
      expect(session.isFlashPath('c')).toBe(true)
    })
  })

  describe('.clear()', function() {
    it('deletes this.data by `delete` operator', function() {
      const rawSession = {}
      const controller = Reflect.construct(Controller, [{ method: 'get', session: rawSession }])
      const session = new Session(<any>controller)
      expect(session['data']).toBeUndefined()
      session['data'] = {}
      session.clear()
      expect(session['data']).toBeUndefined()
    })

    it('deletes this.data by `delete` operator, and session in request if controller is ExpressController', function() {
      const rawSession = {}
      const request = { method: 'get', session: rawSession }
      const expressController = Reflect.construct(ExpressController, [request])

      const session = new Session(<any>expressController)
      session.clear()
      expect(session['data']).toBeUndefined()
      expect(request.session).toBeUndefined()
    })
  })

  describe('.get()', function() {
    it('calls implementation of RequestDataWriter.get() if the path is not flash', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.get, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session['data'] = {}
      session.get('test')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test'])
      requestDataWriterSpy.restore()
    })

    it('calls implementation of RequestDataWriter.get(), then calls .delete() and remove path out of flash if it is', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.get, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      const deleteSpy = Sinon.spy(session, 'delete')

      session['data'] = {
        [Session.FlashRegistryKey]: { flash: ['flash'] },
        flash: 'yeah'
      }
      session.get('flash')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(deleteSpy.calledWith('flash')).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['flash'])
      deleteSpy.restore()
      requestDataWriterSpy.restore()
    })
  })

  describe('.has()', function() {
    it('calls implementation of RequestDataWriter.has()', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.has, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session.has('test')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test'])
      requestDataWriterSpy.restore()
    })
  })

  describe('.exists()', function() {
    it('calls implementation of RequestDataWriter.exists()', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.exists, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session.exists('test')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test'])
      requestDataWriterSpy.restore()
    })
  })

  describe('.all()', function() {
    it('calls implementation of RequestDataWriter.exists()', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.all, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session.all()
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual([])
      requestDataWriterSpy.restore()
    })
  })

  describe('.only()', function() {
    it('calls implementation of RequestDataWriter.only()', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.only, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session.only('test')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test'])
      requestDataWriterSpy.restore()
    })
  })

  describe('.except()', function() {
    it('calls implementation of RequestDataWriter.except()', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.except, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session.except('test')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test'])
      requestDataWriterSpy.restore()
    })
  })

  describe('.set()', function() {
    it('calls implementation of RequestDataWriter.set()', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.set, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session.set('test', 'value')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test', 'value'])
      requestDataWriterSpy.restore()
    })
  })

  describe('.put()', function() {
    it('is an alias of .set()', function() {
      const session = new Session(<any>{ request: { session: {} } })
      const setSpy = Sinon.spy(session, 'set')
      session.put('test', 'value')
      expect(setSpy.calledWith('test', 'value')).toBe(true)
      setSpy.restore()
    })
  })

  describe('.push()', function() {
    it('is an alias of .set()', function() {
      const session = new Session(<any>{ request: { session: {} } })
      const setSpy = Sinon.spy(session, 'set')
      session.push('test', 'value')
      expect(setSpy.calledWith('test', 'value')).toBe(true)
      setSpy.restore()
    })
  })

  describe('.pull()', function() {
    it('calls implementation of RequestDataWriter.pull()', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.pull, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session['data'] = {}
      session.pull('test', 'value')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test', 'value'])
      requestDataWriterSpy.restore()
    })
  })

  describe('.delete()', function() {
    it('calls implementation of RequestDataWriter.delete()', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.delete, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session.delete('test')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test'])
      requestDataWriterSpy.restore()
    })
  })

  describe('.remove()', function() {
    it('is an alias of .delete()', function() {
      const session = new Session(<any>{ request: { session: {} } })
      const deleteSpy = Sinon.spy(session, 'delete')
      session.remove('test')
      expect(deleteSpy.calledWith('test')).toBe(true)
      deleteSpy.restore()
    })
  })

  describe('.forget()', function() {
    it('is an alias of .forget()', function() {
      const session = new Session(<any>{ request: { session: {} } })
      const deleteSpy = Sinon.spy(session, 'delete')
      session.forget('test')
      expect(deleteSpy.calledWith('test')).toBe(true)
      deleteSpy.restore()
    })
  })

  describe('.flush()', function() {
    it('is an alias of .clear()', function() {
      const session = new Session(<any>{ request: { session: {} } })
      const clearSpy = Sinon.spy(session, 'clear')
      session.flush()
      expect(clearSpy.calledWith()).toBe(true)
      clearSpy.restore()
    })
  })
})
