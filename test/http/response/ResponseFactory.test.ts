import 'jest'
import { ResponseFactory } from '../../../lib/http/response/ResponseFactory'
import { ViewResponse } from '../../../lib/http/response/ViewResponse'
import { JsonResponse } from '../../../lib/http/response/JsonResponse'
import { RedirectResponse } from '../../../lib/http/response/RedirectResponse'
import { BackResponse } from '../../../lib/http/response/BackResponse'
import { JsonpResponse } from '../../../lib/http/response/JsonpResponse'
import { Facade } from 'najs-facade'
import { ClassRegistry } from 'najs-binding'

describe('ResponseFacade', function() {
  const Response = new ResponseFactory()
  it('extends from Facade so it definitely a FacadeClass', function() {
    expect(Response).toBeInstanceOf(Facade)
    expect(Response.getClassName()).toEqual('Najs.Http.ResponseFactory')
    expect(ClassRegistry.has('Najs.Http.ResponseFactory')).toBe(true)
  })

  describe('view', function() {
    it('creates new instance of ViewResponse', function() {
      const result = Response.view('test')
      expect(result).toBeInstanceOf(ViewResponse)
      expect(result['view']).toEqual('test')
      expect(result['variables']).toEqual({})
    })
  })

  describe('json', function() {
    it('creates new instance of JsonResponse', function() {
      const result = Response.json('test')
      expect(result).toBeInstanceOf(JsonResponse)
      expect(result['value']).toEqual('test')
    })
  })

  describe('jsonp', function() {
    it('creates new instance of JsonpResponse', function() {
      const result = Response.jsonp('test')
      expect(result).toBeInstanceOf(JsonpResponse)
      expect(result['value']).toEqual('test')
    })
  })

  describe('redirect', function() {
    it('creates new instance of RedirectResponse', function() {
      let result = Response.redirect('/path')
      expect(result).toBeInstanceOf(RedirectResponse)
      expect(result['url']).toEqual('/path')
      expect(result['status']).toEqual(302)

      result = Response.redirect('/path', 301)
      expect(result).toBeInstanceOf(RedirectResponse)
      expect(result['url']).toEqual('/path')
      expect(result['status']).toEqual(301)
    })
  })

  describe('back', function() {
    it('creates new instance of BackResponse', function() {
      let result = Response.back()
      expect(result).toBeInstanceOf(BackResponse)
      expect(result['defaultUrl']).toEqual('/')

      result = Response.back('/path')
      expect(result).toBeInstanceOf(BackResponse)
      expect(result['defaultUrl']).toEqual('/path')
    })
  })
})
