/// <reference types="najs-binding" />

import * as SuperTest from 'supertest'
import { Najs } from '../../../../constants'
import { register } from 'najs-binding'
import { IHttpTestExpectation } from '../../IHttpTestExpectation'

export class JsonExpectation implements Najs.Contracts.Autoload, IHttpTestExpectation<SuperTest.Test> {
  static className = Najs.Test.Http.SuperTest.Expectation.JsonExpectation
  protected body: any

  constructor(body?: any) {
    this.body = body
  }

  getClassName() {
    return Najs.Test.Http.SuperTest.Expectation.JsonExpectation
  }

  injectExpectation(test: SuperTest.Test): SuperTest.Test {
    test.expect('content-type', /application\/json/)

    if (typeof this.body !== 'undefined') {
      return test.expect((response: any) => {
        // TODO: use assert instead of native expect() provided by jest
        expect(response.body).toEqual(this.body)
      })
    }

    return test
  }
}
register(JsonExpectation, Najs.Test.Http.SuperTest.Expectation.JsonExpectation)
