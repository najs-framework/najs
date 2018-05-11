import 'jest'
import * as Sinon from 'sinon'
import { JsonResponse } from '../../../lib/http/response/JsonResponse'

describe('JsonResponse', function() {
  it('implements contract Najs.Contracts.Response with class name Najs.Http.Response.JsonResponse', function() {
    const response = new JsonResponse({})
    expect(response.getClassName()).toEqual('Najs.Http.Response.JsonResponse')
  })

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
