import 'jest'
import * as Sinon from 'sinon'
import { Route } from '../../lib/http/routing/Route'
// import { RouteCollection } from '../../lib/http/routing/RouteCollection'
import { HttpMethod } from '../../lib/http/HttpMethod'
import { RouteBuilder } from '../../lib/http/routing/RouteBuilder'

describe('Route', function() {
  it('can route all http verbs', function() {
    Route.get('test', 'controller@endpoint').name('')
    Route.get('/', 'controller@endpoint')
    Route.prefix('/retails').get('/', 'controller@endpoint')
    Route.middleware('Something').group(function() {
      Route.prefix('/warehouses')
        .middleware('CSRF')
        .post('/', 'controller@endpoint')
      Route.prefix('/warehouses').get('/', 'controller@endpoint')
      Route.prefix('/relationship').group(function() {
        Route.get('/', 'controller@endpoint')
        Route.post('/', 'controller@endpoint')
      })
    })
    Route.post('/', 'controller@endpoint')
    // for (const route of RouteCollection.routes) {
    //   // console.log(route)
    // }
  })

  describe('Register and Forward Methods', function() {
    describe('IRouteGrammarVerbs functions', function() {
      it('use()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(Route, <any>'register')
        registerStub.returns(builder)
        const useSpy = Sinon.spy(builder, 'use')

        function a() {}
        const b = {}
        Route.use(a, [b, 12], 'c')
        expect(useSpy.calledWith(a, [b, 12], 'c')).toBe(true)

        registerStub.restore()
      })

      it('middleware()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(Route, <any>'register')
        registerStub.returns(builder)
        const middlewareSpy = Sinon.spy(builder, 'middleware')

        function a() {}
        const b = {}
        Route.middleware(a, [b, 12], 'c')
        expect(middlewareSpy.calledWith(a, [b, 12], 'c')).toBe(true)

        registerStub.restore()
      })

      it('prefix()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(Route, <any>'register')
        registerStub.returns(builder)
        const prefixSpy = Sinon.spy(builder, 'prefix')

        Route.prefix('test')
        expect(prefixSpy.calledWith('test')).toBe(true)

        registerStub.restore()
      })

      it('name()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(Route, <any>'register')
        registerStub.returns(builder)
        const nameSpy = Sinon.spy(builder, 'name')

        Route.name('test')
        expect(nameSpy.calledWith('test')).toBe(true)

        registerStub.restore()
      })

      it('group()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(Route, <any>'register')
        registerStub.returns(builder)
        const groupSpy = Sinon.spy(builder, 'group')

        function groupFunction() {}
        Route.group(groupFunction)
        expect(groupSpy.calledWith(groupFunction)).toBe(true)

        registerStub.restore()
      })

      it('method()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(Route, <any>'register')
        registerStub.returns(builder)
        const methodSpy = Sinon.spy(builder, 'method')

        function handler() {}
        Route.method(HttpMethod.DELETE, 'path', handler)
        expect(methodSpy.calledWith(HttpMethod.DELETE, 'path', handler)).toBe(true)

        const Controller = {
          endpoint: function() {}
        }
        Route.method(HttpMethod.M_SEARCH, 'path', Controller, 'endpoint')
        expect(methodSpy.calledWith(HttpMethod.M_SEARCH, 'path', Controller, 'endpoint')).toBe(true)

        Route.method(HttpMethod.CHECKOUT, 'path', 'Controller@endpoint')
        expect(methodSpy.calledWith(HttpMethod.CHECKOUT, 'path', 'Controller@endpoint')).toBe(true)

        registerStub.restore()
      })

      const list = {
        all: 'all',
        checkout: HttpMethod.CHECKOUT,
        copy: HttpMethod.COPY,
        delete: HttpMethod.DELETE,
        get: HttpMethod.GET,
        head: HttpMethod.HEAD,
        lock: HttpMethod.LOCK,
        merge: HttpMethod.MERGE,
        mkactivity: HttpMethod.MKACTIVITY,
        mkcol: HttpMethod.MKCOL,
        move: HttpMethod.MOVE,
        msearch: HttpMethod.M_SEARCH,
        notify: HttpMethod.NOTIFY,
        options: HttpMethod.OPTIONS,
        patch: HttpMethod.PATCH,
        post: HttpMethod.POST,
        purge: HttpMethod.PURGE,
        put: HttpMethod.PUT,
        report: HttpMethod.REPORT,
        search: HttpMethod.SEARCH,
        subscribe: HttpMethod.SUBSCRIBE,
        trace: HttpMethod.TRACE,
        unlock: HttpMethod.UNLOCK,
        unsubscribe: HttpMethod.UNSUBSCRIBE
      }
      for (const name in list) {
        it(name + '() registers and calls RouteBuilder.' + name + '()', function() {
          const builder = new RouteBuilder()
          const registerStub = Sinon.stub(Route, <any>'register')
          registerStub.returns(builder)

          const methodSpy = Sinon.spy(builder, 'method')
          Reflect.apply(Route[name], Route, ['path', 'controller@endpoint'])
          expect(methodSpy.calledWith(list[name], 'path', 'controller@endpoint')).toBe(true)

          function handler() {}
          Reflect.apply(Route[name], Route, ['path', handler])
          expect(methodSpy.calledWith(list[name], 'path', handler)).toBe(true)

          const Controller = {
            endpoint: function() {}
          }
          Reflect.apply(Route[name], Route, ['path', Controller, 'endpoint'])
          expect(methodSpy.calledWith(list[name], 'path', Controller, 'endpoint')).toBe(true)

          registerStub.restore()
        })
      }
    })
  })
})
