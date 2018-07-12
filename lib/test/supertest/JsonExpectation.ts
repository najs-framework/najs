import * as SuperTest from 'supertest'
import { Najs } from '../../constants'
import { register } from 'najs-binding'
import { ISuperTestExpectation } from './ISuperTestExpectation'

export class JsonExpectation implements ISuperTestExpectation {
  static className = Najs.Test.SuperTestExpectation.JsonExpectation
  protected body: any

  constructor(body?: any) {
    this.body = body
  }

  injectExpectation(test: SuperTest.Test): SuperTest.Test {
    test.expect('content-type', /application\/json/)

    if (typeof this.body !== 'undefined') {
      return test.expect((response: any) => {
        expect(response.body).toEqual(this.body)
      })
    }

    return test
  }
}
register(JsonExpectation, Najs.Test.SuperTestExpectation.JsonExpectation)
