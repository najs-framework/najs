import 'jest'
import * as Sinon from 'sinon'
import { ResponseFacade as Response } from '../../../lib/http/response/ResponseFacade'
import { JsonResponse } from '../../../lib/http/response/types/JsonResponse'
import { RedirectResponse } from '../../../lib/http/response/types/RedirectResponse'
import { JsonpResponse } from '../../../lib/http/response/types/JsonpResponse'

describe('ResponseFacade', function() {
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
})

describe('JsonResponse', function() {
  it('can be created with any value', function() {
    const redirect = new JsonResponse({ ok: true })
    expect(redirect['value']).toEqual({ ok: true })
  })

  it('calls IHttpDriver.respondJson and passes response, this.value', function() {
    const response = {}
    const driver = { respondJson(response: any, url: any, status: any) {} }
    const respondJsonSpy = Sinon.spy(driver, 'respondJson')

    const redirect = new JsonResponse('any')
    redirect.respond(response, <any>driver)
    expect(respondJsonSpy.calledWith(response, 'any')).toBe(true)
  })
})

describe('JsonpResponse', function() {
  it('can be created with any value', function() {
    const redirect = new JsonpResponse({ ok: true })
    expect(redirect['value']).toEqual({ ok: true })
  })

  it('calls IHttpDriver.respondJson and passes response, this.value', function() {
    const response = {}
    const driver = { respondJsonp(response: any, url: any, status: any) {} }
    const respondJsonSpy = Sinon.spy(driver, 'respondJsonp')

    const redirect = new JsonpResponse('any')
    redirect.respond(response, <any>driver)
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
    const response = {}
    const driver = { respondRedirect(response: any, url: any, status: any) {} }
    const responseRedirectSpy = Sinon.spy(driver, 'respondRedirect')

    const redirect = new RedirectResponse('/path', 301)
    redirect.respond(response, <any>driver)
    expect(responseRedirectSpy.calledWith(response, '/path', 301)).toBe(true)
  })
})
