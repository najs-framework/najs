import 'jest'
import * as Sinon from 'sinon'
import { JsonpResponse } from '../../../../lib/http/response/types/JsonpResponse'

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
