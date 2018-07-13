import { IHttpTest } from './IHttpTest'
import { TestSuite } from '../TestSuite'
import { IHttpTestExpectation } from './IHttpTestExpectation'

export enum HttpExpectationEnum {
  Json,
  Status
}

export abstract class HttpTestKit<T extends IHttpTest> {
  protected testSuite: TestSuite

  constructor(testSuite: TestSuite) {
    this.testSuite = testSuite
  }

  abstract makeRequest(method: string, url: string): T

  abstract makeExpectation(name: HttpExpectationEnum, data: any[]): IHttpTestExpectation<T>

  makeJsonExpectation(body?: any): IHttpTestExpectation<T> {
    return this.makeExpectation(HttpExpectationEnum.Json, [body])
  }

  makeStatusExpectation(status: number): IHttpTestExpectation<T> {
    return this.makeExpectation(HttpExpectationEnum.Status, [status])
  }

  makeRequestAndSendData(method: string, url: string, data?: string | object) {
    const test: T = this.makeRequest(method, url)
    if (data) {
      return test.send(data)
    }
    return test
  }
}
