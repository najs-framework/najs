import 'jest'
import { RouteData } from '../../lib/http/routing/RouteData'

describe('RouteData', function() {
  describe('constructor()', function() {
    it('can be created with no param', function() {
      const data = new RouteData()
      expect(data.method).toBeUndefined()
      expect(data.path).toBeUndefined()
    })

    it('can be created with method', function() {
      const data = new RouteData('GET')
      expect(data.method).toEqual('GET')
      expect(data.path).toBeUndefined()
    })

    it('can be created with method and path', function() {
      const data = new RouteData('GET', '/')
      expect(data.method).toEqual('GET')
      expect(data.path).toEqual('/')
    })
  })

  describe('isValid()', function() {
    it('returns false if there is no method', function() {
      const data = new RouteData()
      expect(data.isValid()).toBe(false)
    })

    it('returns false if method is empty', function() {
      const data = new RouteData('', 'GET')
      expect(data.isValid()).toBe(false)
    })

    it('returns false if there is no path', function() {
      const data = new RouteData('GET')
      expect(data.isValid()).toBe(false)
    })

    it('returns false if path is empty', function() {
      const data = new RouteData('GET', '')
      expect(data.isValid()).toBe(false)
    })

    it('returns false there is no controller and endpoint', function() {
      const data = new RouteData('GET', '/')
      expect(data.isValid()).toBe(false)
    })

    it('returns false if has method, path and controller but endpoint is undefined', function() {
      const data = new RouteData('GET', '/')
      data.controller = {}
      expect(data.isValid()).toBe(false)
    })

    it('returns false if has method, path, endpoint is string but has no controller', function() {
      const data = new RouteData('GET', '/')
      data.endpoint = 'endpoint'
      expect(data.isValid()).toBe(false)
    })

    it('returns false if has method, path, endpoint is string, controller is object but controller[endpoint] is not function', function() {
      const data = new RouteData('GET', '/')
      data.controller = {}
      data.endpoint = 'endpoint'
      expect(data.isValid()).toBe(false)
    })

    it('returns false if has method, path, endpoint is string, controller is class but controller.prototype[endpoint] is not function', function() {
      const data = new RouteData('GET', '/')
      class Test {}
      data.controller = Test
      data.endpoint = 'endpoint'
      expect(data.isValid()).toBe(false)
    })

    it('returns true if has method, path, endpoint is not string nor function', function() {
      const data = new RouteData('GET', '/')
      data.endpoint = <any>{}
      expect(data.isValid()).toBe(false)
    })

    it('returns true if has method, path, endpoint is function', function() {
      const data = new RouteData('GET', '/')
      data.endpoint = () => {}
      expect(data.isValid()).toBe(true)
    })

    it('returns true if has method, path, endpoint is string, controller is object and controller[endpoint] is function', function() {
      const data = new RouteData('GET', '/')
      data.controller = { test() {} }
      data.endpoint = 'test'
      expect(data.isValid()).toBe(true)
    })

    it('returns true if has method, path, endpoint is string, controller is instance and controller.prototype[endpoint] is function', function() {
      const data = new RouteData('GET', '/')
      class Test {
        endpoint() {}
      }
      data.controller = new Test()
      data.endpoint = 'endpoint'
      expect(data.isValid()).toBe(true)
    })

    it('returns true if has method, path, endpoint is string, controller is class and controller.prototype[endpoint] is function', function() {
      const data = new RouteData('GET', '/')
      class Test {
        endpoint() {}
      }
      data.controller = Test
      data.endpoint = 'endpoint'
      expect(data.isValid()).toBe(true)
    })

    it('returns true if has method, path, endpoint is function', function() {
      const data = new RouteData('GET', '/')
      data.endpoint = function() {}
      expect(data.isValid()).toBe(true)
    })
  })

  describe('getData()', function() {
    it('returns undefined if isValid() === true', function() {
      const data = new RouteData()
      expect(data.getData()).toBeUndefined()
    })

    it('converts to IRouteData with new object if parent is undefined', function() {
      const data = new RouteData('GET', '/path')
      function endpoint() {}
      data.endpoint = endpoint

      const result = data.getData()
      expect(result === data).toBe(false)
      expect(result).toEqual({
        method: 'GET',
        path: '/path',
        endpoint: endpoint,
        prefix: '',
        middleware: []
      })
    })

    it('assigns if exists and metadata is a pointer to RouteData', function() {
      const data = new RouteData('GET', '/path')
      function endpoint() {}
      data.metadata = { any: 'thing' }
      data.endpoint = endpoint

      const result = data.getData()
      expect((result as any).metadata === data.metadata).toBe(true)
      expect(result === data).toBe(false)
      expect(result).toEqual({
        metadata: { any: 'thing' },
        method: 'GET',
        path: '/path',
        endpoint: endpoint,
        prefix: '',
        middleware: []
      })
    })

    it('merges parent prefix to result if parent exists', function() {
      const parent = new RouteData()
      parent.prefix = '/prefix'

      const data = new RouteData('GET', '/path')
      function endpoint() {}
      data.endpoint = endpoint

      let result = data.getData(parent)
      expect(result === data).toBe(false)
      expect(result).toEqual({
        method: 'GET',
        path: '/path',
        endpoint: endpoint,
        prefix: '/prefix',
        middleware: []
      })

      data.isPrefixMerged = false
      data.prefix = '/test'
      result = data.getData(parent)
      expect(result === data).toBe(false)
      expect(result).toEqual({
        method: 'GET',
        path: '/path',
        endpoint: endpoint,
        prefix: '/prefix/test',
        middleware: []
      })
    })

    it('merges parent middleware to result if parent exists and reduce duplicated even middleware is function or object', function() {
      const a = () => {}
      const b = {}
      const c = () => {}
      const d = {}
      const pf = () => {}
      const po = () => {}

      const parent = new RouteData()
      parent.middleware = [a, b, 'e', 'g', 'h', pf, po]

      const data = new RouteData('GET', '/path')
      function endpoint() {}
      data.middleware = [a, b, c, d, 'e', 'f']
      data.endpoint = endpoint

      const result = data.getData(parent)
      expect(result === data).toBe(false)
      expect(result).toEqual({
        method: 'GET',
        path: '/path',
        endpoint: endpoint,
        prefix: '',
        middleware: [a, b, 'e', 'g', 'h', pf, po, c, d, 'f']
      })
    })
  })
})
