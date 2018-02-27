import 'jest'
import * as Sinon from 'sinon'
import { JsonResponse } from '../../../../lib/http/response/types/JsonResponse'

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
