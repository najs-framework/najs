import { IHttpTest } from './IHttpTest'
import { TestSuite } from '../TestSuite'
import { HttpTestExpectations, IHttpTestExpectation } from './IHttpTestExpectation'
import { flatten } from 'lodash'

export abstract class HttpTestKit<T extends IHttpTest> {
  protected testSuite: TestSuite

  constructor(testSuite: TestSuite) {
    this.testSuite = testSuite
  }

  abstract makeRequest(method: string, url: string): T

  abstract makeJsonExpectation(body?: any): IHttpTestExpectation<T>

  abstract makeStatusExpectation(status: number): IHttpTestExpectation<T>

  makeRequestAndSendData(method: string, url: string, data?: string | object) {
    const test: T = this.makeRequest(method, url)
    return typeof data === 'undefined' ? test : test.send(data)
  }

  applyExpectations(test: T, ...expectations: HttpTestExpectations<T>) {
    const testExpectations = flatten(expectations)
    testExpectations.forEach((expectation: IHttpTestExpectation<T>) => {
      test = expectation.injectExpectation(test)
    })
  }
}
