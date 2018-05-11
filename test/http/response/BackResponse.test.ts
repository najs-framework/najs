import 'jest'
import * as Sinon from 'sinon'
import { BackResponse } from '../../../lib/http/response/BackResponse'

describe('BackResponse', function() {
  it('implements contract Najs.Contracts.Response with class name Najs.Http.Response.BackResponse', function() {
    const response = new BackResponse()
    expect(response.getClassName()).toEqual('Najs.Http.Response.BackResponse')
  })

  it('can be created with default url = /', function() {
    const response = new BackResponse()
    expect(response['defaultUrl']).toEqual('/')
  })

  it('can be created with custom default url', function() {
    const response = new BackResponse('/path')
    expect(response['defaultUrl']).toEqual('/path')
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
