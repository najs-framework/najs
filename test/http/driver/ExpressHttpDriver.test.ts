import 'jest'
import * as Sinon from 'sinon'
import * as Http from 'http'
import { ExpressHttpDriver } from '../../../lib/http/driver/ExpressHttpDriver'
import { HttpDriverClass } from '../../../lib/constants'
import { ClassRegistry } from '../../../lib/core/ClassRegistry'
import { Log } from '../../../lib/log/Log'
import { Controller } from '../../../lib/http/controller/Controller'

describe('ExpressHttpDriver', function() {
  it('registers as default HttpDriver', function() {
    expect(ClassRegistry.has(HttpDriverClass)).toBe(true)
    expect(ClassRegistry.findOrFail(HttpDriverClass).instanceConstructor === ExpressHttpDriver).toBe(true)
  })

  describe('.getClassName()', function() {
    it('returns ExpressHttpDriver', function() {
      const driver = new ExpressHttpDriver()
      expect(driver.getClassName()).toEqual(ExpressHttpDriver.className)
    })
  })

  describe('.getNativeDriver()', function() {
    it('returns Express app instance', function() {
      const driver = new ExpressHttpDriver()
      expect(driver.getNativeDriver() === driver['express']).toBe(true)
    })
  })

  describe('.route()', function() {
    it('skips if method is not supported', function() {
      const driver = new ExpressHttpDriver()
      const getEndpointHandlersSpy = Sinon.spy(driver, <any>'getEndpointHandlers')
      driver.route({
        method: 'get-not-found',
        prefix: '',
        path: '/path',
        middleware: []
      })
      expect(getEndpointHandlersSpy.called).toBe(false)
    })

    it('joins prefix and path, calls getEndpointHandlers() to get endpoint handler', function() {
      const driver = new ExpressHttpDriver()
      const getEndpointHandlersSpy = Sinon.spy(driver, <any>'getEndpointHandlers')
      const route = {
        method: 'GET',
        prefix: '/',
        path: 'path',
        middleware: []
      }
      driver.route(route)
      expect(getEndpointHandlersSpy.calledWith('get', '/path', route)).toBe(true)
      getEndpointHandlersSpy.restore()
    })

    it('does not pass handlers to this.express[method] if handler is empty', function() {
      const driver = new ExpressHttpDriver()

      const getEndpointHandlersStub = Sinon.stub(driver, <any>'getEndpointHandlers')
      getEndpointHandlersStub.returns([])

      const postExpressStub = Sinon.stub(driver['express'], 'post')

      const route = {
        method: 'POST',
        prefix: '/',
        path: 'path',
        middleware: []
      }
      driver.route(route)
      expect(postExpressStub.called).toBe(false)

      getEndpointHandlersStub.restore()
      postExpressStub.restore()
    })

    it('passes handlers to this.express[method] with path and handler', function() {
      const driver = new ExpressHttpDriver()

      const fakeMiddleware = (a: any, b: any) => {}
      const fakeHandler = (a: any, b: any) => {}
      const getEndpointHandlersStub = Sinon.stub(driver, <any>'getEndpointHandlers')
      getEndpointHandlersStub.returns([fakeMiddleware, fakeHandler])

      const postExpressStub = Sinon.stub(driver['express'], 'post')

      const route = {
        method: 'POST',
        prefix: '/',
        path: 'path',
        middleware: []
      }
      driver.route(route)
      expect(postExpressStub.calledWith('/path', fakeMiddleware, fakeHandler)).toBe(true)

      getEndpointHandlersStub.restore()
      postExpressStub.restore()
    })
  })

  describe('protected .getEndpointHandlers()', function() {
    it('calls createEndpointWrapperByFunction and pushes result to handlers', function() {
      function handler() {}
      const route = {
        endpoint: handler
      }

      const driver = new ExpressHttpDriver()
      const createEndpointWrapperByFunctionStub = Sinon.stub(driver, <any>'createEndpointWrapperByFunction')

      const handlers = driver['getEndpointHandlers']('any', 'any', <any>route)
      expect(handlers).toHaveLength(1)
      expect(createEndpointWrapperByFunctionStub.calledWith(handler)).toBe(true)

      createEndpointWrapperByFunctionStub.restore()
    })

    // TODO: write more test
  })

  describe('protected .createEndpointWrapperByFunction()', function() {
    it('returns a wrapper function for endpoint, creates new Controller with request, response', function() {
      function handler() {}
      const handlerSpy = Sinon.spy(handler)

      const driver = new ExpressHttpDriver()
      const result = driver['createEndpointWrapperByFunction'](handlerSpy)
      expect(typeof result).toEqual('function')

      const request = {}
      const response = {}
      result(<any>request, <any>response)

      expect(handlerSpy.callCount).toEqual(1)

      const thisValue = handlerSpy.firstCall.thisValue
      expect(thisValue).toBeInstanceOf(Controller)
      expect(thisValue.request === request).toBe(true)
      expect(thisValue.response === response).toBe(true)

      expect(handlerSpy.firstCall.args[0] === request).toBe(true)
      expect(handlerSpy.firstCall.args[1] === response).toBe(true)
    })

    it('calls result.respond if endpoint return IResponse', function() {
      const iResponse = {
        respond(response: any, httpDriver: any) {}
      }
      function handler() {
        return iResponse
      }

      const iResponseSpy = Sinon.spy(iResponse, 'respond')

      const driver = new ExpressHttpDriver()
      const result = driver['createEndpointWrapperByFunction'](handler)

      const response = {}
      result(<any>{}, <any>response)
      expect(iResponseSpy.calledWith(response, driver)).toBe(true)
    })
  })

  describe('.start()', function() {
    it('passes this.express to http.createServer()', function() {
      const fakeServer = {
        listen(port: any, host: any) {}
      }
      const driver = new ExpressHttpDriver()

      const listenSpy = Sinon.spy(fakeServer, 'listen')

      const logStub = Sinon.stub(Log, 'info')
      const httpStub = Sinon.stub(Http, 'createServer')
      httpStub.returns(fakeServer)

      driver.start({})
      expect(httpStub.calledWith(driver['express'])).toBe(true)
      expect(logStub.calledWith('Listening at port 3000')).toBe(true)

      driver.start({ port: 3333 })
      expect(listenSpy.calledWith(3333, undefined)).toBe(true)
      expect(logStub.calledWith('Listening at port 3333')).toBe(true)

      driver.start({ host: '0.0.0.0' })
      expect(listenSpy.calledWith(undefined, '0.0.0.0')).toBe(true)
      expect(logStub.calledWith('Listening at port 0.0.0.0:3000')).toBe(true)

      driver.start({ port: 4444, host: '0.0.0.0' })
      expect(listenSpy.calledWith(4444, '0.0.0.0')).toBe(true)
      expect(logStub.calledWith('Listening at port 0.0.0.0:4444')).toBe(true)

      httpStub.restore()
      logStub.restore()
    })
  })

  describe('.responseJson()', function() {
    it('calls response.json()', function() {
      const response = {
        json: function() {}
      }
      const jsonSpy = Sinon.spy(response, 'json')
      const driver = new ExpressHttpDriver()

      driver.respondJson(<any>response, 123)
      expect(jsonSpy.calledWith(123)).toBe(true)

      driver.respondJson(<any>response, '123')
      expect(jsonSpy.calledWith('123')).toBe(true)

      driver.respondJson(<any>response, [1, 2, 3])
      expect(jsonSpy.calledWith([1, 2, 3])).toBe(true)

      driver.respondJson(<any>response, { any: 'thing' })
      expect(jsonSpy.calledWith({ any: 'thing' })).toBe(true)
    })
  })

  describe('.responseJson()', function() {
    it('calls response.redirect() with swapped params', function() {
      const response = {
        redirect: function() {}
      }
      const redirectSpy = Sinon.spy(response, 'redirect')
      const driver = new ExpressHttpDriver()

      driver.respondRedirect(<any>response, 'test', 304)
      expect(redirectSpy.calledWith(304, 'test')).toBe(true)
    })
  })
})
