/// <reference types="najs-binding" />

import * as SuperTest from 'supertest'
import { Najs } from '../../../../constants'
import { register } from 'najs-binding'
import { IHttpTestExpectation } from '../../IHttpTestExpectation'

export class StatusExpectation implements Najs.Contracts.Autoload, IHttpTestExpectation<SuperTest.Test> {
  static className = Najs.Test.Http.SuperTest.Expectation.StatusExpectation
  protected status: any

  constructor(status: number) {
    this.status = status
  }

  getClassName() {
    return Najs.Test.Http.SuperTest.Expectation.StatusExpectation
  }

  injectExpectation(test: SuperTest.Test): SuperTest.Test {
    return test.expect(this.status)
  }
}
register(StatusExpectation, Najs.Test.Http.SuperTest.Expectation.StatusExpectation)
