import 'jest'
import * as Sinon from 'sinon'
import { ContextualFacade } from 'najs-facade'
import { Controller } from '../../../lib/http/controller/Controller'
import { ExpressController } from '../../../lib/http/controller/ExpressController'
import { Session } from '../../../lib/http/session/Session'
import { RequestDataWriter } from '../../../lib/http/request/RequestDataWriter'
import { ContextualFacadeClass } from '../../../lib/constants'

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
    it('calls implementation of RequestDataWriter.get()', function() {
      const requestDataWriterSpy = Sinon.spy(<any>RequestDataWriter.prototype.get, 'apply')
      const session = new Session(<any>{ request: { session: {} } })
      session.get('test')
      expect(requestDataWriterSpy.calledWith(session)).toBe(true)
      expect(Array.from(requestDataWriterSpy.firstCall.args[1])).toEqual(['test'])
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
