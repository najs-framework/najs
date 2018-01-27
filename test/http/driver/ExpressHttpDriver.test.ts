import 'jest'
import * as Sinon from 'sinon'
import * as Http from 'http'
import * as Make from '../../../lib/core/make'
import { ExpressHttpDriver } from '../../../lib/http/driver/ExpressHttpDriver'
import { HttpDriverClass } from '../../../lib/constants'
import { ClassRegistry } from '../../../lib/core/ClassRegistry'
import { Log } from '../../../lib/log/Log'
import { Controller } from '../../../lib/http/controller/Controller'
import { register } from '../../../lib/core/register'

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

  describe('protected .createEndpointWrapper()', function() {
    class TestControllerA extends Controller {
      static className: string = 'TestControllerA'

      getClassName() {
        return TestControllerA.className
      }

      endpoint() {}
    }
    register(TestControllerA)

    it('always returns a function despite Controller or Endpoint are invalid', function() {
      const driver = new ExpressHttpDriver()
      const result = driver['createEndpointWrapper']('NotFound', 'invalid')
      expect(typeof result === 'function').toBe(true)
    })

    it('calls make() and make() throws an error if Controller not found', function() {
      const driver = new ExpressHttpDriver()
      const result = driver['createEndpointWrapper']('NotFound', 'invalid')
      expect(typeof result === 'function').toBe(true)
      try {
        result(<any>{}, <any>{})
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError)
        return
      }
      expect('shout not reach this line').toEqual('hum')
    })

    it('creates instance of Controller via make but do not call if endpoint not found', function() {
      const makeSpy = Sinon.spy(Make, 'make')
      const endpointSpy = Sinon.spy(TestControllerA.prototype, 'endpoint')
      const driver = new ExpressHttpDriver()
      const result = driver['createEndpointWrapper']('TestControllerA', 'invalid')

      const request = {}
      const response = {}
      result(<any>request, <any>response)
      expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true)
      expect(endpointSpy.called).toBe(false)
      makeSpy.restore()
      endpointSpy.restore()
    })

    it('creates instance of Controller via make, calls endpoint and calls handleEndpointResult()', function() {
      const makeSpy = Sinon.spy(Make, 'make')
      const endpointSpy = Sinon.spy(TestControllerA.prototype, 'endpoint')
      const driver = new ExpressHttpDriver()
      const handleEndpointResultStub = Sinon.stub(driver, <any>'handleEndpointResult')

      const result = driver['createEndpointWrapper']('TestControllerA', 'endpoint')
      const request = {}
      const response = {}
      result(<any>request, <any>response)
      expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true)
      expect(endpointSpy.called).toBe(true)
      expect(handleEndpointResultStub.calledWith(response, undefined)).toBe(true)
      makeSpy.restore()
      endpointSpy.restore()
      handleEndpointResultStub.restore()
    })
  })

  describe('protected .createEndpointWrapperByFunction()', function() {
    function handler() {}
    const handlerSpy = Sinon.spy(handler)

    const driver = new ExpressHttpDriver()
    const result = driver['createEndpointWrapperByFunction'](handlerSpy)
    const handleEndpointResultStub = Sinon.stub(driver, <any>'handleEndpointResult')
    const request = {}
    const response = {}

    it('returns a wrapper function for endpoint', function() {
      expect(typeof result).toEqual('function')
    })

    it('creates new Controller with request, response', function() {
      result(<any>request, <any>response)

      expect(handlerSpy.callCount).toEqual(1)
      const thisValue = handlerSpy.firstCall.thisValue
      expect(thisValue).toBeInstanceOf(Controller)
      expect(thisValue.request === request).toBe(true)
      expect(thisValue.response === response).toBe(true)
    })

    it("calls handleEndpointResult and passes response, endpoint's result", function() {
      expect(handlerSpy.firstCall.args[0] === request).toBe(true)
      expect(handlerSpy.firstCall.args[1] === response).toBe(true)

      expect(handleEndpointResultStub.calledWith(response, undefined)).toBe(true)
      handleEndpointResultStub.restore()
    })
  })

  describe('protected .handleEndpointResult()', function() {
    it('does nothing if result is undefined', function() {
      const response = {}
      const driver = new ExpressHttpDriver()
      driver['handleEndpointResult'](<any>response, undefined)
    })

    it('calls result.respond if result is IResponse', function() {
      const iResponse = {
        respond(response: any, httpDriver: any) {}
      }
      const iResponseSpy = Sinon.spy(iResponse, 'respond')

      const response = {}
      const driver = new ExpressHttpDriver()
      driver['handleEndpointResult'](<any>response, iResponse)
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
