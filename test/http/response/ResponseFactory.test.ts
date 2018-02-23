import 'jest'
import * as Sinon from 'sinon'
import { ResponseFactory } from '../../../lib/http/response/ResponseFactory'
import { ViewResponse } from '../../../lib/http/response/types/ViewResponse'
import { JsonResponse } from '../../../lib/http/response/types/JsonResponse'
import { RedirectResponse } from '../../../lib/http/response/types/RedirectResponse'
import { BackResponse } from '../../../lib/http/response/types/BackResponse'
import { JsonpResponse } from '../../../lib/http/response/types/JsonpResponse'
import { Facade } from '../../../lib/facades/Facade'
import { GlobalFacadeClass } from '../../../lib/constants'
import { ClassRegistry } from 'najs-binding'

describe('ResponseFacade', function() {
  const Response = new ResponseFactory()
  it('extends from Facade so it definitely a FacadeClass', function() {
    expect(Response).toBeInstanceOf(Facade)
    expect(Response.getClassName()).toEqual(GlobalFacadeClass.Response)
    expect(ClassRegistry.has(GlobalFacadeClass.Response)).toBe(true)
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

describe('ViewResponse', function() {
  it('can be created with view only', function() {
    const view = new ViewResponse('view')
    expect(view['view']).toEqual('view')
    expect(view['variables']).toEqual({})
  })

  it('can be created with any view and variables', function() {
    const view = new ViewResponse('view', { any: 'thing' })
    expect(view['view']).toEqual('view')
    expect(view['variables']).toEqual({ any: 'thing' })
  })

  it('calls IHttpDriver.respondView and passes response, this.view, this.variables', function() {
    const request = {}
    const response = {}
    const driver = { respondView() {} }
    const respondViewSpy = Sinon.spy(driver, 'respondView')

    const view = new ViewResponse('view', { any: 'thing' })
    view.respond(request, response, <any>driver)
    expect(respondViewSpy.calledWith(response, 'view', { any: 'thing' })).toBe(true)
  })

  describe('getVariables()', function() {
    it('returns variables property', function() {
      const view = new ViewResponse('view', { any: 'thing' })
      expect(view['variables'] === view.getVariables()).toBe(true)
    })
  })

  describe('with(name, value)', function() {
    it('sets name, value to variables', function() {
      const view = new ViewResponse('view')
      view.with('name', 123)
      view.with('test', 'something')
      view.with('undefined', undefined)
      view.with('name', 456)
      expect(view.getVariables()).toEqual({
        name: 456,
        test: 'something',
        undefined: undefined
      })
    })
  })
})

describe('JsonResponse', function() {
  it('can be created with any value', function() {
    const json = new JsonResponse({ ok: true })
    expect(json['value']).toEqual({ ok: true })
  })

  it('calls IHttpDriver.respondJson and passes response, this.value', function() {
    const request = {}
    const response = {}
    const driver = { respondJson() {} }
    const respondJsonSpy = Sinon.spy(driver, 'respondJson')

    const json = new JsonResponse('any')
    json.respond(request, response, <any>driver)
    expect(respondJsonSpy.calledWith(response, 'any')).toBe(true)
  })
})

describe('JsonpResponse', function() {
  it('can be created with any value', function() {
    const redirect = new JsonpResponse({ ok: true })
    expect(redirect['value']).toEqual({ ok: true })
  })

  it('calls IHttpDriver.respondJson and passes response, this.value', function() {
    const request = {}
    const response = {}
    const driver = { respondJsonp(response: any, url: any, status: any) {} }
    const respondJsonSpy = Sinon.spy(driver, 'respondJsonp')

    const redirect = new JsonpResponse('any')
    redirect.respond(request, response, <any>driver)
    expect(respondJsonSpy.calledWith(response, 'any')).toBe(true)
  })
})

describe('RedirectResponse', function() {
  it('can be created with default status = 302', function() {
    const redirect = new RedirectResponse('/path')
    expect(redirect['url']).toEqual('/path')
    expect(redirect['status']).toEqual(302)
  })

  it('can be created with custom status', function() {
    const redirect = new RedirectResponse('/path', 301)
    expect(redirect['url']).toEqual('/path')
    expect(redirect['status']).toEqual(301)
  })

  it('calls IHttpDriver.respondRedirect and passes response, this.url, this.status', function() {
    const request = {}
    const response = {}
    const driver = { respondRedirect(response: any, url: any, status: any) {} }
    const responseRedirectSpy = Sinon.spy(driver, 'respondRedirect')

    const redirect = new RedirectResponse('/path', 301)
    redirect.respond(request, response, <any>driver)
    expect(responseRedirectSpy.calledWith(response, '/path', 301)).toBe(true)
  })
})

describe('BackResponse', function() {
  it('can be created with default url = /', function() {
    const redirect = new BackResponse()
    expect(redirect['defaultUrl']).toEqual('/')
  })

  it('can be created with custom default url', function() {
    const redirect = new BackResponse('/path')
    expect(redirect['defaultUrl']).toEqual('/path')
  })

  it('calls IHttpDriver.respondRedirect and passes response, request.header("Referer"), status 302', function() {
    const request = {
      header() {
        return 'anything'
      }
    }
    const response = {}
    const driver = { respondRedirect(response: any, url: any, status: any) {} }
    const responseRedirectSpy = Sinon.spy(driver, 'respondRedirect')

    const redirect = new BackResponse('/path')
    redirect.respond(request, response, <any>driver)
    expect(responseRedirectSpy.calledWith(response, 'anything', 302)).toBe(true)
  })

  it('calls IHttpDriver.respondRedirect and passes response, this.defaultUrl, status 302 if there is no Referer in header', function() {
    const request = {
      header() {
        return undefined
      }
    }
    const response = {}
    const driver = { respondRedirect(response: any, url: any, status: any) {} }
    const responseRedirectSpy = Sinon.spy(driver, 'respondRedirect')

    const redirect = new BackResponse('/path')
    redirect.respond(request, response, <any>driver)
    expect(responseRedirectSpy.calledWith(response, '/path', 302)).toBe(true)
  })
})
