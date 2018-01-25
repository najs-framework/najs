import 'jest'
import * as Sinon from 'sinon'
import { ExpressHttpDriver } from '../../../lib/http/driver/ExpressHttpDriver'
import { HttpDriverClass } from '../../../lib/constants'
import { ClassRegistry } from '../../../lib/core/ClassRegistry'
import { Log } from '../../../lib/log/Log'
import * as Http from 'http'

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
    // TODO: write unit test
    const driver = new ExpressHttpDriver()
    driver.route(<any>{})
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
