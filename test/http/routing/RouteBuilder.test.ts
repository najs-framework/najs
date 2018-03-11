import 'jest'
import * as Sinon from 'sinon'
import { HttpMethod } from '../../../lib/http/HttpMethod'
import { RouteBuilder } from '../../../lib/http/routing/RouteBuilder'
import { Controller } from '../../../lib/http/controller/Controller'

describe('RouteBuilder', function() {
  describe('constructor', function() {
    it('can create new builder without argument', function() {
      const builder = new RouteBuilder()
      expect(builder['data'].method).toBeUndefined()
      expect(builder['data'].path).toBeUndefined()
      expect(builder['children']).toEqual([])
    })

    it('can create new builder method and path', function() {
      const builder = new RouteBuilder('GET', '/')
      expect(builder['data'].method).toEqual('GET')
      expect(builder['data'].path).toEqual('/')
      expect(builder['children']).toEqual([])
    })
  })

  describe('IRouteBuilder functions', function() {
    describe('getRouteData()', function() {
      it('returns empty array if builder is not valid route', function() {
        const builder = new RouteBuilder()
        expect(builder.getRouteData()).toEqual([])
      })

      it('returns data itself if there is no children', function() {
        const builder = new RouteBuilder()
        builder.get('/test', 'Controller@endpoint')
        expect(builder.getRouteData()).toEqual([
          {
            method: 'GET',
            path: '/test',
            controller: 'Controller',
            endpoint: 'endpoint',
            prefix: '',
            middleware: []
          }
        ])
      })

      it('returns children data which already merged', function() {
        const a = () => {}
        const b = {}
        const builder = new RouteBuilder()
        builder['data']['prefix'] = '/prefix'
        builder['data']['middleware'] = [a, b, 'c']

        const childA = new RouteBuilder()
        childA.get('/test', 'Controller@endpointGet')
        const childB = new RouteBuilder()
        childB.post('/ok', 'Controller@endpointPost')

        builder['children'].push(childA)
        builder['children'].push(childB)

        expect(builder.getRouteData()).toEqual([
          {
            method: 'GET',
            path: '/test',
            controller: 'Controller',
            endpoint: 'endpointGet',
            prefix: '/prefix',
            middleware: [a, b, 'c']
          },
          {
            method: 'POST',
            path: '/ok',
            controller: 'Controller',
            endpoint: 'endpointPost',
            prefix: '/prefix',
            middleware: [a, b, 'c']
          }
        ])
      })

      it('returns children data which already merged with multiple levels', function() {
        const a = () => {}
        const b = {}
        const builder = new RouteBuilder()
        builder['data']['prefix'] = '/prefix'
        builder['data']['middleware'] = [a, b, 'c']

        const childA = new RouteBuilder()
        childA.get('/test', 'Controller@endpointGet')

        const childB = new RouteBuilder()
        childB['data']['prefix'] = '/b'
        childB['data']['middleware'] = ['d']
        const grantChild = new RouteBuilder()
        grantChild.delete('/hum', 'Controller@endpointDelete')
        childB['children'].push(grantChild)

        builder['children'].push(childA)
        builder['children'].push(childB)

        expect(builder.getRouteData()).toEqual([
          {
            method: 'GET',
            path: '/test',
            controller: 'Controller',
            endpoint: 'endpointGet',
            prefix: '/prefix',
            middleware: [a, b, 'c']
          },
          {
            method: 'DELETE',
            path: '/hum',
            controller: 'Controller',
            endpoint: 'endpointDelete',
            prefix: '/prefix/b',
            middleware: [a, b, 'c', 'd']
          }
        ])
      })
    })

    describe('shouldRegisterChildRoute()', function() {
      it('does not register to child if there is no metadata', function() {
        const builder = new RouteBuilder('GET', '/')
        expect(builder.shouldRegisterChildRoute()).toBe(false)
      })

      it('does not register to child if metadata does not contain grouped', function() {
        const builder = new RouteBuilder('GET', '/')
        builder['data']['metadata'] = {}
        expect(builder.shouldRegisterChildRoute()).toBe(false)
      })

      it('does not register to child if metadata contains grouped but does not equal true', function() {
        const builder = new RouteBuilder('GET', '/')
        builder['data']['metadata'] = { grouped: false }
        expect(builder.shouldRegisterChildRoute()).toBe(false)
      })

      it('registers to child if metadata contains grouped equals true', function() {
        const builder = new RouteBuilder('GET', '/')
        builder['data']['metadata'] = { grouped: true }
        expect(builder.shouldRegisterChildRoute()).toBe(true)
      })
    })

    describe('hasChildRoute()', function() {
      it('returns false if this.children.length === 0', function() {
        const builder = new RouteBuilder('GET', '/')
        expect(builder.hasChildRoute()).toBe(false)
      })

      it('returns true if this.children.length === 0', function() {
        const builder = new RouteBuilder('GET', '/')
        builder['children'] = <any>['any']
        expect(builder.hasChildRoute()).toBe(true)
      })
    })

    describe('registerChildRoute()', function() {
      it('pushes child to children if it empty', function() {
        const parent = new RouteBuilder()
        const child = new RouteBuilder('GET', '/')
        parent.registerChildRoute(child)
        expect(parent['children']).toHaveLength(1)
        expect(parent['children'][0]).toEqual(child)
      })

      it('pushes child to children if it not empty and the last-child has result shouldRegisterChildRoute() is false', function() {
        const parent = new RouteBuilder()
        const childAlpha = new RouteBuilder('GET', '/')
        const childBeta = new RouteBuilder('POST', '/')
        parent.registerChildRoute(childAlpha)
        parent.registerChildRoute(childBeta)
        expect(parent['children']).toHaveLength(2)
        expect(parent['children'][0]).toEqual(childAlpha)
        expect(parent['children'][1]).toEqual(childBeta)
      })

      it('calls last-child.registerChildRoute() if last-child.shouldRegisterChildRoute() is true', function() {
        const parent = new RouteBuilder()
        const lastChild = new RouteBuilder('GET', '/')
        lastChild['data']['metadata'] = { grouped: true }

        const childBeta = new RouteBuilder('POST', '/')
        parent.registerChildRoute(lastChild)
        parent.registerChildRoute(childBeta)
        expect(parent['children']).toHaveLength(1)
        expect(parent['children'][0]).toEqual(lastChild)
        expect(parent['children'][0]['children']).toHaveLength(1)
        expect(parent['children'][0]['children'][0]).toEqual(childBeta)
      })
    })
  })

  describe('IRouteGrammarControl functions', function() {
    describe('middleware()', function() {
      it('appends middleware with multiple parameters and flatten if any param is an array', function() {
        const builder = new RouteBuilder()
        expect(builder['data'].middleware).toEqual([])
        builder.middleware('a', ['b', 'c'], 'd')
        expect(builder['data'].middleware).toEqual(['a', 'b', 'c', 'd'])
        builder.middleware('e', 'f')
        expect(builder['data'].middleware).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
      })

      it('accepts middleware as a function', function() {
        const builder = new RouteBuilder()
        function a() {}
        function b() {}
        function c() {}
        function d() {}
        expect(builder['data'].middleware).toEqual([])
        builder.middleware([a, b, c], d, ['e', 'f'])
        expect(builder['data'].middleware).toEqual([a, b, c, d, 'e', 'f'])
      })

      it('accepts middleware as an object', function() {
        const builder = new RouteBuilder()
        const a = {}
        const b = {}
        const c = {}
        function d() {}
        expect(builder['data'].middleware).toEqual([])
        builder.middleware([a], [b, c], d, ['e', 'f'])
        expect(builder['data'].middleware).toEqual([a, b, c, d, 'e', 'f'])
      })

      it('removes invalid type of middleware such as number or boolean', function() {
        const builder = new RouteBuilder()
        const a = {}
        function b() {}
        expect(builder['data'].middleware).toEqual([])
        builder.middleware(<any>true, a, [b, <any>12], 'c', <any>12, 'd')
        expect(builder['data'].middleware).toEqual([a, b, 'c', 'd'])
      })
    })

    describe('use()', function() {
      it('just .middleware() alias', function() {
        const builder = new RouteBuilder()
        const middlewareSpy = Sinon.spy(builder, 'middleware')
        builder.use('test', 'abc', ['a', 'b'])
        expect(middlewareSpy.calledWith('test', 'abc', ['a', 'b'])).toBe(true)
      })
    })

    describe('prefix()', function() {
      it('assigns parameter to data.prefix, and overrides if called again', function() {
        const builder = new RouteBuilder()
        expect(builder['data'].prefix).toEqual('')
        builder.prefix('test')
        expect(builder['data'].prefix).toEqual('test')
        builder.prefix('change')
        expect(builder['data'].prefix).toEqual('change')
      })
    })
  })

  describe('IRouteGrammarNamed functions', function() {
    describe('name()', function() {
      it('assign name to data.name', function() {
        const builder = new RouteBuilder()
        expect(builder['data'].name).toBeUndefined()
        builder.name('test')
        expect(builder['data'].name).toEqual('test')
        builder.name('change')
        expect(builder['data'].name).toEqual('change')
      })
    })
  })

  describe('IRouteGrammarGroup functions', function() {
    describe('group()', function() {
      it('creates metadata.grouped even metadata is undefined', function() {
        const builder = new RouteBuilder()
        expect(builder['data']['metadata']).toBeUndefined()
        builder.group(() => {})
        expect(builder['data']['metadata']).toEqual({})
      })

      it('set metadata.grouped and call callback, after that it deletes grouped', function() {
        const builder = new RouteBuilder()
        builder['data']['metadata'] = {}
        const metadata: any = builder['data']['metadata']
        expect(metadata['grouped']).toBeUndefined()
        builder.group(function() {
          expect(metadata['grouped']).toBe(true)
        })
        expect(metadata['grouped']).toBeUndefined()
      })
    })
  })

  describe('IRouteGrammarVerbs functions', function() {
    describe('method()', function() {
      it('assigns method, path to data.method/data.path', function() {
        const builder = new RouteBuilder()
        builder.method(HttpMethod.OPTIONS, '/any/:id', function() {})
        expect(builder['data'].method).toEqual(HttpMethod.OPTIONS)
        expect(builder['data'].path).toEqual('/any/:id')
      })

      it('allows endpoint as a function', function() {
        const builder = new RouteBuilder()

        function endpoint() {}
        builder.method(HttpMethod.POST, '/path', endpoint)
        expect(builder['data'].method).toEqual(HttpMethod.POST)
        expect(builder['data'].path).toEqual('/path')
        expect(builder['data'].endpoint).toEqual(endpoint)
        expect(builder['data'].controller).toBeUndefined
      })

      it('allows endpoint with format ControllerName@endpointName', function() {
        const builder = new RouteBuilder()

        builder.method(HttpMethod.POST, '/path', 'Controller@endpoint')
        expect(builder['data'].method).toEqual(HttpMethod.POST)
        expect(builder['data'].path).toEqual('/path')
        expect(builder['data'].endpoint).toEqual('endpoint')
        expect(builder['data'].controller).toEqual('Controller')
      })

      it('allows 4 params format with Object and endpoint name', function() {
        const builder = new RouteBuilder()
        const controller = {
          getUsers() {}
        }
        builder.method(HttpMethod.POST, '/path', controller, 'getUsers')
        expect(builder['data'].method).toEqual(HttpMethod.POST)
        expect(builder['data'].path).toEqual('/path')
        expect(builder['data'].endpoint).toEqual('getUsers')
        expect(builder['data'].controller).toEqual(controller)
      })

      it('allows 4 params format with Controller instance and endpoint name', function() {
        const builder = new RouteBuilder()

        class UsersController extends Controller {
          getClassName() {
            return 'UsersController'
          }

          getUsers() {}
        }
        const controller = new UsersController(<any>{}, <any>{})

        builder.method(HttpMethod.POST, '/path', controller, 'getUsers')
        expect(builder['data'].method).toEqual(HttpMethod.POST)
        expect(builder['data'].path).toEqual('/path')
        expect(builder['data'].endpoint).toEqual('getUsers')
        expect(builder['data'].controller).toEqual(controller)
      })

      it('allows 4 params format with Controller class and endpoint name', function() {
        const builder = new RouteBuilder()

        class UsersController extends Controller {
          getClassName() {
            return 'UsersController'
          }

          getUsers() {}
        }
        builder.method(HttpMethod.POST, '/path', UsersController, 'getUsers')
        expect(builder['data'].method).toEqual(HttpMethod.POST)
        expect(builder['data'].path).toEqual('/path')
        expect(builder['data'].endpoint).toEqual('getUsers')
        expect(builder['data'].controller).toEqual(UsersController)
      })

      it('does not allow endpoint in Object and but endpoint name not found', function() {
        const builder = new RouteBuilder()
        const controller = {
          getUsers() {}
        }
        try {
          builder.method(HttpMethod.POST, '/path', controller, 'getUsersNotFound')
        } catch (error) {
          expect(error).toBeInstanceOf(ReferenceError)
          expect(error.message).toEqual('Endpoint getUsersNotFound not found')
          return
        }
        expect('should not reach here').toEqual('hmm')
      })

      it('does not allow endpoint with Controller instance and but endpoint name not found', function() {
        const builder = new RouteBuilder()

        class UsersController extends Controller {
          getClassName() {
            return 'UsersController'
          }

          getUsers() {}
        }
        const controller = new UsersController(<any>{}, <any>{})

        try {
          builder.method(HttpMethod.POST, '/path', controller, 'getUsersNotFound')
        } catch (error) {
          expect(error).toBeInstanceOf(ReferenceError)
          expect(error.message).toEqual('Endpoint getUsersNotFound not found')
          return
        }
        expect('should not reach here').toEqual('hmm')
      })

      it('does not allow endpoint with Controller class and but endpoint name not found', function() {
        const builder = new RouteBuilder()

        class UsersController extends Controller {
          getClassName() {
            return 'UsersController'
          }

          getUsers() {}
        }
        try {
          builder.method(HttpMethod.POST, '/path', UsersController, 'getUsersNotFound')
        } catch (error) {
          expect(error).toBeInstanceOf(ReferenceError)
          expect(error.message).toEqual('Endpoint getUsersNotFound not found')
          return
        }
        expect('should not reach here').toEqual('hmm')
      })

      it('throws Error if endpoint is a string but not in format ControllerName@endpointName', function() {
        const builder = new RouteBuilder()
        try {
          builder.method(HttpMethod.POST, '/path', 'Controller/Endpoint')
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
          expect(error.message).toEqual(
            'Target "Controller/Endpoint" is invalid. Correct format: ControllerName@endpointName'
          )
          return
        }
        expect('should not reach here').toEqual('hmm')
      })

      it('throws TypeError if somehow use method in wrong way with 3 params', function() {
        const builder = new RouteBuilder()
        try {
          builder.method(HttpMethod.POST, '/path', <any>123)
        } catch (error) {
          expect(error).toBeInstanceOf(TypeError)
          expect(error.message).toEqual('Invalid Route')
          return
        }
        expect('should not reach here').toEqual('hmm')
      })

      it('throws TypeError if somehow use method in wrong way with 4 params', function() {
        const builder = new RouteBuilder()
        try {
          builder.method(HttpMethod.POST, '/path', <any>123, 'test')
        } catch (error) {
          expect(error).toBeInstanceOf(TypeError)
          expect(error.message).toEqual('Invalid Route')
          return
        }
        expect('should not reach here').toEqual('hmm')
      })
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
      it(name + '() calls .method() function with HttpMethod.' + list[name], function() {
        const builder = new RouteBuilder()
        const methodSpy = Sinon.spy(builder, 'method')
        builder[name]('path', 'controller@endpoint')
        expect(methodSpy.calledWith(list[name], 'path', 'controller@endpoint')).toBe(true)

        function handler() {}
        builder[name]('path', handler)
        expect(methodSpy.calledWith(list[name], 'path', handler)).toBe(true)

        const Controller = {
          endpoint: function() {}
        }
        builder[name]('path', Controller, 'endpoint')
        expect(methodSpy.calledWith(list[name], 'path', Controller, 'endpoint')).toBe(true)
      })
    }
  })
})
