import './expectations/JsonExpectation'
import './expectations/StatusExpectation'
import * as SuperTest from 'supertest'
import { HttpTestKit } from '../HttpTestKit'
import { IHttpTestExpectation } from '../IHttpTestExpectation'
import { make } from 'najs-binding'
import { Najs } from '../../../constants'

export class SupertestKit extends HttpTestKit<SuperTest.Test> {
  protected createSuperTest(): SuperTest.SuperTest<SuperTest.Test> {
    return SuperTest(this.testSuite['nativeHttpDriver'])
  }

  makeRequest(method: string, url: string): SuperTest.Test {
    return this.createSuperTest()[method.toLowerCase()](url)
  }

  makeJsonExpectation(body?: any): IHttpTestExpectation<SuperTest.Test> {
    return make(Najs.Test.Http.SuperTest.Expectation.JsonExpectation, [body])
  }

  makeStatusExpectation(status: number): IHttpTestExpectation<SuperTest.Test> {
    return make(Najs.Test.Http.SuperTest.Expectation.StatusExpectation, [status])
  }
}
