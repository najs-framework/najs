import 'jest'
import * as Sinon from 'sinon'
import * as PathToRegex from 'path-to-regexp'
import { RouteFacade as Route } from '../../../lib/http/routing/RouteFacade'
import { RouteCollection } from '../../../lib/http/routing/RouteCollection'
import { HttpMethod } from '../../../lib/http/HttpMethod'
import { RouteBuilder } from '../../../lib/http/routing/RouteBuilder'

function clearRouteCollection() {
  RouteCollection['routes'] = []
}
function getRouteData(
  method: any,
  path: any,
  prefix: any,
  middleware: any,
  controller: any,
  endpoint: any,
  name?: any,
  metadata?: any
) {
  return {
    name,
    metadata,
    method,
    path,
    prefix,
    middleware,
    controller,
    endpoint
  }
}

describe('Route', function() {
  describe('IRouteGenerateUrl', function() {
    it('calls "path-to-regex".compile() and passes params to generate url', function() {
      const toPath = function() {
        return 'any'
      }
      const toPathSpy = Sinon.spy(toPath)
      const compileStub = Sinon.stub(PathToRegex, 'compile').returns(toPathSpy)
      const routeCollectionFindOrFailStub = Sinon.stub(RouteCollection, 'findOrFail').returns({
        prefix: '/prefix',
        path: '/path'
      })

      Route['createByName']('test')
      expect(routeCollectionFindOrFailStub.called).toBe(true)
      expect(compileStub.calledWith('/prefix/path')).toBe(true)
      expect(toPathSpy.calledWith(undefined, undefined)).toBe(true)

      Route['createByName']('test', { id: 123, abc: 'string' })
      expect(routeCollectionFindOrFailStub.called).toBe(true)
      expect(compileStub.calledWith('/prefix/path')).toBe(true)
      expect(toPathSpy.calledWith({ id: 123, abc: 'string' }, undefined)).toBe(true)

      const option = { encode: (v: string) => v }
      Route['createByName']('test', { id: 123, abc: 'string' }, option)
      expect(routeCollectionFindOrFailStub.called).toBe(true)
      expect(compileStub.calledWith('/prefix/path')).toBe(true)
      expect(toPathSpy.calledWith({ id: 123, abc: 'string' }, option)).toBe(true)

      compileStub.restore()
      routeCollectionFindOrFailStub.restore()
    })
  })

  describe('Routing Grammar', function() {
    afterEach(function() {
      clearRouteCollection()
    })

    it('allows .middleware() before or after .[HTTP METHOD]()', function() {
      Route.get('/test', 'Controller@endpoint').middleware('a', 'b', 'c')
      Route.middleware('a', 'b', 'c').post('/test', 'Controller@endpoint')

      expect(RouteCollection.getData()).toEqual([
        getRouteData(HttpMethod.GET, '/test', '', ['a', 'b', 'c'], 'Controller', 'endpoint'),
        getRouteData(HttpMethod.POST, '/test', '', ['a', 'b', 'c'], 'Controller', 'endpoint')
      ])
    })

    it('allows .prefix() before or after .[HTTP METHOD]()', function() {
      Route.get('/test', 'Controller@endpoint').prefix('/prefix')
      Route.prefix('/prefix').post('/test', 'Controller@endpoint')

      expect(RouteCollection.getData()).toEqual([
        getRouteData(HttpMethod.GET, '/test', '/prefix', [], 'Controller', 'endpoint'),
        getRouteData(HttpMethod.POST, '/test', '/prefix', [], 'Controller', 'endpoint')
      ])
    })

    it('allows .prefix() and .middleware() chain before or after .[HTTP METHOD]()', function() {
      Route.get('/test', 'Controller@endpoint')
        .prefix('/prefix')
        .middleware('a', 'b', 'c')
      Route.prefix('/prefix')
        .middleware('a', 'b', 'c')
        .post('/test', 'Controller@endpoint')
      Route.delete('/test', 'Controller@endpoint')
        .middleware('a', 'b', 'c')
        .prefix('/prefix')
      Route.middleware('a', 'b', 'c')
        .prefix('/prefix')
        .patch('/test', 'Controller@endpoint')

      expect(RouteCollection.getData()).toEqual([
        getRouteData(HttpMethod.GET, '/test', '/prefix', ['a', 'b', 'c'], 'Controller', 'endpoint'),
        getRouteData(HttpMethod.POST, '/test', '/prefix', ['a', 'b', 'c'], 'Controller', 'endpoint'),
        getRouteData(HttpMethod.DELETE, '/test', '/prefix', ['a', 'b', 'c'], 'Controller', 'endpoint'),
        getRouteData(HttpMethod.PATCH, '/test', '/prefix', ['a', 'b', 'c'], 'Controller', 'endpoint')
      ])
    })

    it('allows .name() before or after .[HTTP METHOD]()', function() {
      Route.get('/test', 'Controller@endpoint').name('name-get')
      Route.name('name-post').post('/test', 'Controller@endpoint')

      expect(RouteCollection.getData()).toEqual([
        getRouteData(HttpMethod.GET, '/test', '', [], 'Controller', 'endpoint', 'name-get'),
        getRouteData(HttpMethod.POST, '/test', '', [], 'Controller', 'endpoint', 'name-post')
      ])
    })

    it('allows .prefix() and .middleware() with .name() before or after .[HTTP METHOD]()', function() {
      Route.get('/test', 'Controller@endpoint')
        .name('name-get')
        .prefix('/prefix')
        .middleware('a')
      Route.prefix('/prefix')
        .middleware('a')
        .name('name-post')
        .post('/test', 'Controller@endpoint')
      Route.delete('/test', 'Controller@endpoint')
        .prefix('/prefix')
        .name('name-delete')
        .middleware('a')
      Route.put('/test', 'Controller@endpoint')
        .prefix('/prefix')
        .name('name-put')
        .middleware('a')

      expect(RouteCollection.getData()).toEqual([
        getRouteData(HttpMethod.GET, '/test', '/prefix', ['a'], 'Controller', 'endpoint', 'name-get'),
        getRouteData(HttpMethod.POST, '/test', '/prefix', ['a'], 'Controller', 'endpoint', 'name-post'),
        getRouteData(HttpMethod.DELETE, '/test', '/prefix', ['a'], 'Controller', 'endpoint', 'name-delete'),
        getRouteData(HttpMethod.PUT, '/test', '/prefix', ['a'], 'Controller', 'endpoint', 'name-put')
      ])
    })

    it('allows .prefix() before or after .group()', function() {
      Route.prefix('/a').group(function() {
        Route.get('/test', 'Controller@endpoint').name('name-get')
        Route.name('name-post').post('/test', 'Controller@endpoint')
      })
      Route.group(function() {
        Route.get('/test', 'Controller@endpoint').name('name-get')
        Route.name('name-post').post('/test', 'Controller@endpoint')
      }).prefix('/b')

      expect(RouteCollection.getData()).toEqual([
        getRouteData(HttpMethod.GET, '/test', '/a', [], 'Controller', 'endpoint', 'name-get'),
        getRouteData(HttpMethod.POST, '/test', '/a', [], 'Controller', 'endpoint', 'name-post'),
        getRouteData(HttpMethod.GET, '/test', '/b', [], 'Controller', 'endpoint', 'name-get'),
        getRouteData(HttpMethod.POST, '/test', '/b', [], 'Controller', 'endpoint', 'name-post')
      ])
    })

    it('allows to use single route and group of routes', function() {
      Route.put('/test', 'Controller@endpoint').name('name-put')
      Route.prefix('/a').group(function() {
        Route.get('/test', 'Controller@endpoint').name('name-get')
        Route.name('name-post').post('/test', 'Controller@endpoint')
      })

      expect(RouteCollection.getData()).toEqual([
        getRouteData(HttpMethod.PUT, '/test', '', [], 'Controller', 'endpoint', 'name-put'),
        getRouteData(HttpMethod.GET, '/test', '/a', [], 'Controller', 'endpoint', 'name-get'),
        getRouteData(HttpMethod.POST, '/test', '/a', [], 'Controller', 'endpoint', 'name-post')
      ])
    })

    it('allows multiple .group() levels', function() {
      Route.prefix('/a')
        .middleware('a')
        .group(function() {
          Route.group(function() {
            Route.put('/test', 'Controller@endpoint').name('name-put')
          })

          Route.middleware('b')
            .prefix('/b')
            .group(function() {
              Route.get('/test', 'Controller@endpoint').name('name-get')
              Route.group(function() {
                Route.name('name-post').post('/test', 'Controller@endpoint')
              })
                .prefix('/c')
                .middleware('c')
            })
        })

      expect(RouteCollection.getData()).toEqual([
        getRouteData(HttpMethod.PUT, '/test', '/a', ['a'], 'Controller', 'endpoint', 'name-put'),
        getRouteData(HttpMethod.GET, '/test', '/a/b', ['a', 'b'], 'Controller', 'endpoint', 'name-get'),
        getRouteData(HttpMethod.POST, '/test', '/a/b/c', ['a', 'b', 'c'], 'Controller', 'endpoint', 'name-post')
      ])
    })
  })

  describe('Register and Forward Methods', function() {
    describe('IRouteGrammarVerbs functions', function() {
      it('use()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(RouteCollection, 'register')
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
        const registerStub = Sinon.stub(RouteCollection, 'register')
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
        const registerStub = Sinon.stub(RouteCollection, 'register')
        registerStub.returns(builder)
        const prefixSpy = Sinon.spy(builder, 'prefix')

        Route.prefix('test')
        expect(prefixSpy.calledWith('test')).toBe(true)

        registerStub.restore()
      })

      it('name()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(RouteCollection, 'register')
        registerStub.returns(builder)
        const nameSpy = Sinon.spy(builder, 'name')

        Route.name('test')
        expect(nameSpy.calledWith('test')).toBe(true)

        registerStub.restore()
      })

      it('group()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(RouteCollection, 'register')
        registerStub.returns(builder)
        const groupSpy = Sinon.spy(builder, 'group')

        function groupFunction() {}
        Route.group(groupFunction)
        expect(groupSpy.calledWith(groupFunction)).toBe(true)

        registerStub.restore()
      })

      it('method()', function() {
        const builder = new RouteBuilder()
        const registerStub = Sinon.stub(RouteCollection, 'register')
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
          const registerStub = Sinon.stub(RouteCollection, 'register')
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
