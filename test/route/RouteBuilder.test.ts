import 'jest'
import * as Sinon from 'sinon'
import { HttpMethod } from '../../lib/http/HttpMethod'
import { RouteBuilder } from '../../lib/http/routing/RouteBuilder'

describe('RouteBuilder', function() {
  describe('constructor', function() {
    it('can create new builder without argument', function() {
      const builder = new RouteBuilder()
      expect(builder['data'].method).toEqual(HttpMethod.GET)
      expect(builder['data'].path).toEqual('')
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
      it('returns private.data', function() {
        const builder = new RouteBuilder('GET', '/')
        expect(builder.getRouteData() === builder['data']).toBe(true)
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

  describe('IRouteGrammarGroup functions', function() {
    // TODO: write test
    describe('group()', function() {
      it('does something', function() {
        const builder = new RouteBuilder()
        builder.group(function() {})
        builder.group(function() {})
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

  describe('IRouteGrammarVerbs functions', function() {
    describe('method()', function() {
      // TODO: write test
      it('does something', function() {
        const builder = new RouteBuilder()
        builder.method(HttpMethod.GET, '/', '')
      })
    })

    describe('http method functions()', function() {
      const list = {
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
          builder[name]('path', 'target')
          expect(methodSpy.calledWith(list[name], 'path', 'target')).toBe(true)

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
})
